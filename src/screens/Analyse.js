import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import {
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Image,
    Alert,
    Spinner,
    Button,
} from 'react-bootstrap';

var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}
import { Chart } from "react-google-charts";
import browserHistory from 'react-router-dom';



import getWeb3 from '../utils/getWeb3';
import DataAccess from '../../build/contracts/DataAccess.json'

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
import ExportCSV from '../components/ExportCsv'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import { throwStatement } from '@babel/types';
import chartGraphDisease from '../utils/chartGraphDisease';
import chartGraphGender from '../utils/chartGraphGender';




const columns = [{
  dataField: 'data.Patient_ID',
  text:'Patient Identifier',
  sort: true
}, {
  dataField: 'data.Birth_date',
  text: 'Date of Birth',
  sort: true
},
{
  dataField: 'data.Gender',
  text: 'Gender',
  sort: true,
},
{
  dataField: 'data.Disease_1',
  text: 'Disease Name'
},{
  dataField: 'data.Response_1',
  text: 'Response to Disease '
}, {
  dataField: 'data.Clinician_name',
  text: 'Name of Clinican'
}];



class Analyse extends Component {
    constructor(props) {
        super(props)
        this.state = {
          loaded: false,
          refresh:false,
          assetPush: false,
          num: 0,
          dataAnalysis: [],
          fileName: "name"
        };

        this._validateData = this._validateData.bind(this);
        this.routeAbout = this.routeAbout.bind(this);
        this._loadBlockchain = this._loadBlockchain.bind(this);
        this._getData = this._getData.bind(this)
        this._doGraphs = this._doGraphs.bind(this);

    };

    async componentDidMount () {
      if(this.props.location.state){
        this.setState({
          existingProject: this.props.location.state.existingProject,
          loaded: this.props.location.state.loaded,
          isRegistered: this.props.location.state.isRegistered
      })
      this._getAssets(this.props.location.state.existingProject.bgChainToken)
      } 
      else {
      this._loadBlockchain()
      };
    }


  componentDidUpdate(prevProps, prevState) {
      if (prevState.dataAnalysis !== this.state.dataAnalysis) { // or compare with `prevState`
        this._loadBlockchain()
      } else {
        console.log('data already loaded')
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
    
          this._validateData();
     
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
          );
          console.log(error);
        }
      };


      
      routeAbout() {
        let path = `/about`;
        this.props.history.push(path);
      }

      routeResearchRequest() {
        let path = `/researchRequest`;
        this.props.history.push({pathname: path, state: {existingProject: this.state.existingProject}});

      }


      _validateData() {
        this.state.dataAccess.methods.validateData(this.state.account).call()
        .then((result) => {
          console.log("GetDataCount: " + result);
          if(result == false) {
            console.log("No project registered -> result:",result);
                
          } else {
            this.state.dataAccess.methods.getData(this.state.account).call()
            .then((result) =>{
              console.log("getData: " + result);
              var a = JSON.stringify(result)
              console.log('object: ',a)
              this.setState({existingProject: result})
              this._getAssets();
            })
            .catch((err) => {
              console.log("Error GetData: "+err)
              this.setState({...this.state,showError:true})
            });
          }
      })
      .catch(function(err) {
          console.log("Error GetDataCount: "+err)
          this.setState({...this.state,showError:true})
      });
    };

       _getAssets(token) {
        var data;
        if(token) {
           data = {
            "pubkey": token
          }
        }
        else {
          data = {
            "pubkey": this.state.existingProject.bgChainToken,
          };
        };

          let url = '/api/bigchain/checkOwnedData';
          let request = API_url + url;
          
          fetch(request, {
          method: 'POST',
            headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('_getAssets Request Made, response: ',responseJson)
              console.log(JSON.stringify(responseJson))
              // need to handle error forwhen when request is 400
              var num = Object.keys(responseJson).length
                this.setState({ 
                    assetPush: true,
                    assetNum: num,
                    tx: responseJson, 
          });
          console.log("values numbered are ", num);

          })
          .then(() => {
            this._getData();
          })
          .catch((error) => {
              console.log('_getAssets error: ',error);
              this.setState({...this.state, showError: true});
        });
  };

  _getData() {
      let url = '/api/assets/getDatabyID';
      let request = API_url + url;
      let data = {
        "array": this.state.tx,
      };
      fetch(request, {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('_getData Request Made, response: ',responseJson)
          console.log(JSON.stringify(responseJson))
            this.setState({ 
                assetPush: true,
                dataAnalysis: responseJson
      })
      this._doGraphs();
    })
      .catch((error) => {
        console.log('_getData error: ',error);
        this.setState({...this.state, showError: true});
  });
};

  _doGraphs = async() => { 

    try {

      console.log('this state data analysis',this.state.dataAnalysis)
      const chartDataDisease = await chartGraphDisease(this.state.dataAnalysis);
      console.log('data disease',chartDataDisease)
      this.setState({chartDisease: chartDataDisease})

      const chartDataGender = await chartGraphGender(this.state.dataAnalysis);
      console.log('chart disease',chartDataGender)
      this.setState({chartGender: chartDataGender})

      } catch {
        this.setState({...this.state, showError: true});
        console.log('error')
      }

  };

render() {
  //this._loadBlockchain()
  const {assetNum, assetPush, dataAnalysis, chartDisease, chartGender} = this.state
  const {ExportCSVButton} = CSVExport;

  if(!assetPush){
    return(
      <div>
      <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
      <h2> Loading
        <Spinner animation="border" variant="primary" />
      </h2>
      </div>
    )
  }
    return(

        <div>
        <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
            <h2>
                Analysis
            </h2>
            <Row>
                  <Col>
                  <p> You have already had confirmed access to research on {assetNum} records</p>
                  </Col>
                  <Col>
                  <Button
                      type="submit"
                      variant="outline-primary"
                      onClick={this.routeResearchRequest.bind(this)}>
                      Select a new cohort to analyse
                    </Button>
                  </Col>
                </Row>
        <Tabs id="controlled-tab-about" defaultActiveKey="table">
        <Tab eventKey="table" title="Data Table">
          <Row>
          <BootstrapTable keyField='_id' data={ dataAnalysis } columns={ columns } />
          </Row>
        </Tab>
        <Tab eventKey="graphs" title="Graphs">
            <Row>
            <Col>  
                <p>
                   By Disease
                 </p>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={chartDisease}
                options={{
                  title: 'Summary by Disease type',
                }}
                rootProps={{ 'data-testid': '1' }}
                />
                 </Col>
                 <Col>
                 <p>
                   By Gender
                 </p>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={chartGender}
                options={{
                  title: 'Summary by Gender',
                }}
                rootProps={{ 'data-testid': '1' }}
                />
                 </Col>
            </Row>
      </Tab>
      <Tab eventKey="export" title="Data Export">
        <div className="col-md-4 center">
        <ToolkitProvider
            keyField="id"
            data={ dataAnalysis }
            columns={ columns }
            exportCSV
          >
            {
              props => (
                <div>
                  <ExportCSVButton { ...props.csvProps }>Download Data</ExportCSVButton>
                  <hr />
                  <BootstrapTable { ...props.baseProps } />
                </div>
              )
            }
          </ToolkitProvider>
        </div>
      </Tab>
    </Tabs>
        </div>
        )
    };
};

export default Analyse;