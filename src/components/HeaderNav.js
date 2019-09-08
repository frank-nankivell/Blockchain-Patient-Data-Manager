import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

// Screens import

import Login from '../screens/Login';
import DataHome from '../screens/DataHome';
import DataLogin from '../screens/DataLogin';
import ResearchRequest from '../screens/ResearchRequest';
// Static content import 
//import bgImage from '../../public/images/background1.jpg'



function HeaderNav() {
    return (
      <View style ={styles.backgroundContainer}>
      <Router>
        <div>
          <Header />
          <Route exact path="/" component={Home} style={styles.routeText} />
          <Route path="/Login" component={Login} />
          <Route path="/DataHome" component={DataHome} />
          <Route path="/DataLogin" component={DataLogin} />
          <Route path="/ResearchRequest" component={ResearchRequest} />
        </div>
      </Router>
      </View>
    );

  
  function Home() {
    return <h2>Home</h2>;
  }
  
  function About() {
    return <h2>Login</h2>;
  }

  function ResearchRequest() {
    return <h2>Research Request</h2>;
  }
  
  function Topic({ match }) {
    return <h3>Requested Param: {match.params.id}</h3>;
  }
  
  function Topics({ match }) {
    return (
      <div>
        <h2>Topics</h2>
  
        <ul>
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
          </li>
        </ul>
  
        <Route path={`${match.path}/:id`} component={Topic} />
        <Route
          exact
          path={match.path}
          render={() => <h3>Please select a topic.</h3>}
        />
      </div>
    );
  }
  
  function Header() {
    return (
      <View style={styles.backgroundContainer} > 
      <Text style={styles.row1Text}>
        <Link to="/">Home</Link>
      </Text>
      <Text>
        <Link to="/Login">Login</Link>
      </Text>
      <Text>
        <Link to="/DataHome">DataHome</Link>
      </Text>
      <Text>
        <Link to="/Research Request">Research Request</Link>
      </Text>
      <Text>
        <Link to="/DataLogin">DataLogin</Link>
      </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create ({
  backgroundContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gridRowStart: 'true',
      backgroundColor: '#6EC3CF'
    },
  routeText: {
    alignItems: 'left',
    fontSize: 25
  },
  row1Text: {

  }
});

export default HeaderNav;