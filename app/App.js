import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import actions from './actions';

import OrigDest  from './components/origDest';

export class App extends Component {
	render() {
		return (
			<Provider store={store}>
                <div>
                    <OrigDest />
                </div>
			</Provider>
		);
	}
}
