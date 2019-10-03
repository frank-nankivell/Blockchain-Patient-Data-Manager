import React, {Component} from 'react'
import styled from 'styled-components'
import {Button, Card, Form, Table } from 'react-bootstrap';
import {Alert} from 'react-native-web'
import {blue1,lighterWhite} from '../constants/Colors';
import { withRouter } from 'react-router-dom';
import Chart from "react-google-charts";

import BootstrapTable from 'react-bootstrap-table-next';
const pieOptions = {
    title: "",
    pieHole: 0.6,
    slices: [
      {
        color: "#2BB673"
      },
      {
        color: "#d91e48"
      },
      {
        color: "#007fad"
      },
      {
        color: "#e9a227"
      }
    ],
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "233238",
        fontSize: 14
      }
    },
    tooltip: {
      showColorCode: true
    },
    chartArea: {
      left: 0,
      top: 0,
      width: "100%",
      height: "80%"
    },
    fontName: "Roboto"
  };

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

const columns = [{
    dataField: '_id',
    text: 'Disease Name',
    sort: true
  }, {
    dataField: 'Disease_1',
    text: 'Disease Count'
  }];

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
        this.timer = setInterval(() => this._getData(), 5000);
        this._convertData();
        this.timer = setInterval(() => this._convertData(), 5000);

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

    /*
    Add back into the render method when it works
        <Chart
                        chartType="PieChart"
                        data={chartData}
                        options={pieOptions}
                        graph_id="PieChart"
                        width={"100%"}
                        height={"400px"}
                        legend_toggle
                        />
                <Card>
                */

    render() {
        const diseaseSummary = this.state.data;
        const {formStatus, chartData,dataLoadingStatus}= this.state;
        const listItems = diseaseSummary.map((d) => 
            <li key={d._id}> {d._id}, {d.Disease_1} </li>
            );
        if (formStatus == false) {
                return(
                <div>
                    <h2>
                        Below provides a summary of data available for research by disease type
                    </h2>
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
                            diseaseSummary.map((obj) => {
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

    