const scheduleActions = {    
    findSchedule(localOrig,localDest){
        if(localOrig>localDest){
            localOrig=localOrig+'1';
            localDest=localDest+'1';
        }
        else{
            localOrig=localOrig+'2';
            localDest=localDest+'2';
        }
        
        return (dispatch) => {
            fetch('./GTFSCaltrainDevs/trips.txt').then(function(response) {
              if(response.ok) {
                response.text().then(function(myText) {
                    let lineArray = myText.split(/\n/);
                    //////////
                    let currenteDate = new Date("March 6, 2016 09:25:00");//"March 6, 2016 09:25:00"
                    let currentHour = currenteDate.getHours();
                    let currentMinutes = currenteDate.getMinutes();

                    let available_service_id=[];


                    if(currenteDate.getDay()===0){
                        available_service_id.push('4951');    
                    }
                    else if(currenteDate.getDay()===6){
                        available_service_id.push('4930');
                        available_service_id.push('4951');
                    }
                    else{
                        available_service_id.push('4929');
                    }
                    
                    let available_trip_id=[];
                    for(let i=1; i<lineArray.length; i++){
                        let wordArray = lineArray[i].split(',');
                        if(available_service_id.indexOf(wordArray[1])!==-1){
                            available_trip_id.push(wordArray[2]);    
                        }
                    }
                    //////////////////////////////////////////////////////////////////////////////////
                    fetch('./GTFSCaltrainDevs/stop_times.txt').then(function(response) {
                      if(response.ok) {
                        response.text().then(function(myText) {
                            let lineArray = myText.split(/\n/);

                            let resultArray=[];
                            
                            let tempOrigString='';

                            for(let i=1; i<lineArray.length; i++){
                                let wordArray = lineArray[i].split(',');

                                let arrival_timeArray= wordArray[1].split(':');
                                let arrivelHour=parseInt(arrival_timeArray[0]);
                                let arrivelMinutes=parseInt(arrival_timeArray[1]);

                                if(available_trip_id.indexOf(wordArray[0])===-1){
                                    continue;    
                                } 

                                if(((arrivelHour>currentHour&&arrivelHour<=currentHour+5)||(arrivelHour==currentHour&&arrivelMinutes>=currentMinutes))||
                                  (currentHour>=19&&currentHour<=23&&arrivelHour>=0&&arrivelHour<4)){
                                    if(localOrig===wordArray[3]){
                                        tempOrigString=lineArray[i];
                                    }
                                }
                                if(localDest===wordArray[3]){
                                    if(wordArray[0]===tempOrigString.split(',')[0]){
                                        let tempObj={};
                                        tempObj.orig=tempOrigString;
                                        tempObj.dest=lineArray[i];
                                        resultArray.push(tempObj); 
                                        tempOrigString="";
                                    }
                                }  

                            }
                            //////////////////////////////////////////////////////////////////////////////////
                            fetch('./GTFSCaltrainDevs/stops.txt').then(function(response) {
                              if(response.ok) {
                                response.text().then(function(myText) {
                                    let lineArray = myText.split(/\n/);
                                    
                                    let origZone='';
                                    let destZone='';
                                    let origName='';
                                    let destName='';
                                    
                                    for(let i=1; i<lineArray.length; i++){
                                        let wordArray = lineArray[i].split(',');
                                        if(wordArray[0]===localOrig){
                                            origZone= wordArray[4].slice(0,-1);
                                            origName= wordArray[1].replace("CALTRAIN - ", "").replace(" STATION", "");
                                        } 
                                        if(wordArray[0]===localDest){
                                            destZone= wordArray[4].slice(0,-1);
                                            destName= wordArray[1].replace("CALTRAIN - ", "").replace(" STATION", "");
                                        }  
                                    }
                                    /////////////////////////////////////////////////////////////////////////////
                                    fetch('./GTFSCaltrainDevs/fare_rules.txt').then(function(response) {
                                      if(response.ok) {
                                        response.text().then(function(myText) {
                                            let lineArray = myText.split(/\n/);
                                            let fare_id;
                                            for(let i=1; i<lineArray.length; i++){
                                                let wordArray = lineArray[i].split(',');
                                                if(origZone===wordArray[2]&&destZone===wordArray[3]){
                                                    fare_id=wordArray[0];
                                                    break;
                                                }
                                            }
                                            ///////////////////////////////////////////////////
                                            fetch('./GTFSCaltrainDevs/fare_attributes.txt').then(function(response) {
                                              if(response.ok) {
                                                response.text().then(function(myText) {
                                                    let lineArray = myText.split(/\n/);
                                                    let price;
                                                    for(let i=1; i<lineArray.length; i++){
                                                        let wordArray = lineArray[i].split(',');
                                                        if(fare_id===wordArray[0]){
                                                            price=wordArray[1]+' '+wordArray[2];
                                                            break;
                                                        }
                                                    }
//////////////////////////////////////////////////////
fetch('./GTFSCaltrainDevs/trips.txt').then(function(response) {
  if(response.ok) {
    response.text().then(function(myText) {
        let displayArray=[];
        
        for(let i=0; i<resultArray.length; i++){
            let trip_id= resultArray[i].orig.split(',')[0];
            let orig_arrArray= resultArray[i].orig.split(',')[1].split(':');
            let dest_arrArray= resultArray[i].dest.split(',')[1].split(':');
            let orig_arrToNum= parseInt(orig_arrArray[0])*60+parseInt(orig_arrArray[1]);
            let dest_arrToNum;
            if(parseInt(orig_arrArray[0])>=18 && parseInt(dest_arrArray[0])<10){
                dest_arrToNum= (24+parseInt(dest_arrArray[0]))*60+parseInt(dest_arrArray[1]);   
            }
            else{
                dest_arrToNum= parseInt(dest_arrArray[0])*60+parseInt(dest_arrArray[1]);    
            }
            let duration= dest_arrToNum-orig_arrToNum;
            let type;
            let tempObj={};
            tempObj.orig_arr= resultArray[i].orig.split(',')[1];
            tempObj.dest_arr= resultArray[i].dest.split(',')[1];
            tempObj.duration= duration;
            let lineArray = myText.split(/\n/);
            for(let i=1; i<lineArray.length; i++){
                let wordArray = lineArray[i].split(',');
                if(trip_id==wordArray[2]){
                    type=wordArray[0];
                    break;
                }
            }
            tempObj.type= type;
            displayArray.push(tempObj);
        }
        
        displayArray.sort(function(a, b) {
            if (a.orig_arr > b.orig_arr) {
                return 1;
            }
            else {
                return -1;
            }
        });
        console.log(displayArray);
        dispatch({ type: 'FINISHED_SEARCH', 
                   displayArray:displayArray ,
                   origName:origName,
                   destName:destName,
                   price:price
                 });
    });
  } else {
    console.log('Network response was not ok.');
  }
})
.catch(function(error) {
  console.log('There has been a problem with your fetch operation: ' + error.message);
});
//////////////////////////////////////////////////////
                                                });
                                              } else {
                                                console.log('Network response was not ok.');
                                              }
                                            })
                                            .catch(function(error) {
                                              console.log('There has been a problem with your fetch operation: ' + error.message);
                                            });
                                            ////////////////////////////////////////////////////
                                        });
                                      } else {
                                        console.log('Network response was not ok.');
                                      }
                                    })
                                    .catch(function(error) {
                                      console.log('There has been a problem with your fetch operation: ' + error.message);
                                    });
                                    /////////////////////////////////////////////////////////////////////////////
                                });
                              } else {
                                console.log('Network response was not ok.');
                              }
                            })
                            .catch(function(error) {
                              console.log('There has been a problem with your fetch operation: ' + error.message);
                            });
                            //////////////////////////////////////////////////////////////////////////////////
                        });
                      } else {
                        console.log('Network response was not ok.');
                      }
                    })
                    .catch(function(error) {
                      console.log('There has been a problem with your fetch operation: ' + error.message);
                    });
                    //////////////////////////////////////////////////////////////////////////////////
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

export default scheduleActions;

