# 6. Mongo Client used to interact with data store 

Date: 25.09.2019

## Status

Accepted

## Context

BigchainDB has a number of drivers available to use to query the datastore, however it also allows users to make queries via a standard mongo driver. The bigchaindb driver is not as as mature as a mongodb for certain aggregate queries and therefore the mongo driver could be additionally used.

## Decision

To use the mongo driver for certain queries that require aggregate functionality.


## Consequences

MongoDB driver will be used in addition to the bighchaindb driver

