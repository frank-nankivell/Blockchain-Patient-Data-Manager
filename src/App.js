import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Text, StyleSheet, View} from 'react-native'
import {Route, Link, BrowserRouter as Router } from 'react-router-dom'

import HeaderNav from './components/HeaderNav';

import {Form, Button, Navbar, Nav, NavDropdown, FormControl} from 'react-bootstrap';



function App() {
  return (
    <HeaderNav></HeaderNav>
  );
}

const styles = StyleSheet.create ({
  backgroundContainer: {
      flex: 1,
      width: null, 
      height: null,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#6EC3CF'
    }
});

export default App;


