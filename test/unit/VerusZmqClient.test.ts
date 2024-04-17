import { Subscriber } from "zeromq";
import { VerusZmqClient } from "../../src/lib/VerusZmqClient";
import { SubscriptionTopics, VerusZmqConnection, VerusZmqOptions } from "../../src/lib/VerusZmqOptions";
import { runZmqClient } from "../utils";
var client: VerusZmqClient;

describe('VerusZmqClient subscribe/unsubscribe', () => {
    let client: VerusZmqClient;
    jest.mock('zeromq', () => ({
        Subscriber: jest.fn(() => ({
          connect: jest.fn(),
          subscribe: jest.fn(),
          unsubscribe: jest.fn(),
          disconnect: jest.fn(),
          close: jest.fn()
        }))
      }));

  beforeEach(() => {
    const options = new VerusZmqOptions(
        new VerusZmqConnection('127.0.0.1', 9999),
        [
            SubscriptionTopics.hashBlock,
            SubscriptionTopics.hashTx,
            SubscriptionTopics.rawBlock,
            SubscriptionTopics.rawTx,
        ],
        {}
    )
    client = new VerusZmqClient(options);
  });

  it('should subscribe to each topic', () => {
    const subscribeSpy = jest.spyOn(Subscriber.prototype, 'subscribe');
    client.connect();
    expect(subscribeSpy).toHaveBeenCalledTimes(4);
  });

  it('should unsubscribe to each topic', () => {
    const unsubscribeSpy = jest.spyOn(Subscriber.prototype, 'unsubscribe');
    client.connect();
    client.disconnect();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(4);
  });
});

describe('VerusZmqClient getEventName', () => {
    client = runZmqClient({}, 99996);
    const getEventName = Reflect.get(client, 'getEventName') as Function;

    test('rawtx should return the correct event handler callback name', () => {
        expect(Reflect.apply(getEventName, client, ['rawtx'])).toBe('onRawTxReceived');
    });

    test('rawblock should return the correct event handler callback name', () => {
        expect(Reflect.apply(getEventName, client, ['rawblock'])).toBe('onRawBlockReceived');
    });
    
    test('hashtx should return the correct event handler callback name', () => {
        expect(Reflect.apply(getEventName, client, ['hashtx'])).toBe('onHashTxReceived');
    });
    
    test('hashblock should return the correct event handler callback name', () => {
        expect(Reflect.apply(getEventName, client, ['hashblock'])).toBe('onHashBlockReceived');
    });
    
    test('sequence should return the correct event handler callback name', () => {
        expect(Reflect.apply(getEventName, client, ['sequence'])).toBe('onSequenceReceived');
    });
});
