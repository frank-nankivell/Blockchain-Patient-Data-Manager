import React, {Component} from 'react'
import {Card, Button, Row, Container, Col} from 'react-bootstrap';
import icon from '../assets/care.png'
import { withRouter, router } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props)
        this.routeRequest = this.routeRequest.bind(this);
        this.routeAbout = this.routeAbout.bind(this);
        this.routeCheckRegistration = this.routeCheckRegistration.bind(this);
    };

    componentDidMount = async () => {};

    routeRequest() {
        let path = `/researchRequest:1`;
        this.props.history.push(path);
      }

      routeCheckRegistration() {
        let path = `/checkRegistration:1`;
        this.props.history.push(path);
        this.props.history.replace({pathname: '/checkRegistration:1'})

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