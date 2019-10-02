import React, {Component} from 'react'
import {
    Container,
    Row,
    Tabs,
    Tab,
} from 'react-bootstrap';

import styled from 'styled-components';

const Styles = styled.div`
    h2 {
        color:#5E99C9
    }
    `


class About extends Component {
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
            <h2>About</h2>
        
    <Tabs id="controlled-tab-about" defaultActiveKey="patient">
      <Tab eventKey="patient" title="The Patient">
        <Row>
            <p>There are over 100 records of patient information loaded into the system.
                Patients are able to have a transparent understanding of when users want to interact with 
                them on the blockchain. Researchers can interact with them via a reseearch request. However for this 
                version of the system there will be a systematic approval for each request.
            </p>
        </Row>
      </Tab>
      <Tab eventKey="blockckchain" title="The Blockchain">
            <p>The application has been built through using an open blockchain concept where users are able
                to login and store credentials with a private key, normally handled via metamask. Users then use an
                encrypted system token stored on the blockchain which is then able to used to complete a tranfer of patients records.
            </p>
      </Tab>
      <Tab eventKey="researcher" title="The Researcher">
        <p> Reseachers (like yourselves) can now access this application and make researh requests to get an understanding of
            what data is available. This data can then be requested and tranferred for analysis if approved by the end user owner.
                </p>
      </Tab>
    </Tabs>
        </div>
        )
    };
};

export default About;