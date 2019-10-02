import React, {Component} from 'react';
import {Jumbotron as Jumbo, Container }from 'react-bootstrap';
import styled from 'styled-components';
import backGroundImg from '../assets/background2.jpg'
import backGroundLogged from '../assets/background_loggedIn.jpg'
import blueColor from '../constants/Colors';

const Styles = styled.div`
    .jumbo {
        background: url(${backGroundLogged}) no-repeat fixed bottom;
        background-size: cover;
        color: url(${blueColor})
        height: 200px
        position: relative
        z-index: -2;
    }
    .jumboLoggedIn {
        background: url(${backGroundLogged}) no-repeat fixed bottom;
        background-size: cover;
        color: url(${blueColor})
        height: 200px
        position: relative
        z-index: -2;
    }

    overlay {
        background-color: #5E99C9
        opacitiy: 0.6;
        position: absolute
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
    }
    h1 {
        color:#FFFAFA
    }
    
    h2 {
        color:#5E99C9
    }
    `;

export const Jumbotron = (props) => (
    <Styles>
        <Jumbo fluid className="jumbo">
            <div className="overlay"></div>
            <Container>
                <h1>
                    Blockchain Based Digital Health Research System
                </h1>
                <h2>
                    Here to enable you to complete research 
                </h2>
            </Container>
        </Jumbo>
    </Styles>
    );


