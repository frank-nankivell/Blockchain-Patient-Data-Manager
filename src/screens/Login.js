import React, {Component} from 'react'
import styled from 'styled-components'
import {Button, Card, Form} from 'react-bootstrap';
import {Alert} from 'react-native-web'
import {blue1,lighterWhite} from '../constants/Colors';


import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import DataAccess from '../../build/contracts/DataAccess.json'

const contractAddress ='0x8a4A12479486A427109e964e90CaEB5798C13A01';

const Styles = styled.div`
    .Button {
        color: ${blue1}
    }
    .Card {

    }
`;

var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}

// SPA 
// First line provides button to see counts 
// Button provides count by disease
// Form then required 

export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            isFetching: false,
            formStatus: false,
            login: false,
            metaMask: false,
            data: []
        };
    }
    componentDidMount() {
       this._loadContract();
       this.timer = setInterval(() => this._loadContract(), 5000);
    }; 


    _getSignUp = async () => {
        this.setState({...this.state, formStatus: true});
    };

    _loadContract = async () => {

    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          this.loadDataContract()

      } catch (error) {
          // User denied account access...
          }
      }
      // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            this.loadDataContract()
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
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
        })
        .catch(err => console.log("Enroll function error ", err))
    );
  };




    _login = async () => {
        this.setState({...this.state, login: true});

    }


    render() {
        const formStatus = this.state.formStatus;
        if (formStatus == false) {
                return(
                    <div>
                    <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Enter your username</Form.Label>
                            <Form.Control type="username" placeholder="username@example.com" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Enter your password</Form.Label>
                            <Form.Control type="email" placeholder="xxxxxx" />
                            </Form.Group>
                        <Button variant="outline-secondary"
                                onClick={this._login}>
                            Login
                        </Button>
                        </Form>
                        <h4>
                            If you have not signed up yet then you can do so below.
                        </h4>
                        <Button variant="secondary"
                                onClick={this._getSignUp}>
                            Sign Up Now
                        </Button>
                        </div>
            )} else {
                return(
                    <div>
                        <h2>
                            To sign up please complete the form below
                        </h2>
                    <Form>
                    <Form.Group controlId="name.signUpInput">
                      <Form.Label>Enter your name here</Form.Label>
                      <Form.Control type="text" placeholder="your name" />
                    </Form.Group>
                    <Form.Group controlId="email.signUpInput">
                      <Form.Label>Enter your email address</Form.Label>
                      <Form.Control type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group controlId="email2.signUpInput">
                      <Form.Label>Enter repeat your email address</Form.Label>
                      <Form.Control type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group controlId="password.signUpInput">
                      <Form.Label>Please enter your password</Form.Label>
                      <Form.Control type="email" placeholder="examplepassword" />
                    </Form.Group>
                    <Form.Group controlId="passwordRepeat.signUpInput">
                      <Form.Label>Repeat your password</Form.Label>
                      <Form.Control type="email" placeholder="examplepassword" />
                    </Form.Group>
                    <Button 
                        variant="outline-secondary"
                        onClick={this._pushForm}>
                        Sign Up
                    </Button>
                  </Form>      
                  </div>
            )
        
        };
        };
    };

    