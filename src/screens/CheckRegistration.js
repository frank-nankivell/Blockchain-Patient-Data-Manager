import React, {Component, WrappedComponent} from 'react'
import {
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Image,
    Button, 
    Spinner,
    Alert,
} from 'react-bootstrap';

import getWeb3 from '../utils/getWeb3';
import DataAccess from '../../build/contracts/DataAccess.json'

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

function AnalysisGreeting(props) {
    return(
    <div>
    <h1>
        Welcome back - get back to research
    </h1>
    <p>
     Select the button below to access previous data
    </p>      
  </div>

    );
}

function RegisterGreeting(props) {
    return(
    <div>     
    <h1>
        Not Registered
    </h1>
    <p>
        Please select the button to below to register on the system
    </p>
    </div>
    
    );
}

function Greeting(props) {
    const isRegistered = props.isRegistered;
    if (isRegistered) {
      return <AnalysisGreeting />;
    }
    return <RegisterGreeting />;
  }

function AnalysisButton(props) {
    return (
      <Button 
      variant="outline-secondary"
      onClick={props.onClick}>
      View data
    </Button>
    );
  }
  
  function RegisterButton(props) {
    return (
      <Button 
      variant="outline-secondary"
      onClick={props.onClick}>
      Select to register
    </Button>
    );
  }



class CheckRegistration extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            isRegistered: false,
            showError: false,
            web3: null,
            account: null,
            dataAccess: null,
            existingProject: null
        }

        this._loadBlockchain = this._loadBlockchain.bind(this)
        this._loadRegistration = this._loadRegistration.bind(this)
        this._routeAnalysis = this._routeAnalysis.bind(this)
        this._routeHome = this._routeHome.bind(this)
        this._routeRegister = this._routeRegister.bind(this)
     //   this.renderAnalyis = this.renderAnalyis.bind()
     //   this.renderAnalyisEmpty = this.renderAnalyisEmpty.bind(this)

    };


    componentDidMount = async () => {
        this._loadBlockchain()
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
    
          this._loadRegistration();
     
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
          );
          console.log(error);
        }
      };

      _loadRegistration() {
        this.state.dataAccess.methods.validateData(this.state.account).call()
        .then((result) => {
          console.log('validateData', JSON.stringify(result))
          if (result == false) {
          this.setState({
            loaded:true,
            isRegistered:false
            })
          } else {
            this.state.dataAccess.methods.getData(this.state.account).call()
            .then((result) =>{
              console.log("getData: " + result);
              var a = JSON.stringify(result)
              console.log('object: ',a)
              this.setState({
                  existingProject: result,
                  isRegistered: true,
                  loaded:true
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




    _checkAnalysis() {

        let data = this.state.existingProject.pubkey;

        console.log('making Request for owned Data')
        var url = '/api/assets/checkspends/';
        const request = API_url + url;
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
              console.log('_getData() success:',JSON.stringify(responseJson))

              if (responseJson[0].transaction_id!=null) {
                
                this.setState({ 
                    data: responseJson, 
                });
                this.renderAnalyis();
            } else {
                this.renderAnalyisEmpty();
            }
        })
        .catch((error) => {
                console.log(error);
                this.setState({...this.state, isFetching: true});
        });
      };

    _routeAnalysis() {
        let path = `/analyse`;
        this.props.history.push({
        pathname: path,
        state: { loaded: false,
                  assetPush: false,
                  num: 0,
                  dataAnalysis: [] 
        }
      })
  };
    _routeRegister() {
        let path = `/register`;
        this.props.history.push({
          pathname: path,
          state : {
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
          count: '1'
      }
    })
  };
    _routeHome() {
        let path = `/home`;
        this.props.history.push(path);
    }
     


render() {
    const { loaded, isRegistered} = this.state;
    let button;
    if(!loaded) {
    return(
        <div>
        <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
        <Button variant="secondary" disabled>
            <Spinner
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
            />
            Loading...
        </Button>
        </div>
    )
   
} else {
    if(isRegistered) {
        button = <AnalysisButton onClick={this._routeAnalysis} /> 
    } else {
        button = <RegisterButton onClick={this._routeRegister} />
    }

    return(
        <div>
        <DivWithErrorHandling showError={this.state.showError}></DivWithErrorHandling>
        <Greeting isRegistered={isRegistered} />
        <Container>
          <Row>
        <Col>
          {button}
        </Col>
        <Col>
            <Button 
                variant="outline-info"
                onClick={this.routeHome}>
                Go back </Button>
                </Col>
                </Row>
          </Container>
        </div>
        )
        };
    };
};

export default CheckRegistration;

