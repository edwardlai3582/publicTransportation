const stopsActions = {    
    findStops(){
        return (dispatch) => {
            fetch('./GTFSCaltrainDevs/stops.txt').then(function(response) {
              if(response.ok) {
                response.text().then(function(myText) {
                    let lineArray = myText.split(/\n/);
                    var stops=[];
                    for(let i=1; i<lineArray.length; i++){
                        let wordArray = lineArray[i].split(',');
                        let stopObj = {};
                        if(wordArray[0].slice(0,2)==="77"){continue;}
                        if(stops.length===0 || wordArray[1].replace("CALTRAIN - ", "").replace(" STATION", "")!==stops[stops.length-1].displayName){
                            stopObj.displayName = wordArray[1].replace("CALTRAIN - ", "").replace(" STATION", "");
                            stopObj.preId = wordArray[0].slice(0,-1);
                            stops.push(stopObj);
                        } 
                    }
                    dispatch({ type: 'GOT_STOPS', stopsArray:stops });
                });
              } else {
                console.log('Network response was not ok.');
              }
            })
            .catch(function(error) {
              console.log('There has been a problem with your fetch operation: ' + error.message);
            });
        };
    }
};

export default stopsActions;
