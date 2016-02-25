import { combineReducers } from 'redux';
import scheduleReducer from './schedule_reducer';
import stopsReducer from './stops_reducer';

const rootReducer = combineReducers({
    schedule: scheduleReducer,
    stops: stopsReducer
});

export default rootReducer;
