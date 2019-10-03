import React from 'react'
import { Nav, Navbar} from 'react-bootstrap';
import styled from 'styled-components'
import lighterWhite from '../constants/Colors';


const Styles = styled.div`
    .navbar {
        background.color: #5E99C9

    }
    .navbar-brand, .navbar-nav .nav-link {
        color: #328895
    

    &:hover {
        color: #2E818A
    }
}
`;

export const NavigationBar = () => (
    <Styles>
        <Navbar expand="lg">
        <Navbar.Brand href="/">Research Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse  id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="/researchRequest">Research Request</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="/register">Register</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>

            </Nav>
        </Navbar.Collapse>

        </Navbar>

    </Styles>
)
