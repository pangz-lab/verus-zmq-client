import { EventData, SubscriptionEventsHandler, SubscriptionTopics, VerusZmqClient, VerusZmqConnection, VerusZmqOptions } from "..";

async function run() {
    const eh: SubscriptionEventsHandler = {

        onRawTxReceived: function (value: EventData): Object {
            console.log("onRawTxReceived >> " + value);
            return {res: 4};
        },
        onHashTxReceived: function (value: EventData): Object {
            console.log("onHashTxReceived >> " + value);
            return {res: 3};
        },
        onHashBlockReceived: function (value: EventData): Object {
            console.log("onHashBlockReceived >> " + value);
            console.log((new Date()).toLocaleTimeString());
            return {res: 1};
        },
        onRawBlockReceived: function (value: EventData): Object {
            console.log("onRawBlockReceived >> " + value);
            return {res: 2};
        },
        onSequenceReceived: function (value: EventData): Object {
            console.log("onSequenceReceived >> " + value);
            return {res: 4};
        },
        before: function(value: EventData, topic?: string) {
            console.log(`before value >> ${value} ${topic}`);
            return {};
        },
        after: function(value: EventData, topic?: string) {
            console.log(`after value >> ${value} ${topic}`);
        }
    };
    const client = new VerusZmqClient(
        new VerusZmqOptions(
            new VerusZmqConnection('127.0.0.1', 89000),
            [
                SubscriptionTopics.rawTx,
                SubscriptionTopics.hashTx,
                SubscriptionTopics.rawBlock,
                SubscriptionTopics.hashBlock,
            ],
            eh
        )
    );

    client
        .connect()
        .listen()
        .catch(e => {console.log("Error " + e);});
}

run()