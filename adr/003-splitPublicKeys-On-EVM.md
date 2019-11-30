# 3. Split public keys on EVM

Date: 09.09.2019

## Status

Accepted


## Context

A decision must be made to manage the keys that are made on the etheruem virtual machine (public blockchain), and the keys held within the datastore. If all data is stored on the public blockchain this will result in  security and scalability issues.


## Decision

This decision is to record only the bgchainToken on the publically accessible blockchain, and record the other information for a patient in the datastore.


## Consequences

Only record a public key from the datastore 'bgchainToken' on the public chain 

