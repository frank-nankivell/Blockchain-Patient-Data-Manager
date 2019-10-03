import React, {Component} from 'react'
import {
    Popover,
    OverlayTrigger,
    Button
} from 'react-bootstrap';

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">How does the login work?</Popover.Title>
    <Popover.Content>
      Authentication for this app is managed by the blockchain contract itself, and will required metamask downloading to a browser. https://github.com/MetaMask
      However that does mean you still need to register the project before being able to complete research
    </Popover.Content>
  </Popover>
);

const Output = () => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="outline-info">How does authentication work?</Button>
  </OverlayTrigger>
);

class Explanation extends Component {

  render() {
    return(
      <Output/>
    );
  };
};

  export default Explanation;
