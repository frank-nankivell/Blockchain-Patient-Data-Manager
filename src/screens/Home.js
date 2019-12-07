import React, {Component} from 'react'
import {Card, Button, Row, Container, Col} from 'react-bootstrap';
import icon from '../assets/care.png'
import { withRouter, Link, NavLink, Redirect} from 'react-router-dom';
import getWeb3 from '../utils/getWeb3';
import DataAccess from '../../build/contracts/DataAccess.json'
import browserHistory from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            web3: null,
            account: null,
            dataAccess: null,
            existingProject: null

        }



        this._loadBlockchain = this._loadBlockchain.bind(this);
        this.routeRequest = this.routeRequest.bind(this);
        this.routeAbout = this.routeAbout.bind(this);
        this.forceUpdate = this.forceUpdate
        this.routeCheckRegistration = this.routeCheckRegistration.bind(this);
    };

    componentDidMount() {
       this._loadBlockchain();

    };

    routeRequest() {
        let path = `/researchRequest`;
        this.props.history.push(path);
      }

      routeCheckRegistration() {
        let path = `/checkRegistration`;
        this.props.history.push({pathname: path, 
            state: {
                account: this.state.account,
                existingProject: this.state.existingProject,
                loaded: this.state.loaded,
                isRegistered: this.state.isRegistered
            }
        });
      }

      
      routeAbout() {
        let path = `/about`;
        this.props.history.push(path);
      }

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
            `Failed to load web3, accounts, or contract. You need to install MetaMask For this application`
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


    

render() {
    return(
        <div>
            <h1>Home Page</h1>
        <Row>

        </Row>
        <Card>
            <Card.Img variant="top"  style={{ width: '8rem' }}  />
            <Card.Body>
                <Card.Title>This application is designed for researchers to quickly complete research </Card.Title>
                <Card.Text>
                We enable researchers to see summary level data and request access to patients records for
                research purposes.
                {"\n"}
                Register a project now to access data within the system
                </Card.Text>
                <Row>
                <Col>
                <Button 
                    variant="outline-info"
                    onClick={this.routeAbout}>
                        Learn More </Button>
                </Col>
                <Col>
                <Button
                      variant="outline-info"
                      onClick={this.routeCheckRegistration}>
                          Check Registration </Button>
                </Col>
                </Row>
            </Card.Body>
            </Card>
            </div>

        )
    };
};

export default withRouter(Home);