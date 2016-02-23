import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
		case 'GOT_RESULT':
			return {
				orig: action.orig,
                dest: action.dest,
			};
		default: return currentstate || initialState.schedule;
	}
};
