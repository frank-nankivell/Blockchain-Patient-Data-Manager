# 11. express-mongo-db used for Mongo connection

## Status
Pending

## Context

A number of options could be used to handle access and connection to the mongo db. The complexity being the ability to have a persistent connection.



## Decision

Decision used for this npm package to connect to mongo 
https://www.npmjs.com/package/express-mongo-db

This was used due to complexity of using a persistent system to access the database

## Consequences

This will likely make the application very slow to manage and may need to be changed in the future


