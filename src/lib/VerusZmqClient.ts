import { Observer, Subscriber } from "zeromq";
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
            this.sub.connect(this.connectionString);
            this.subscribe();
            console.info(`Connected to ${this.connectionString}...`);
            return this;
        } catch (e) {
            throw new Error(`Failed to connect to the ZMQ server.\nError Detail: ${e}`);
        }
    }

    get nativeEvents(): Observer { return this.sub.events; }
    private get connectionString(): string { return this.options.connection.getAddress(); }

    async listen(): Promise<void> {
        const eh = this.options.getEventHandlers();
        for await (const [rawTopic, rawMessage] of this.sub) {
            const stringTopic = rawTopic.toString();
            const stringMessage = rawMessage.toString('hex')
            const eventName = this.getEventName(stringTopic);
            try {
                const beforeEventResult = eh['before'](rawMessage, stringTopic);
                const receivedEventResult = eh[eventName](stringMessage, stringTopic, beforeEventResult!);
                eh['after'](stringMessage, stringTopic, receivedEventResult!);
            } catch (e) {
                throw new Error(`Failed to process ZMQ data.\nTopic ${stringTopic}:${eventName} \nData: ${stringMessage}.\nError Detail: ${e}`);
            }
        }
    }

    disconnect(): void {
        try {
            this.unsubscribe();
            this.sub.disconnect(this.connectionString);
            this.sub.close();
            console.info(`Disconnected from ${this.connectionString}...`);
        } catch (e) {
            throw new Error(`Failed to disconnect from the ZMQ server.\nError Detail: ${e}`);
        }
    }

    private subscribe(): void {
        this.options.topics.forEach((t) => this.sub.subscribe(t));
    }
    
    private unsubscribe(): void {
        this.options.topics.forEach((t) => this.sub.unsubscribe(t));
    }
    
    private getEventName(topic: string): string {
        const t = topic.toLocaleLowerCase();
        if(t.includes("sequence")) { return "onSequenceReceived"; }

        var result = "on";
        result += (t.includes("raw")) ? "Raw" : "Hash";
        result += (t.includes("block")) ? "Block" : "Tx";
        return result + 'Received';
    }
}