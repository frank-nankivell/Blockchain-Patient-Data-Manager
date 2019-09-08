import React, {Component} from 'react'
import { Button, Image, StyleSheet, Text, View, ActivityIndicator} from "react-native";

import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import DataAccess from '../../build/contracts/DataAccess.json'


const contractAddress ='0x8a4A12479486A427109e964e90CaEB5798C13A01';


class DataLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: 'no value',
      value: '',
      web3MetaON: false,
      network:'',
      contract: '',
      accUnlock: false,
      contractON: false,

    };
  };

  // ::TO-DO method to open and loginto Metama

    // Below loads web3 and sets state if browser
    // is and older ethereum browser
    componentDidMount = () => {
    if(this.state.web3MetaON == false && this.state.accUnlock == false) {
      
      if (typeof web3 != 'undefined') {
 
        this.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
        this.setState({web3MetaON: true})
        const accountID = web3.eth.getAccounts();
        this.setState({account: accountID})
        web3.eth.defaultAccount = this.web3Provider.selectedAddress;
        console.log('Window opening in older browser') 

        // check if accountID is available
        if(accountID !== null || accountID !== undefined) {
        this.setState({accUnlock: true})

        this.loadDataContract(accountID)
        
    }
    else {
        console.log('Error on accessing account')
          this.setState({accUnlock: false})
    }
  }
    else {
          window.alert("Please connect to Metamask.")
          this.setState({web3MetaON: false})
          // ::TO-DO method to invoke retry after 2 seconds
        }
      }

      // Below loads web3 and sets state if browser
      // is and a modern ethereum browser 
      else if (window.ethereum && this.state.web3MetaON == false && this.state.accUnlock == false) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          const accountID = ethereum.enable()
          web3.eth.sendTransaction({/* ... */})
          // setting state to accountID
          this.setState({account: accountID})
          this.setState({accUnlock: true})

          console.log('Window opening in modern browser')

        } catch (error) {
          console.log(error, 'Modern Browser failed')
          this.setState({web3MetaON: false})
        }
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    };

  loadDataContract = () =>  {
      
      // code version without creating new contract
      const contract = TruffleContract(DataAccess)
      console.log(DataAccess.contractAddress)

      contract.setProvider(this.web3Provider)
      contract.defaults({from: this.web3Provider.selectedAddress});

      console.log('Address',contract.contractAddress)

      // initial function
      contract.at(DataAccess.contractAddress)
        .then((instance) => instance.enroll().then((Output) => {
        this.setState({value: Output})
      }).catch(err => console.log("Enroll function error ", err))
    );
  };

  render() {
    const { account, contract, network, value} = this.state;
    return(
        <View> 
        <ActivityIndicator> </ActivityIndicator>
        <Text style={style.text}> Login page is loading...</Text>
        <Text style={style.text}>{account}</Text>
        <Text style={style.text}>Value is {value}</Text>
        

        </View>
    );
  }
}

const style = StyleSheet.create({
  text: {
    fontSize: 25,
    color: 'blue',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'flex-start'
  
  }

})


export default DataLogin;