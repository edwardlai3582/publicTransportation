import { combineReducers } from 'redux';


import { reducer as formReducer } from 'redux-form';

import scheduleReducer from './schedule_reducer';
import stopsReducer from './stops_reducer';

const rootReducer = combineReducers({
    form: formReducer,
    schedule: scheduleReducer,
    stops: stopsReducer
});

export default rootReducer;
