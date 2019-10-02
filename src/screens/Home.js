import React, {Component} from 'react'
import {Card, Button, Row, Container, Col} from 'react-bootstrap';
import icon from '../assets/care.png'
import { withRouter } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props)
        this.routeRequest = this.routeRequest.bind(this);
        this.routeAbout = this.routeAbout.bind(this);
    
    };

    componentDidMount = async () => {};

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
            <h1>Home Page</h1>
        <Row>

        </Row>
        <Card>
            <Card.Img variant="top" src={icon} style={{ width: '8rem' }}  />
            <Card.Body>
                <Card.Title>This application is designed for researchers to quickly complete research </Card.Title>
                <Card.Text>
                We enable researchers to see summary level data and request access to patients records for
                research purposes.
                {"\n"}
                Make a research request now or select about to find out more...
                
                </Card.Text>
                <Row>
                <Col>
                <Button 
                    variant="outline-secondary"
                    onClick={this.routeRequest}>
                        Research</Button>
                </Col>
                <Col>
                <Button 
                    variant="outline-info"
                    onClick={this.routeAbout}>
                        Learn More </Button>
                </Col>
                </Row>
            </Card.Body>
            </Card>
            </div>

        )
    };
};

export default withRouter(Home);