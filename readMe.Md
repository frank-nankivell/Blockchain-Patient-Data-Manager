# Blockchain Patient Data Manager

This application was delivered as a final piece of coursework for my masters in computer science. The application is a Decentralised application and can be deployed to either a test or production blockchain.

This application stores data on public blockchain and also a private datastore (BigchainDB)
Some basics to orientate yourself....

## How to Guide for Setup

1) The main app is written in NodeJS. Once you have pulled the project first rung

```bash
    npm install
```
This will load the project dependencies.

2) If running locally you will then need to setup and install a local version of BigchainDB:

https://www.bigchaindb.com/ - Documentation here. BigchainDB will run on top of MongoDB. Please make sure this is installed already in your local environment.

3) Setup a local version of a Blockchain. The easiest way to do this is via Ganache:

https://www.trufflesuite.com/ganache

4) Ensure you have version of Python3 available on your local machine. The application uses a Python loader to load data into the application.

5) Setup Metamask in a browser. Documentation here: https://metamask.io/

6) Install Make on the local environment https://mg.readthedocs.io/make_tutorial/make_tutorial.html


## How to Guide for using the application

- 1) Start the BigchainDB server

- 2) Cd the project directory and run

- 3) Start ganache and ensure that it is running on this setting:

      host: "localhost",     
      port: 7545,  

- 4) Run this command 

```bash
npm install
```

If you have not already done so. This will install all dependencies for the project.

- 5) Run this command

```bash
make load_reset
```
This will load a set of test data to access when using the app.

- 7) Run this command

```bash 
truffle migrate --reset
```

This will deploy the contract to Ganache

- 8) Start the server

```bash 
npm run dev
```

You should now be good to go and test out the application running locally on your own enviroment! 

Enjoy!