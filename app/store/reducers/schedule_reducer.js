import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
        case 'FINISHED_SEARCH':
			return {
				displayArray: action.displayArray, 
                searchfinished:true,
                origName:action.origName,
                destName:action.destName,
                price:action.price
			}; 
            
		default: return currentstate || initialState.schedule;
	}
};
