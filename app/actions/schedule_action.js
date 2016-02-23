

const scheduleActions = {    
    findSchedule(data){
        console.log('orig='+data.orig+', dest='+data.dest);
        return (dispatch) => {
            dispatch({ type: 'GOT_RESULT', orig:data.orig, dest:data.dest });    
        };
    }
};

export default scheduleActions;
