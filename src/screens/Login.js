import React, {Component} from 'react'
import styled from 'styled-components'
import {blue1,lighterWhite} from '../constants/Colors';
import {Form, Button, Row, Panel} from 'react-bootstrap';

import TruffleContract from 'truffle-contract'
const contractAddress ='0x8a4A12479486A427109e964e90CaEB5798C13A01';

import DataAccess from '../../build/contracts/DataAccess.json'
import getWeb3 from '../utils/getWeb3';

// https://kauri.io/article/86903f66d39d4379a2e70bd583700ecf/truffle:-adding-a-frontend-with-react-box



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
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            formStatus: false,
            login: false,
            dataAccess: undefined,
            account: null,
            web3: null,
            data: []
        };
    }

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
    
    
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
    
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
            const deployedNetwork = DataAccess.networks[networkId];
            const instance = new web3.eth.Contract(
              DataAccess.abi,
              deployedNetwork && deployedNetwork.address,
            );
    
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ dataAccess: instance, web3: web3, account: accounts[0]})
    
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.log(error);
      }
    };



    _getSignUp = async () => {
        this.setState({...this.state, formStatus: true});
    };

    _pushForm = (event) => {
      const username = event.target.value.username;
      const password = event.target.value.password;
      console.log('username:',username)
      console.log('password:',password)

      this.setState({
        username: username,
        password: password
      })
  
    };

    _login = async () => {
        this.setState({...this.state, login: true});

    }


    render() {
        const {formStatus, web3}= this.state;
        if(!web3) {
          return<div>Loading Web3, accounts and contract</div>
        }
        if(web3 && !formStatus) {
                return(
                    <div>
                    <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Enter your username</Form.Label>
                            <Form.Control type="username" placeholder="username@example.com" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Enter your password</Form.Label>
                            <Form.Control type="email" placeholder="xxxxxx"/>
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
                    <Form signUp >
                    <Form.Group controlId="name.signUpInput">
                      <Form.Label>Enter your name here</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="name"
                          placeholder="your name"
                          value={values.name}
                            />
                    </Form.Group>
                    <Form.Group controlId="email.signUpInput">
                      <Form.Label>Enter your email address</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        placeholder="name@example.com"
                        value={values.email} />
                    </Form.Group>
                    <Form.Group controlId="email2.signUpInput">
                      <Form.Label>Enter repeat your email address</Form.Label>
                      <Form.Control 
                        type="email"
                        name="email2"
                        placeholder="name@example.com" 
                        value={values.email2}/>
                    </Form.Group>
                    <Form.Group controlId="password.signUpInput">
                      <Form.Label>Please enter your password</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="password"
                        placeholder="examplepassword"
                        value={values.password} />
                    </Form.Group>
                    <Form.Group controlId="passwordRepeat.signUpInput">
                      <Form.Label>Repeat your password</Form.Label>
                      <Form.Control 
                        type="text"
                        name="password2"
                        placeholder="examplepassword"
                        value={values.password2} />
                    </Form.Group>
                    <Button 
                        type="submit" 
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

    