# 013. output to csv from python script 

Date: 20.10.2019

## Status

Accepted

## Context

In order to manage the patient records that are loaded into the datastore, as ste out in the ADR 007, there needs to be a way of managing the private keys. Without doing so it will be impossible for a transaction to be made succesfully for a researcher.

## Decision

To use update the python script to output to a csv from the file, and subsequently read this file when the sysem loads. 

## Consequences

To update the datastore python script to read out to a python script.