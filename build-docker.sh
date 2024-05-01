#!/bin/bash

# Unless there are changes in the code, you only need to run this once
docker build --no-cache -t verus-zmq-client .
# Run using the host network as the Verus deamon is running in the host
# docker run -d --network host --rm --name verus-explorer-api verus-explorer-api
docker run -dit --rm --name verus-zmq-client verus-zmq-client