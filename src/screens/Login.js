import React, {Component} from 'react'
import styled from 'styled-components'
import {blue1,lighterWhite} from '../constants/Colors';
import {
  Form, 
  FormGroup,
  FormControl,
  Button, 
  Panel,
  Modal,
  Grid,
  HelpBlock,
  Row,
  BootstrapTable,
  TableHeaderColumn,

} from 'react-bootstrap';

import TruffleContract from 'truffle-contract'
const contractAddress ='0x8a4A12479486A427109e964e90CaEB5798C13A01';

import DataAccess from '../../build/contracts/DataAccess.json'
import getWeb3 from '../utils/getWeb3';



const Styles = styled.div`
    .Button {
        color: ${blue1}
    }
    .Card {

    }
`;

var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  API_url = 'enterProdURL';
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
            etherscanLink: "https://rinkeby.etherscan.io",
            data: [],
            users: [],
        };
        this._handleChange = this._handleChange.bind(this)
        this._pushForm = this._pushForm.bind(this)

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
            const dataAccessInstance = new web3.eth.Contract(
              DataAccess.abi,
              deployedNetwork && deployedNetwork.address,
            );
    
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ dataAccess: dataAccessInstance, web3: web3, account: accounts[0]})
        //this.addEventListener.bind(this)
    
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. You may need to install MetaMask. Check console for details.`
        );
        console.log(error);
      }
    };


    _getSignUp = async () => {
        this.setState({...this.state, formStatus: true});
    };

    _handleChange(event) {

    switch(event.target.name) {
        case "name":
            this.setState({"name": event.target.value})
            console.log('name is', event.target.value)
            break;
        case "email":
            this.setState({"email": event.target.value})
            console.log('email is', event.target.value)
            break;
        case "password":
            this.setState({"password": event.target.value})
            console.log('password is', event.target.value)
            break;
        default:
            break;
      }
    }

     async _pushForm(event)
    {
      console.log('pushing data to chain')

      const name  = this.state.name;
      this._getToken(name)

      if (typeof this.state.dataAccess !== 'undefined' || typeof this.state.token !=='undefined') {
        event.preventDefault();

      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      // visual checks for data
      console.log("time: ",time)
      console.log("date: ",date)
      console.log("token: ",this.state.token)
      console.log("acount: ",this.state.account)
      console.log("name: ",this.state.name)
      console.log("email: ",this.state.email)

      let result = await this.state.dataAccess.methods.insertDataLocation(this.state.account,this.state.name,this.state.email,this.state.token,date,time)
      this.setState({...this.state, formStatus: true});
      this.setState({result: result})
      this.addEventListener(this)
      console.log('result', this.state.result)
      }
    }

    setLastTransactionDetails(result)
      {
        if(result.tx !== 'undefined')
      {
        this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx})
      }
        else
      {
        this.setState({etherscanLink: etherscanBaseUrl})
        }
      }



    // address
    // name
    // id - used as email to rename
    // url - used as token to rename
    // date
    // time

    _getToken = async (name) => {
      var QUERY = '/api/bigchain/makeKey'

      fetch(API_url + QUERY, {
        method: 'post',
        body: JSON.stringify(name)
      })
      .then(response => response.json())
      .then(token => this.setState({...this.state, token: token}));
      console.log('token is',this.state.token)
  }
 
  addEventListener(component) {
    this.state.dataAccess.events.LogNewData({fromBlock: 0, toBlock: 'latest'})
    .on('data', function(event){
      console.log(event); // same results as the optional callback above
      var newUserArray = component.state.users.slice()
      newUserArray.push(event.returnValues)
      component.setState({ users: newUserArray })
      console.log('users set already are',newUserArray)
    })
    .on('error', console.error);
  }
    

    _login = async () => {
        this.setState({...this.state, login: true});
    }



    render() {
        const {formStatus, web3, users}= this.state;
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
                    <Form onSubmit={this._pushForm}>
                    <Form.Group controlId="name.signUpInput">
                      <Form.Label>Enter your name here</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="name"
                          placeholder="your name"
                          onChange={this._handleChange.bind(this)}
                            />
                    </Form.Group>
                    <Form.Group controlId="email.signUpInput">
                      <Form.Label>Enter your email address</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        placeholder="name@example.com"
                        onChange={this._handleChange.bind(this)} />
                    </Form.Group>
                    <Form.Group controlId="email2.signUpInput">
                      <Form.Label>Enter repeat your email address</Form.Label>
                      <Form.Control 
                        type="email"
                        name="email2"
                        placeholder="name@example.com" 
                        onChange={this._handleChange.bind(this)}/>
                    </Form.Group>
                    <Form.Group controlId="password.signUpInput">
                      <Form.Label>Please enter your password</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="password"
                        placeholder="examplepassword"
                        onChange={this._handleChange.bind(this)} />
                    </Form.Group>
                    <Form.Group controlId="passwordRepeat.signUpInput">
                      <Form.Label>Repeat your password</Form.Label>
                      <Form.Control 
                        type="text"
                        name="password2"
                        placeholder="examplepassword"
                        onChange={this._handleChange.bind(this)} />
                    </Form.Group>
                    <Button 
                        type="submit" 
                        variant="outline-secondary"
                        onClick={this._pushForm.bind(this)}>
                        Sign Up
                    </Button>
                  </Form>

                  <p> Users JSON is here: {users}</p>
                    
                  </div>
                )
             
        };
        };
    };

    