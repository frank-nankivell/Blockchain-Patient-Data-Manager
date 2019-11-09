import React, {Component} from 'react'
import {
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Image,
    Alert,
    Spinner
} from 'react-bootstrap';


var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}

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

class Analyse extends Component {
    constructor(props) {
        super(props)

        this.state = {
          loaded: false,
          assetPush: false,
          num: 0

        };

        this.routeRequest = this.routeRequest.bind(this);
        this._validateData = this._validateData.bind(this);
        this.routeAbout = this.routeAbout.bind(this);
        this._loadBlockchain = this._loadBlockchain.bind(this)

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
    
          this._validateData();
     
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. You need to install MetaMask to authenticate and login`
          );
          console.log(error);
        }
      };

    routeRequest() {
        let path = `/researchRequest`;
        this.props.history.push(path);
      }

      
      routeAbout() {
        let path = `/about`;
        this.props.history.push(path);
      }

      _validateData() {
        this.state.dataAccess.methods.getDataCount().call()
        .then((result) => {
          console.log("GetDataCount: " + result);
          if(result == 0) {
            console.log("Contract less than 1, No data stored");    
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
            });
          }
      })
      .catch(function(err) {
          console.log("Error GetDataCount: "+err);
      });
    };

    async _getAssets() {
        try {
          let url = '/api/bigchain/checkOwnedData';
          let request = API_url + url;
          let data = {
            "pubkey": this.state.existingProject.bgChainToken,
          };
          
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
  } catch (err) {
    console.log(err)
    this.setState({...this.state, showError: true});
  }
};

  _getData() {

  }

render() {
  const {assetNum, assetPush} = this.state

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
            <p> You have already had confirmed access to research on {assetNum} records</p>
        </div>
        )
    };
};

export default Analyse;