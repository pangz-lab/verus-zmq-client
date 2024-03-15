import { SubscriptionEventsHandler, SubscriptionTopics, VerusZmqClient, VerusZmqConnection, VerusZmqOptions } from "..";

async function run() {
    const eh: SubscriptionEventsHandler = {
        onHashBlockReceived: function (value: String): Object {
            console.log("onHashBlockReceived >> " + value);
            return {res: 1};
        },
        onRawBlockReceived: function (value: String): Object {
            console.log("onRawBlockReceived >> " + value);
            return {res: 2};
        },
        onHashTxReceived: function (value: String): Object {
            console.log("onHashTxReceived >> " + value);
            return {res: 3};
        },
        onRawTxReceived: function (value: String): Object {
            console.log("onRawTxReceived >> " + value);
            return {res: 4};
        },
        before: function(value: string, topic?: string) {
            console.log(`before value >> ${value} ${topic}`);
            return {};
        },
        after: function(value: string, topic?: string) {
            console.log(`after value >> ${value} ${topic}`);
        }
    };
    const client = new VerusZmqClient(
        new VerusZmqOptions(
            new VerusZmqConnection('127.0.0.1', 89000),
            [
                SubscriptionTopics.hashBlock,
                SubscriptionTopics.hashTx,
                SubscriptionTopics.rawBlock,
                SubscriptionTopics.rawTx,
            ],
            eh
        )
    );

    client
        .connect()
        .listen();
}

run()