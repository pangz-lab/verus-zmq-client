import { SubscriptionTopics, VerusZmqOptions, VerusZmqConnection } from "../../src/lib/VerusZmqOptions";

describe('SubscriptionTopics', () => {
    test('enum returns correct string value', () => {
        expect(SubscriptionTopics.rawTx).toBe('rawtx');
        expect(SubscriptionTopics.rawBlock).toBe('rawblock');
        expect(SubscriptionTopics.hashTx).toBe('hashtx');
        expect(SubscriptionTopics.hashBlock).toBe('hashblock');
        expect(SubscriptionTopics.sequence).toBe('sequence');
    });
});

describe('VerusZmqConnection', () => {
    test('getAddress returns the correct address with default tcp protocol', () => {
        const server = new VerusZmqConnection('127.0.0.1', 3000);
        expect(server.getAddress()).toBe('tcp://127.0.0.1:3000');
    });
    
    test('getAddress returns correct address with custom protocol', () => {
        const server = new VerusZmqConnection('localhost', 3000, 'ws');
        expect(server.getAddress()).toBe('ws://localhost:3000');
    });
});

describe('VerusZmqOptions', () => {
    const mockServer = new VerusZmqConnection('localhost', 3000);
    const mockEvents = {
        onHashBlockReceived: jest.fn(),
        onHashTxReceived: jest.fn(),
        onRawBlockReceived: jest.fn(),
        onRawTxReceived: jest.fn(),
        onSequenceReceived: jest.fn(),
    };

    test('constructor sets properties correctly', () => {
        const topics = [SubscriptionTopics.rawTx];
        const options = new VerusZmqOptions(mockServer, topics, mockEvents);
        expect(options.connection).toBe(mockServer);
        expect(options.topics).toEqual(topics);
    });

    test('all topics should be returned if topics is empty', () => {
        const topics: SubscriptionTopics[] = [];
        const options = new VerusZmqOptions(mockServer, topics, mockEvents);
        expect(options.topics).toEqual([
            SubscriptionTopics.rawTx,
            SubscriptionTopics.hashTx,
            SubscriptionTopics.rawBlock,
            SubscriptionTopics.hashBlock,
            SubscriptionTopics.sequence,
        ]);
    });
    
    test('unique topics should be returned if duplicate topic exist', () => {
        const topics: SubscriptionTopics[] = [
            SubscriptionTopics.rawTx,
            SubscriptionTopics.rawTx,
            SubscriptionTopics.rawTx,
            SubscriptionTopics.rawBlock,
            SubscriptionTopics.rawBlock,
            SubscriptionTopics.rawBlock,
        ];
        const options = new VerusZmqOptions(mockServer, topics, mockEvents);
        expect(options.topics.length).toEqual(2);
        expect(options.topics).toEqual([
            SubscriptionTopics.rawTx,
            SubscriptionTopics.rawBlock,
        ]);
    });
});
