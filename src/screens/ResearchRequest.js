import React, {Component} from 'react'
import styled from 'styled-components'
import {Button, 
  Card, 
  Form, 
  Table, 
  Row, 
  Col,
  Alert,
  Spinner,
  ProgressBar} from 'react-bootstrap';

import getWeb3 from '../utils/getWeb3';
import DataAccess from '../../build/contracts/DataAccess.json'
import BootstrapTable from 'react-bootstrap-table-next';
import { ifError } from 'assert';
import { Redirect, useHistory } from "react-router-dom";



var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
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

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

const columns = [{
    dataField: '_id',
    text: 'Disease Name',
    sort: true
  }, {
    dataField: 'Disease_1',
    text: 'Disease Count'
  }];


export default class ResearchRequest extends Component {
    constructor() {
        super()
        this.state = {
            isFetching: false,
            showError: false,
            formStatus: false,
            assetError: false,
            data: [],
            existingProject: []
        };
      this.analyseRequest = this.analyseRequest.bind(this);
      this._loadBlockchain = this._loadBlockchain.bind(this)
      this._handleChange = this._handleChange.bind(this)
      this._pushForm = this._pushForm.bind(this)
      this._navAnalyse=this._navAnalyse.bind(this)
      this._pushFormUpdate=this._pushFormUpdate.bind(this)
    }
    componentDidMount() {
        this._getData();
        if(this.props.location.state!=null) {
          this.setState({
            existingProject: this.props.location.state.existingProject
          })
        } else {
        console.log('running load functions')
       // this.timer = setInterval(() => this._getData(), 20000);
        this._convertData();
        //this.timer = setInterval(() => this._convertData(), 5000);
        this._loadBlockchain()
        }

        };



