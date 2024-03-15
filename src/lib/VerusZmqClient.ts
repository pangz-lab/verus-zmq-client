import { Subscriber } from "zeromq";
import { VerusZmqOptions } from "./VerusZmqOptions";

export class VerusZmqClient {
    private options: VerusZmqOptions;
    private sub: Subscriber;

    constructor(
        options: VerusZmqOptions,
        sub: Subscriber = new Subscriber()) {
        this.options = options;
        this.sub = sub;
    }

    connect(): VerusZmqClient {
        try {
            this.sub.connect(this.options.connection.getAddress());
            return this;
        } catch (e) {
            throw new Error(`Failed to connect to the ZMQ server.\nError Detail: ${e}`);
        }
    }

    async listen(): Promise<void> {
        this.subscribe();
        await this.listenForEvents();
    }

    disconnect(): void {
        try {
            this.sub.disconnect(this.options.connection.getAddress());
        } catch (e) {
            throw new Error(`Failed to disconnect from the ZMQ server.\nError Detail: ${e}`);
        }
    }

    private subscribe(): void {
        this.options.topics.map((t) => this.sub.subscribe(t));
    }
    
    private async listenForEvents(): Promise<void> {
        const eh = this.options.getEventHandlers();
        for await (const [topic, message] of this.sub) {
            const stringTopic = topic.toString();
            const stringMessage = message.toString('hex')
            const eventName = this.getEventName(stringTopic);
            try {
                const beforeEventResult = eh['before'](stringMessage, stringTopic);
                const receivedEventResult = eh[eventName](stringMessage, stringTopic, beforeEventResult!);
                eh['after'](stringMessage, stringTopic, receivedEventResult!);
            } catch (e) {
                throw new Error(`Failed to process ZMQ data.\nTopic ${stringTopic}\nData: ${stringMessage}.\nError Detail: ${e}`);
            }
        }
    }

    private getEventName(topic: string): string {
        const t = topic.toLocaleLowerCase();
        var result = "on";
        result += (t.includes("raw")) ? "Raw" : "Hash";
        result += (t.includes("block")) ? "Block" : "Tx";
        return result + 'Received';
    }
}