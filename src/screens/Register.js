import React, {Component} from 'react'
import styled from 'styled-components'
import {blue1,lighterWhite} from '../constants/Colors';
import {
  Form, 
  Badge,
  FormGroup,
  FormControl,
  Button, 
  Container,
  Col,
  OverlayTrigger,
  Popover,
  Panel,
  Modal,
  Grid,
  HelpBlock,
  Row,
  BootstrapTable,
  TableHeaderColumn,

} from 'react-bootstrap';

import Explanation from '../components/Explanation';
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

export default class Register extends Component {
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
        this._registerProject = this._registerProject.bind(this)

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
          `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
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

     async _registerProject(event)
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
        const {formStatus, web3, users, account}= this.state;
        const projects = ['Project 1','example'];
        if(!web3) {
          return<div>Loading Login Details via Smart Contract...</div>
        }
        if(web3 && !formStatus) {
            return(
                  <div>
                    <Container>
                      <Row>
                        <Col>
                        <Explanation></Explanation>
                        </Col>
                        <Col>
                         <h5>You are logged in with User ID<Badge variant="secondary">{account}</Badge></h5> 
                        </Col>
                      </Row>
                    </Container>
                    <h3>
                      You have the below number of projects registered on the blockchain ready for research
                    </h3>
                      {projects}
                  <h5>
                    To Register your project and interest to research enter the form below
                  </h5>
                  <Form onSubmit={this._registerProject}>
                    <Form.Group controlId="name.signUpInput">
                      <Form.Label>User ID</Form.Label>
                        <Form.Control 
                        type="text" 
                        name="account"
                        value={account}
                        placeholder="your name"
                        onChange={this._handleChange.bind(this)}
                        />
                  </Form.Group>
                  <Form.Group controlId="account.signUpInput">
                    <Form.Label>Enter your Name here</Form.Label>
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
                  <Form.Group controlId="password.signUpInput">
                  <Form.Label>Project Summary</Form.Label>
                  <Form.Control 
                  type="text" 
                  name="projectSummary"
                  placeholder="a great project.."
                  onChange={this._handleChange.bind(this)} />
                  </Form.Group>
                    <Button 
                      type="submit" 
                      variant="outline-secondary"
                      onClick={this._registerProject.bind(this)}>
                      Register 
                    </Button>
                  </Form>
                  </div>
            )} else {

                return(
                  <div>
                        <h5>
                            To Register your project and interest to research enter the form below
                        </h5>
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

    