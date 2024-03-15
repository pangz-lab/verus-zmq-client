type BeforeEventCallback = (value: string, topic?: string) => Object;
type AfterEventCallback = (value: string, topic?: string, result?: Object) => void;
type ReceivedEventCallback = (value: string, result?: Object) => Object;
export interface EventReturn {
    [key: string]: (value: string, topic?: string, result?: Object) => Object | void;
}

export enum SubscriptionTopics {
    rawTx = 'rawtx',
    rawBlock = 'rawblock',
    hashTx = 'hashtx',
    hashBlock = 'hashblock',
}

export interface SubscriptionEventsHandler {
    before?: BeforeEventCallback,
    after?: AfterEventCallback
    onHashBlockReceived?: ReceivedEventCallback;
    onHashTxReceived?: ReceivedEventCallback;
    onRawBlockReceived?: ReceivedEventCallback;
    onRawTxReceived?: ReceivedEventCallback;
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
            (value: string, topic?: string) => this.events.before!(value, topic) : 
            () => Object;
        const after = (this.events.after !== undefined) ? 
            (value: string, topic?: string, result?: Object) => this.events.after!(value, topic, result) : 
            () => {};
        const onHashBlockReceived = (this.events.onHashBlockReceived !== undefined) ? 
            (value: string, result?: Object) => this.events.onHashBlockReceived!(value, result) : 
            () => Object;
        const onRawBlockReceived = (this.events.onRawBlockReceived !== undefined) ? 
            (value: string, result?: Object) => this.events.onRawBlockReceived!(value, result) : 
            () => Object;
        const onHashTxReceived = (this.events.onHashTxReceived !== undefined) ? 
            (value: string, result?: Object) => this.events.onHashTxReceived!(value, result) : 
            () => Object;
        const onRawTxReceived = (this.events.onRawTxReceived !== undefined) ? 
            (value: string, result?: Object) => this.events.onRawTxReceived!(value, result) : 
            () => Object;
        
        return {
            before: before,
            after: after,
            onHashBlockReceived: onHashBlockReceived,
            onHashTxReceived: onHashTxReceived,
            onRawBlockReceived: onRawBlockReceived,
            onRawTxReceived: onRawTxReceived,
        };
    }
}