      _loadBlockchain = async ()=>{
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
          
          this.timer = setInterval(() => this._validateData(), 5000);
     
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
          );
          console.log(error);
        }
      };

        _getData() {
            console.log('making front end request for disease summary...')
            var url = '/api/assets/summaryDisease/';
            const request = API_url + url;
            fetch(request) 
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log('_getData() success:',JSON.stringify(responseJson))
                    
                    this.setState({ 
                        isFetching: true,
                        data: responseJson, 
                    });
                    //console.log('api reponse: ',responseJson)
              })
                .catch((error) => {
                    console.log(error);
                    this.setState({...this.state, isFetching: true});
            });
          };

    _convertData = async () => {
        console.log('Chart request')
        var url = '/api/assets/summaryDisease/';
        const request = API_url + url;
        fetch(request) 
            .then((response) => response.json())
            .then((responseJson) => {        
                const chartData = ['Disease Name', 'Disease Count']
                const listItems = responseJson.map((data) => {data._id,data.Disease_1})
                chartData.push(listItems)
                console.log('charData',chartData)
                this.setState({ 
                   // isFetching: true,
                    //data: responseJson,
                    chartData: chartData
                });
                console.log('chart request: ', chartData)
          })
            .catch((error) => {
                console.log(error);
                //this.setState({...this.state, isFetching: true});
        });
      };

     _validateData() {
      this.state.dataAccess.methods.validateData(this.state.account).call()
      .then((result) => {
        console.log('validateData', JSON.stringify(result))
        if (result == false) {
        } else {
          this.state.dataAccess.methods.getData(this.state.account).call()
          .then((result) =>{
            console.log("getData: " + result);
            var a = JSON.stringify(result)
            console.log('object: ',a)
            this.setState({
                existingProject: result,
              })
            // make API call to check projects existing
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


    _getForm = async () => {
        this.setState({...this.state, formStatus: true});
    };
      // function to update state from form
    _handleChange(event) {
      switch(event.target.name) {
          case "_disease":
              this.setState({"_disease": event.target.value})
              console.log('_disease is', event.target.value)
              break;
          case "institution":
              this.setState({"institution": event.target.value})
              //console.log('email is', event.target.value)
              break;
          case "projectSummary":
              this.setState({"projectSummary": event.target.value})
            // console.log('projectSummary is', event.target.value)
              break;
              case "_researchStatus":
                this.setState({"_researchStatus": event.target.value})
              // console.log('projectSummary is', event.target.value)
                break;
          default:
              break;
        }
      }

      _navAnalyse() {
        let path = `/analyse`;
        this.props.history.push({pathname: path, state: {existingProject: this.state.existingProject}});

      }





    async _pushFormUpdate() {

      try {

        let url = '/api/bigchain/transferAsset';
        let request = API_url + url;

        let data = {
          "pubkey": this.state.existingProject.bgChainToken,
          "asset_Type": this.state._disease,
          "summary": this.state.existingProject.projectSummary,
          "researchStatus":this.state._researchStatus
        };
      console.log('pubkey:',data.pubkey)
      console.log('asset_Type:',this.state._disease)

      await fetch(request, {
        method: 'POST',
          headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
          },
            body: JSON.stringify(data)
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log('_pushForm Request Made, response: ',responseJson)
                    
                    if(responseJson.error == "Bigchain Query Error" || responseJson.error == "Incorrect Payload" ) {
                      this.setState({
                        showError: true
                      })
                    } else if (responseJson.length== 0) {
                      this.setState({
                        assetError: true
                      })
                      console.log('Empty response')
                    }else {     
                      this.setState({ 
                          assetPush: true,
                          tx: responseJson, 
                          showError: true,
                      });
                    }
                })
                .then(() => {
                  if (this.state.tx) {
                  this._navAnalyse();   
                  }
                })
                  .catch((error) => {
                      console.log('_pushForm error: ',error);
                      this.setState({...this.state, 
                        assetPush: false,
                        showError: true,
                      });
              });
          } catch (err) {
            console.log(err);
            this.setState({...this.state, 
              assetPush: false,
              showError: true,
            });

          }
        };

  

    async _pushForm() {

      this.setState({requestProgress:true})

      try {

        let url = '/api/bigchain/transferAsset';
        let request = API_url + url;

        let data = {
          "pubkey": this.state.existingProject.bgChainToken,
          "asset_Type": this.state._disease,
          "summary": this.state.existingProject.projectSummary,
          "researchStatus":this.state._researchStatus
        };
      console.log('pubkey:',data.pubkey)
      console.log('asset_Type:',this.state._disease)

      await fetch(request, {
        method: 'POST',
          headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
          },
            body: JSON.stringify(data)
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log('_pushForm Request Made, response: ',responseJson)
                    
                    if(responseJson.error == "Bigchain Query Error" || responseJson.error == "Incorrect Payload" ) {
                      this.setState({
                        showError: true
                      })
                    } else if (responseJson.message == "HTTP Error: Requested page not reachable") {
                      this.setState({
                        assetError: true
                      })
                      console.log('Error - data already owned by user')
                    }else {     
                      this.setState({ 
                          assetPush: true,
                          tx: responseJson, 
                          showError: true,
                          requestProgress:false
                      });
                    }
                })
                .then(() => {
                  if (this.state.tx) {
                  this._navAnalyse();   
                  }
                })
                  .catch((error) => {
                      console.log('_pushForm error: ',error);
                      this.setState({...this.state, 
                        assetPush: false,
                        showError: true,
                      });
              });
          } catch (err) {
            console.log(err);

          }
        };
    
    
    clearCache = async () => {
        try {
            //function to prevent old request occuring
        } catch (err) {
            console.log(err);
        }
    };

    analyseRequest() {
      let path = `/analyse`;
      this.props.history.push(path);
    }



    render() {
        const diseaseSummary = this.state.data;
        const {formStatus, chartData,dataLoadingStatus, existingProject, assetError, _disease,requestProgress}= this.state;
        const listItems = diseaseSummary.map((d) => 
            <li key={d._id}> {d._id}, {d.Disease_1} </li>
            );
        if(requestProgress == true) 
        {
        return(
          <div>
            <h2>
              <Spinner>
              </Spinner>
               Request being Made 
            </h2>
            <Spinner>
                
            </Spinner>

          </div>
        )
      }
        else if (assetError == false && formStatus == false) {
                return(
                <div>
                    <h2>
                        Below provides a summary of data available for research by disease type
                    </h2>
                <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
                <ProgressBar animated now={50} label={'Cohort Selection'}/>
                <BootstrapTable keyField='_id' data={ diseaseSummary } columns={ columns } />
                    <Card>
                    <Card.Header>Research Request...</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            To make a research proposal and complete analysis on the data in the system select the button below.
                        </Card.Text>
                        <Button variant="outline-secondary"
                                onClick={this._getForm}>
                            Go to request form
                        </Button>
                    </Card.Body>
                    </Card>
                    </div>
            )} else {
                return(
                    <div>
                        <h2>
                            To complete research on the data use the simple form below
                        </h2>
                      <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
                      <ProgressBar animated now={75} label={'Request'}/>
                    <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Your name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="My Name"
                        readOnly={'true'}
                        value={existingProject.ownerName} />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Please enter your research institution</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="My institution"
                        readOnly={'true'}
                        value={existingProject.institution} />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Select the type of disease you want to research upon</Form.Label>
                      <Form.Control 
                        as="select" multiple
                        name="_disease"
                        onChange={this._handleChange.bind(this)}>
                        {
                            diseaseSummary.map((obj) => {
                                return <option key={obj._id}>{obj._id}</option>
                            })
                        }
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                      <Form.Label>Please describe the status of your project</Form.Label>
                      <Form.Control 
                        as="select"
                        name="_researchStatus"
                        onChange={this._handleChange.bind(this)}
                        >
                        <option>Pre-Research anaylsis</option>
                        <option>Ongoing Research Project</option>
                        <option>New Research Project</option>
                        <option>Other</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Provide a lay summary of your research project</Form.Label>
                      <Form.Control 
                      as="textarea" 
                      rows="3" 
                      readOnly='true'
                      value={existingProject.projectSummary}/>
                    </Form.Group>
                    <Button 
                        variant="outline-secondary"
                        onClick={this._pushFormUpdate}>
                        Push to make Request
                        
                    </Button>
                  </Form>      
                  </div>
            )
        };
        };
    };

    