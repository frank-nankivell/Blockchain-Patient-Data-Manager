# 5. BlockchainDB to for use of data-store

20.09.2019
## Status

Accepted

## Context

A datastore is required to manage the information that is unable to be stored on the public chain. As noted in the ADR 003. A number of options are available to use for the datastore however the most effective solution is bighchainDB https://www.bigchaindb.com/ . This solution replicates existing functionality of a blockchain but on a single MongoDB node.


## Decision

To use bigchainDB for the datastore component of this application


## Consequences

bigchainDB will be used for the datastore application.


