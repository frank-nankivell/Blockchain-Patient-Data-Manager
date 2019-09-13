import React, {Component} from 'react'
import styled from 'styled-components'
import {Button} from 'react-bootstrap';
import {Alert} from 'react-native-web'
import {blue1,lighterWhite} from '../constants/Colors';

const Styles = styled.div`
    .Button {
        color: ${blue1}
}`;

// SPA 
// First line provides button to see counts 
// Button provides count by disease
// Form then required 

export default class ResearchRequest extends Component {
    constructor() {
        super()
        this.state = {
            isFetching: false,
            data: []
        };
    }
    componentDidMount() {
        this._getData();
        this.timer = setInterval(() => this.fetchData(), 5000);
        }; 

    _getData = async () => {
        try {
            this.setState({...this.state, isFetching: true});
      }
        catch (err) {
            // error handling
            console.log(err)    
            this.setState({...this.state, isFetching: false});
        }
    };
   
    clearCache = async () => {
        try {
            //function to prevent old request occuring
        } catch (err) {
            console.log(err);
        }
    };

    render() {
            return (
                <div>
                <Button variant="outline-secondary" 
                        size="lg" 
                        onClick={this._loadSummary}
                        block>
                    Data Counts
                </Button>
                </div>
            );
        };
    };

    