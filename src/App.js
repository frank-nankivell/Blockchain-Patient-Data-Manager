import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Text, StyleSheet, View} from 'react-native'
import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'
import {Form, Button, Navbar, Nav, NavDropdown, FormControl} from 'react-bootstrap';

import Home from './screens/Home';
import DataLogin from './screens/DataLogin';
import ResearchRequest from './screens/ResearchRequest';
import About from './screens/About';
import Register from './screens/Register';
import NoMatch from './screens/NoMatch'

import { Layout } from './components/Layout'
import {NavigationBar} from './components/NavigationBar';
import { Jumbotron} from './components/Jumbotron';



function App() {
  return (
    <React.Fragment>
      <NavigationBar />
      <Jumbotron> </Jumbotron>
      <Layout>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/researchRequest" component={ResearchRequest} />
          <Route exact path="/about" component={About} />
          <Route exact path="/datalogin" component={DataLogin} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
      </Layout>
    </React.Fragment>
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


