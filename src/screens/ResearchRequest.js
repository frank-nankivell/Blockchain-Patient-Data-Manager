import React, {Component} from 'react'
import styled from 'styled-components'
import {Button, Card, Form} from 'react-bootstrap';
import {Alert} from 'react-native-web'
import {blue1,lighterWhite} from '../constants/Colors';

const Styles = styled.div`
    .Button {
        color: ${blue1}
    }
    .Card {

    }
`;

var API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}

// SPA 
// First line provides button to see counts 
// Button provides count by disease
// Form then required 

export default class ResearchRequest extends Component {
    constructor() {
        super()
        this.state = {
            isFetching: false,
            formStatus: false,
            data: []
        };
    }
    componentDidMount() {
        this._getData();
    //    this.timer = setInterval(() => this._getData(), 5000);
        }; 

    _getData() {
            console.log('making front end request for disease summary...')
            var url = '/api/assets/summaryDisease/';
            const request = API_url + url;
            fetch(request) 
                .then((response) => response.json())
                .then((responseJson) => {
                    
                    this.setState({ 
                        isFetching: true,
                        data: responseJson, 
                    });
                    console.log('api reponse: ',responseJson)
              })
                .catch((error) => {
                    console.log(error);
                    this.setState({...this.state, isFetching: true});
            });
    };

    _getForm = async () => {
        this.setState({...this.state, formStatus: true});
    };

    _pushForm = async() => {
        //
    }
    
    clearCache = async () => {
        try {
            //function to prevent old request occuring
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const data = this.state.data;
        const formStatus = this.state.formStatus;
        const listItems = data.map((d) => 
            <li key={d._id}> {d._id}, {d.Disease_1} </li>
            );
        if (formStatus == false) {
                return(
                <div>
                    <h2>
                        Below provides a summary of data available for research by disease type
                    </h2>
                {listItems}
               

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
                    <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Enter your email address</Form.Label>
                      <Form.Control type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Please enter your research institution</Form.Label>
                      <Form.Control type="email" placeholder="My institution" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Select the type of disease you want to research upon</Form.Label>
                      <Form.Control as="select" multiple>
                      {
                            data.map((obj) => {
                                return <option key={obj._id}>{obj._id}</option>
                            })
                        }
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                      <Form.Label>Please describe the status of your project</Form.Label>
                      <Form.Control as="select">
                        <option>Pre-Research anaylsis</option>
                        <option>Ongoing Research Project</option>
                        <option>New Research Project</option>
                        <option>Other</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Provide a lay summary of your research project</Form.Label>
                      <Form.Control as="textarea" rows="3" />
                    </Form.Group>
                    <Button 
                        variant="outline-secondary"
                        onClick={this._pushForm}>
                        Push to make Request
                        
                    </Button>
                  </Form>      
                  </div>
            )
        };
        };
    };

    