import React, {Component} from 'react'
import styled from 'styled-components'

// UI components
import BootstrapTable from 'react-bootstrap-table-next';
import {
  Form,
  Badge,
  Spinner,
  FormGroup,
  FormControl,
  Button,
  Container,
  Col,
  OverlayTrigger,
  Popover,
  Panel,
  Modal,
  Row,
  TableHeaderColumn,

} from 'react-bootstrap';

// custom components and development
import Explanation from '../components/Explanation';
import getWeb3 from '../utils/getWeb3';

// constants and utility data
import {firstTablecolumns,
        secondTableColumns} from '../utils/columns';
const API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  API_url = 'enterProdURL';
}

// contract data
import DataAccess from '../../build/contracts/DataAccess.json'
import RegisterContract from '../../build/contracts/Register.json';

//  constructor and class definition
export default class Register extends Component {
  constructor(props) {
      super(props)
      this.state = {
          formStatus: false,
          existingProject: [],
          dataAccess: undefined,
          account: null,
          web3: null,
          error: false,
          userName: null,
          data: [],
          recentData: [],
          users: [],
          projectList: [],
          count: '1',
      };
      this._handleChange = this._handleChange.bind(this)
      this._validateData = this._validateData.bind(this)
      this._getToken = this._getToken.bind(this)
      this._registerProject = this._registerProject.bind(this);
  };

  //
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // connect dataAccess instance
      const networkId = await web3.eth.net.getId();
          const deployedNetwork = DataAccess.networks[networkId];
          console.log('dataaccess network',DataAccess.networks[networkId])
          const dataAccessInstance = new web3.eth.Contract(
            DataAccess.abi,
            deployedNetwork && deployedNetwork.address,
          );
   
      // Set web3, accounts, and contract to the state, and then proceed with updating UI flag
      this.setState({ dataAccess: dataAccessInstance, web3: web3, account: accounts[0]})

      this._validateData();
 
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
      );
      console.log(error);
    }
  };


  // function to validate whether 
  //  user has recorded project previously 
   _validateData() {
    this.state.dataAccess.methods.getDataCount().call()
    .then((result) => {
      console.log("GetDataCount: " + result);
      if(result == 0) {
        console.log("Contract less than 1, No data stored");
        this._getToken();

      } else {
        this.state.dataAccess.methods.getData(this.state.account).call()
        .then((result) =>{
          console.log("getData: " + result);
          var a = JSON.stringify(result)
          console.log('object: ',a)
          var array =[]
          array.push(result[0]);
          console.log('array,',array)
          this.setState({existingProject: array})
        })
        .catch((err) => {
          console.log("Error GetData: "+err)
        });
      }
  })
  .catch(function(err) {
      console.log("Error GetDataCount: "+err);
      this._getToken();
  });
};

  // function to update state from form
  _handleChange(event) {
    switch(event.target.name) {
        case "name":
            this.setState({"name": event.target.value})
            //console.log('name is', event.target.value)
            break;
        case "institution":
            this.setState({"institution": event.target.value})
            //console.log('email is', event.target.value)
            break;
        case "projectSummary":
            this.setState({"projectSummary": event.target.value})
           // console.log('projectSummary is', event.target.value)
            break;
        default:
            break;
      }
    }
    // function to get token to record on the chain
      _getToken = async () => {
        var QUERY = '/api/bigchain/makeKey'
  
        fetch(API_url + QUERY, {
          method: 'post',
          body: JSON.stringify('name')
        })
        .then(response => response.json())
        .then(token => this.setState({...this.state, token: token}));
    }


    // function to register project on chain
    async _registerProject(event)
    {
      if (typeof this.state.dataAccess !== 'undefined' || typeof this.state.token !=='undefined') {
        event.preventDefault();
      
      console.log('pushing data to chain')
      console.log('token: ',this.state.token)
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

      await this.state.dataAccess.methods.insertDataLocation(
        this.state.account,
        this.state.name,
        this.state.institution,
        this.state.token,
        date,
        this.state.projectSummary,
        )
      .send({ from: this.state.account})
      .then((result) => { 
        console.log("data access insertdataLocation callback: "+ result);
        this.setState({...this.state, formStatus: true});
        this.setState({...this.state, data: result})
        })
        .catch((error) => { 
        console.log('Error insertdataLocation: '+ error)
        this.setState({...this.state, error: true});
      });
    
    }
  };



  render() {
    const {formStatus, web3, account, projectList, userName, existingProject}= this.state;
   /* const items = existingProject.map((items, index) => 
            <li key={index}> {items.ownerName}, {items.institution},{items.bgChainToken},{items.dateOfAccess},{items.projectSummary} </li>
            );*/
    if(!web3) {
      return<div>Loading Login Details via Smart Contract...
        <Spinner animation="border" variant="primary" />
      </div>
    }
    if(web3 && !formStatus) {
        return(
              <div>
                <h2>existing projects</h2>
                <Container>
                  <Row>
                    <Col>
                    <Explanation></Explanation>
                    </Col>
                    <Col>
                     <h5>You are logged in with User ID <Badge variant="secondary">{account}</Badge> and Username: {userName}</h5>
                    </Col>
                  </Row>
                </Container>
                <h3>
                  You have the below number of projects registered on the blockchain ready for research
                </h3>
                <li>{existingProject}</li>
                <BootstrapTable keyField='ownerName' data={ existingProject } columns={ firstTablecolumns } />
                <Row>
                  <Col> </Col>
                </Row>
                <Row>
                  <Col> </Col>
                </Row>
                <p>To Register a new project and interest to research enter the form below</p>
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
                <Form.Group controlId="institution.signUpInput">
                <Form.Label>Enter your Institutions name below (University)</Form.Label>
                <Form.Control
                  type="text"
                  name="institution"
                  placeholder="University of somewhere.."
                  onChange={this._handleChange.bind(this)} />
                  </Form.Group>
              <Form.Group controlId="projectSummary.signUpInput">
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
                <h3>Your Project is now <Badge variant="secondary">Registered</Badge></h3>
                <p>{projectList}</p>
              </div>
            )};
    };

}