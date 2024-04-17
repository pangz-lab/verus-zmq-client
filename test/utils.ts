import { VerusZmqClient } from "../src/lib/VerusZmqClient";
import { SubscriptionEventsHandler, VerusZmqOptions, VerusZmqConnection, SubscriptionTopics } from "../src/lib/VerusZmqOptions";

const mainTestPort = 19999;
const host = "127.0.0.1";
const rawTx = "9ee0bd0fda158cc7f8c0b48dfd87a21582d11889398d4c8167233fe9495cfcd6";
const hashTx = "9ee0bd0fda158cc7f8c0b48dfd87a21582d11889398d4c8167233fe9495cfcd6";
const rawBlock = "9ee0bd0fda158cc7f8c0b48dfd87a21582d11889398d4c8167233fe9495cfcd6";
const hashBlock = "9ee0bd0fda158cc7f8c0b48dfd87a21582d11889398d4c8167233fe9495cfcd6";

function runZmqClient(eh: SubscriptionEventsHandler, port: number): VerusZmqClient {
    var client = new VerusZmqClient(
        new VerusZmqOptions(
            new VerusZmqConnection(host, port),
            [
                SubscriptionTopics.hashBlock,
                SubscriptionTopics.hashTx,
                SubscriptionTopics.rawBlock,
                SubscriptionTopics.rawTx,
            ],
            eh
        )
    );
    return client;
}

function toZmqData(value: string) {
    return Buffer.from(value, 'hex');
}

export {
    runZmqClient,
    toZmqData,
    mainTestPort,
    rawTx,
    hashTx,
    rawBlock,
    hashBlock
};