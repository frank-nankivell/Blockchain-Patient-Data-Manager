import React, {Component} from 'react'
import styled from 'styled-components'

// UI components
import BootstrapTable from 'react-bootstrap-table-next';
import {
  Form,
  Badge,
  Spinner,
  Alert,
  ProgressBar,
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

const API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  API_url = 'enterProdURL';
}
const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          We are working on it - apologies!
        </p>
      </Alert>
      </div>}
      {children}
    </WrappedComponent>
  );
};
const DivWithErrorHandling = withErrorHandling(({children, message}) => <div>{children}</div>)

// contract data
import DataAccess from '../../build/contracts/DataAccess.json'

//  constructor and class definition
export default class Register extends Component {
  constructor(props) {
      super(props)
      this.state = {
          formStatus: false,
          showError: false,
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
      this._loadBlockchain = this._loadBlockchain.bind(this)
      this._handleChange = this._handleChange.bind(this)
      this._validateData = this._validateData.bind(this)
      this._getToken = this._getToken.bind(this)
      this._registerProject = this._registerProject.bind(this);
  };

  //
  componentDidMount() {
    if(this.props.location.state) {
      this.setState({
        dataAccess: this.props.location.state.dataAccess,
        account: this.props.location.state.account
      })
      this._loadBlockchain()
      //this._validateData(this.props.location.state.existingProject.dataAccess,this.props.location.state.account)

    } else {
    this._loadBlockchain()
    }
  };

    _loadBlockchain = async() => {
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
  
        this._validateData(this.state.dataAccess);
   
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
        );
        console.log(error);
      }
    };


  _validateData(dataAccess, account) {
    var da, ac
    if(dataAccess && account) {
      da = dataAccess;
      ac = account
    } else {
      da = this.state.dataAccess;
      ac = this.state.account;
    }
  da.methods.validateData(ac).call()
  .then((result) => {
    console.log('validateData', JSON.stringify(result))
    if (result == false) {
    this._getToken();
    } else {
      da.methods.getData(ac).call()
        .then((result) =>{
          console.log("getData: " + result);
          var a = JSON.stringify(result)
          console.log('object: ',a)
          var array =[]
          array.push(result[0]);
          console.log('array,',array)
          this.setState({
            existingProject: result, 
            formStatus: true})
        })
      .catch((err) => {
        console.log("Error GetData: "+err)
        this.setState({...this.state,showError:true})
      });
    }
})
.catch((error) => {
    console.log("Error GetDataCount: "+error);
    this.setState({...this.state,showError:true})
});
};


routeAnalyse() {
  let path = `/analyse`;
  this.props.history.push({pathname: path, state: {existingProject: this.state.existingProject}});

}


routeResearchRequest() {
  let path = `/researchRequest`;
  this.props.history.push({pathname: path, state: {existingProject: this.state.existingProject}});

}


  // function to update state from form
  _handleChange(event) {
    switch(event.target.name) {
        case "name":
            this.setState({"name": event.target.value})
            console.log('name is', event.target.value)
            break;
        case "institution":
            this.setState({"institution": event.target.value})
            console.log('email is', event.target.value)
            break;
        case "projectSummary":
            this.setState({"projectSummary": event.target.value})
            console.log('projectSummary is', event.target.value)
            break;
        default:
            break;
      }
    }
    // function to get token to record on the chain
      _getToken() {
        var QUERY = '/api/bigchain/makeKey'
        fetch(API_url + QUERY, {
        })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);      
          if(responseJson.error) {
            this.setState({
              showError: true,
            })
          } else {
            this.setState({...this.state, token: responseJson})
          }
        })
        .catch(error => {
          console.log(error)
          this.setState({
            showError: true,
            errorMessage: error})
        })
      };

    // function to register project on chain
     async _registerProject(event)
    { 
    try {
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
        this.setState({data: result})
        this._validateData()
        })
      .then(() => {
        this.setState({...this.state, formStatus: true})
      })
      .catch((error) => { 
        console.log('Error insertdataLocation: '+ error)
        this.setState({...this.state, showError: true});
      }); 
    } else {
      this.setState({...this.state, showError: true});
    }
  } catch {
    console.log("Error catch")
    this.setState({...this.state, showError: true});
  }
};



  render() {
    const {formStatus, web3, account, existingProject, errorMessage}= this.state;

    if(!web3) {
      return<div>Loading...
        <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
        <h4>
          To load form press here
        </h4>
        <Button
                  type="submit"
                  variant="outline-secondary"
                  onClick={this._loadBlockchain}>
                  Load Form
        </Button>

      </div>
    }
    if(web3 && !formStatus) {
        return(
              <div>
                <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
                <ProgressBar animated now={20} label={'Registration'}/>
                <p>To Register a new project and interest to research enter the form below</p>
              <Form onSubmit={this._registerProject}>
                <Form.Group controlId="name.signUpInput">
                  <Form.Label>User ID</Form.Label>
                    <Form.Control
                    type="text"
                    readOnly='true'
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
              <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
              <ProgressBar animated now={33} label={'Registered'}/>
                <h3>Your Project is <Badge variant="secondary">Registered</Badge></h3>
                <Row>
                  <Col>
                  <Button
                      type="submit"
                      variant="outline-primary"
                      onClick={this.routeResearchRequest.bind(this)}>
                      Select a new cohort
                    </Button>
                  </Col>
                  <Col>
                  <Button
                      type="submit"
                      variant="outline-primary"
                      onClick={this.routeAnalyse.bind(this)}>
                      Go to analysis
                    </Button>
                  </Col>
                </Row>
                <Form>
                <Form.Group controlId="name.signUpInput">
                  <Form.Label>User ID</Form.Label>
                    <Form.Control
                    type="text"
                    readOnly={'true'}
                    name="account"
                    value={account}/>
              </Form.Group>
              <Form.Group controlId="name.signUpInput">
                  <Form.Label>Creation Date</Form.Label>
                    <Form.Control
                    type="text"
                    readOnly={'true'}
                    name="account"
                    value={existingProject.dateOfAccess}/>
              </Form.Group>
              <Form.Group controlId="account.signUpInput">
                <Form.Label>User Name</Form.Label>
                      <Form.Control
                      type="text"
                      readOnly={'true'}
                      name="name"
                      value={existingProject.ownerName}
                      placeholder="your name"
                      />
                </Form.Group>
                <Form.Group controlId="institution.signUpInput">
                <Form.Label>Institution Name (University)</Form.Label>
                <Form.Control
                  type="text"
                  name="institution"
                  readOnly={'true'}
                  value={existingProject.institution}
                   />
                  </Form.Group>
              <Form.Group controlId="projectSummary.signUpInput">
              <Form.Label>Project Summary</Form.Label>
              <Form.Control
                type="text"
                readOnly={'true'}
                name="projectSummary"
                value={existingProject.projectSummary} />
                </Form.Group>
              </Form>
              </div>
            )};
    };

}