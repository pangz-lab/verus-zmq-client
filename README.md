
![Logo](https://raw.githubusercontent.com/pangz-lab/verus-zmq-client/main/icon.png)
# Verus ZMQ Client
An intuitive and lightweight Typescript/Javascript client library for the Verus Coin ZMQ messaging.

## Introduction

Verus ZMQ Client is a library that enables to receive event notification from the Verus blockchain nodes via ZeroMQ (ZMQ) messaging protocol.
<br>This library provides functionalities to subscribe to various types of blockchain data events and receive real-time updates.

## Verus Coin Setup
To receive the events from the Verus blockchain, you need to enable the ZMQ setting first by adding the following lines in the `VRSC.conf`.
> 📑 ***Note*** <br>
> You should have a Verus node running locally. <br>The address `127.0.0.1:8900` will serve as the ZMQ web server to be accessed by this library.
> You can change it to any available ports.
>


| OS    |  Directory |
|:-----:|:--------|
| [![Linux](https://skillicons.dev/icons?i=linux)](https://skillicons.dev)  | `~/.komodo/VRSC` |
| [![Mac](https://skillicons.dev/icons?i=apple)](https://skillicons.dev)    | `/Users//Library/Application Support/komodo/VRSC` |
| [![Windowa](https://skillicons.dev/icons?i=windows)](https://skillicons.dev) | `%AppData%\Komodo\VRSC\` |

### Steps
This is applicable for `Verus` and `PBaaS` blockchains.
1. Update the configuration file (see below).
2. Restart the node.

#### ZMQ Configuration
Copy and paste to the config file.
```bash
...
zmqpubrawblock=tcp://127.0.0.1:8900
zmqpubrawtx=tcp://127.0.0.1:8900
zmqpubhashtx=tcp://127.0.0.1:8900
zmqpubhashblock=tcp://127.0.0.1:8900
```

### ⛓ PBaaS Chain Ready
> 
> PBaaS is already supported by this library.
> To enable, just follow the same setup procedure.
> <br>Ideally, the port should be different from the Verus node ZMQ configuration.
> 
> Take note that PBaaS chain configurations (`*.conf` file) are located in a directory different from Verus.
> <br>For example, in `Linux`, can be found in `~/.verus/pbaas/<pabaas_chain_id>/<pabaas_chain_id>.conf`
> 

🔖[see for more details](https://wiki.verus.io/#!how-to/how-to_verus_info.md)

## Installation

To install, you can use npm:

```bash
npm install verus-zmq-client
```

## Usage

### Importing the Library

```typescript
import {
    EventData,
    SubscriptionEventsHandler,
    SubscriptionTopics,
    VerusZmqClient,
    VerusZmqConnection,
    VerusZmqOptions
} from 'verus-zmq-client';
```

### Example
```typescript
const eh: SubscriptionEventsHandler = {
    onRawTxReceived: function (value: EventData): Object {
        console.log("onRawTxReceived >> " + value);
        return {};
    },
    onHashTxReceived: function (value: EventData): Object {
        console.log("onHashTxReceived >> " + value);
        return {};
    },
    onRawBlockReceived: function (value: EventData): Object {
        console.log("onRawBlockReceived >> " + value);
        return {};
    },
    onHashBlockReceived: function (value: EventData): Object {
        console.log("onHashBlockReceived >> " + value);
        return {};
    },
    before: function(value: EventData, topic?: string) {
        console.log(`before value >> ${value} ${topic}`);
        return {};
    },
    after: function(value: EventData, topic?: string) {
        console.log(`after value >> ${value} ${topic}`);
    }
};

const zmqClient = new VerusZmqClient(
    new VerusZmqOptions(
        new VerusZmqConnection(
            '127.0.0.1',
            8900,
        ),
        [
            SubscriptionTopics.rawTx,
            SubscriptionTopics.hashTx,
            SubscriptionTopics.rawBlock,
            SubscriptionTopics.hashBlock,
        ],
        eh
    )
);

try {
    zmqClient
        .connect()
        .listen();
} catch (e) {
    console.error('Error: ' + e)
}

// Don't forget to disconnect
// zmqClient.disconnet()

```

# API
## VerusZmqClient Class
Main client class for connecting to the Verus node ZMQ server.
### Methods
| Name   |  Usage |
|:-----|:--------|
| `connect` | connects to the Verus ZMQ server |
| `listen` | starts listening to the stream of events |
| `disconnect` | disconnects from the Verus ZMQ server |
## VerusZmqOptions Class
Main configuration class of the `VerusZmqClient` class.
## Topics
Topics are optional. Just subscribe to the topics you need by using the following `SubscriptionTopics` enums.
| Name   |  Verus ZMQ Topic |
|:-----|:--------|
|`SubscriptionTopics.rawTx`| `rawtx` |
|`SubscriptionTopics.hashTx`| `hashtx` |
|`SubscriptionTopics.rawBlock`| `rawblock` |
|`SubscriptionTopics.hashBlock`| `hashblock` |
## Event Handlers
Event handlers are optional. They are dependent to the subscribed topics.
<br>Define the event handlers you need.
| Name   |  Trigger |
|:-----|:--------|
|`onRawTxReceived` | ✅ notifies about all transactions, both when they are added to mempool or when a new block arrives.<br>✅ receives the transaction information |
|`onHashTxReceived` | ✅ notifies about all transactions, both when they are added to mempool or when a new block arrives.<br>✅ receives the transaction information hash |
|`onRawBlockReceived` | ✅ notifies when the chain tip is updated.<br>✅ receives the block information |
|`onHashBlockReceived` | ✅ notifies when the chain tip is updated.<br>✅ receives the block information hash |
|`before` | ✅ called before the actual ZMQ event is being handled.<br>✅ this receives the raw message and the topic received from the chain.<br>✅ raw means, it can either be a `Buffer` object or a `string` as it's not yet processed.<br>✅ the return value will be passed as an optional third argument of the main events.<br><b><i>i.e.</i></b>. `onRawTxReceived(value: EventData, topic?: string, beforeResult?: Object)` |
|`after` | ✅ called after the actual ZMQ main event is being handled.<br>✅ the third parameter will be the return value of the main event called.|

> 
> 📑 ***Note*** <br>
> Processing of the main (`on*Received`), `before` and `after` events can be think of like the following.
> 
> <br>`before` ➜ `onRawTxReceived` ➜ `after`<br>`before` ➜ `onHashTxReceived` ➜ `after`<br>`before` ➜ `onRawBlockReceived` ➜ `after`<br>`before` ➜ `onHashBlockReceived` ➜ `after`<br> 
> 

<hr>

# Support
For any issues or inquiries, you can raise a PR or contact me at
| Contacts    |  - |
|:-----:|:--------|
| [![Discord](https://skillicons.dev/icons?i=discord)](discordapp.com/585287860513669135) | `Pangz#4102` |
| [![Gmail](https://skillicons.dev/icons?i=gmail)](pangz.lab@gmail.com) |`pangz.lab@gmail.com` |
| [![X](https://skillicons.dev/icons?i=twitter)](https://x.com/PangzLab) |`@PangzLab` |



# Reference
- ***Verus*** : https://verus.io/
- ***Verus Wiki*** : https://wiki.verus.io/#!index.md
- ***Bitcoin ZMQ*** :  https://github.com/bitcoin/bitcoin/blob/master/doc/zmq.md

# License
This library is released under the [MIT License](https://github.com/pangz-lab/verus-zmq-client/blob/main/LICENSE).

# Support Us
Creating and maintaining a high-quality library is a labor of love that takes countless hours of coding, debugging, and community interaction. If this library has made your development easier, saved you time, or added value to your projects, consider supporting its ongoing growth and maintenance. Your contributions directly help keep this project alive, up-to-date, and evolving.

Every donation, no matter the size, goes a long way in motivating the developer to dedicate time and energy to improving the library. With your support, We can continue fixing bugs, adding new features, and providing documentation and support for the community. By donating, you’re not just saying “thank you” for the work done so far—you’re investing in the library's future and helping it remain a reliable tool for developers worldwide.

Let’s make this library even better, together! Consider donating to show your appreciation and ensure the continued development of this project. Your generosity fuels innovation and sustains the open-source ecosystem we all benefit from. Thank you for your support! 🍻


### Buy me Beer
<a href="https://buymeacoffee.com/pangzlab">
<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWtycDlxNjJ1MHUwbzY2MHI2ZmFxd3hwZDhqNHAyaDdlNXZubGtlMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/hXMGQqJFlIQMOjpsKC/giphy.webp"
width="100" height="auto">
</a>

### Donation Address
***Verus ID*** : 
pangz@
<br>
***VRSC*** : 
RNrhRTq8ioDTrANrm52c9MfFyPKr3cmhBj

***vARRR*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***vDEX*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***KMD*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***BTC*** : 
3MsmELpB8bsYvFJCYKrUpMuoBATVR5eeta

***ETH*** : 
0xa248d188725c3b78af7e7e8cf4cfb8469e46cf3b





