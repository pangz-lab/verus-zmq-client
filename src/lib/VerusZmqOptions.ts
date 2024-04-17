type BeforeEventCallback = (value: EventData, topic?: string) => Object;
type AfterEventCallback = (value: EventData, topic?: string, result?: Object) => void;
type ReceivedEventCallback = (value: EventData, topic?: string, result?: Object) => Object;
export type EventData = string | Buffer;

export interface EventReturn {
    [key: string]: (value: EventData, topic?: string, result?: Object) => Object | void;
}

export enum SubscriptionTopics {
    rawTx = 'rawtx',
    hashTx = 'hashtx',
    rawBlock = 'rawblock',
    hashBlock = 'hashblock',
    sequence = 'sequence',
}

export interface SubscriptionEventsHandler {
    before?: BeforeEventCallback,
    after?: AfterEventCallback
    onRawTxReceived?: ReceivedEventCallback;
    onHashTxReceived?: ReceivedEventCallback;
    onRawBlockReceived?: ReceivedEventCallback;
    onHashBlockReceived?: ReceivedEventCallback;
    onSequenceReceived?: ReceivedEventCallback;
}

export class VerusZmqConnection {
    private address: string;
    private port: number;
    private protocol: string;
    constructor(address: string, port: number, protocol?: string) {
        this.address = address;
        this.port = port;
        this.protocol = protocol ?? 'tcp';
    }

    getAddress(): string {
        return `${this.protocol}://${this.address}:${this.port}`.toLowerCase();
    }
}

export class VerusZmqOptions {
    readonly connection: VerusZmqConnection;
    readonly topics: SubscriptionTopics[];
    private readonly events: SubscriptionEventsHandler;

    constructor(
        server: VerusZmqConnection,
        topics: SubscriptionTopics[],
        events: SubscriptionEventsHandler) {
        this.connection = server;
        this.topics = this.getTopics(topics);
        this.events = events;
    }

    readonly getTopics = (topics: SubscriptionTopics[]): SubscriptionTopics[] => {
        const defaultTopics = Object.values(SubscriptionTopics);
        const foundTopic: SubscriptionTopics[] = [];
        const filteredTopics = topics.filter(t => {
            if(defaultTopics.includes(t) && !foundTopic.includes(t)) {
                foundTopic.push(t);
                return true;
            }
            return false;
        });
        return (filteredTopics[0] === undefined)? 
            defaultTopics : 
            filteredTopics;
    }

    getEventHandlers(): EventReturn {
        const before = (this.events.before !== undefined) ? 
            (value: EventData, topic?: string) => this.events.before!(value, topic) : 
            () => Object;
        const after = (this.events.after !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.after!(value, topic, result) : 
            () => {};
        const onRawTxReceived = (this.events.onRawTxReceived !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.onRawTxReceived!(value, topic, result) : 
            () => Object;
        const onHashTxReceived = (this.events.onHashTxReceived !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.onHashTxReceived!(value, topic, result) : 
            () => Object;
        const onRawBlockReceived = (this.events.onRawBlockReceived !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.onRawBlockReceived!(value, topic, result) : 
            () => Object;
        const onHashBlockReceived = (this.events.onHashBlockReceived !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.onHashBlockReceived!(value, topic, result) : 
            () => Object;
        const onSequenceReceived = (this.events.onSequenceReceived !== undefined) ? 
            (value: EventData, topic?: string, result?: Object) => this.events.onSequenceReceived!(value, topic, result) : 
            () => Object;
        
        return {
            before: before,
            after: after,
            onRawTxReceived: onRawTxReceived,
            onHashTxReceived: onHashTxReceived,
            onRawBlockReceived: onRawBlockReceived,
            onHashBlockReceived: onHashBlockReceived,
            onSequenceReceived: onSequenceReceived,
        };
    }
}