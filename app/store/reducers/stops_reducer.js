import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
		case 'GOT_STOPS':
			return {
				stopsArray: action.stopsArray
			};
            
		default: return currentstate || initialState.schedule;
	}
};