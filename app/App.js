import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import actions from './actions';

import OrigDest  from './components/origDest';
import Display from './components/display';

export class App extends Component {
	componentWillMount() {
		
	}
    
	render() {
		return (
			<Provider store={store}>
                <div>
                    <OrigDest />
                    <Display />
                </div>
			</Provider>
		);
	}
}
