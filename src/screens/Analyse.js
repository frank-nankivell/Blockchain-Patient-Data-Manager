import React, {Component} from 'react'
import {
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Image,
} from 'react-bootstrap';

import getWeb3 from '../utils/getWeb3';
import DataAccess from '../../build/contracts/DataAccess.json'

class Analyse extends Component {
    constructor(props) {
        super(props)

        this.state = {
          loaded: false
        };

        this.routeRequest = this.routeRequest.bind(this);
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

render() {
    return(
        <div>
            <h2>
                Analysis
            </h2>
        </div>
        )
    };
};

export default Analyse;