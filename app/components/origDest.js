import React, { Component } from 'react';

import { connect } from 'react-redux';

import actions from '../actions';

import {} from 'react-bootstrap';

import 'whatwg-fetch';

class OrigDest extends Component {
    constructor() {
		super();
        this.state = { stops: [], 
                       displayArray: [],
                       price: '',
                       origName: '',
                       destName: '',
                       selectOrig: '',
                       selectDest: '',
                       warning: ''
                     };
	}
    
    componentWillMount() {
        this.setState({stops: this.createStops()}); 
    }
    
    createStops(){
        let stops=[];
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", "./GTFSCaltrainDevs/stops.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
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
                }
            }
        }
        rawFile.send(null);
        this.setState({
            selectOrig: stops[0].preId,
            selectDest: stops[0].preId
        });
        return stops;
    }

    sendInfo(e){
        //e.preventDefault();
        
        let localOrig=this.state.selectOrig;
        let localDest=this.state.selectDest;
        
        if(localOrig===localDest){
            this.setState({warning: 'stops can not be the same.'}); 
            return;
        }
        
         this.setState({warning: ''}); 
        
        let rawFile = new XMLHttpRequest();
        let resultArray=[];
        
        if(localOrig>localDest){
            localOrig=localOrig+'1';
            localDest=localDest+'1';
        }
        else{
            localOrig=localOrig+'2';
            localDest=localDest+'2';
        }
        console.log('localOrig='+localOrig);
        console.log('localDest='+localDest);
        
        let currenteDate = new Date("March 6, 2016 09:25:00");//"March 6, 2016 09:25:00"
        let currentHour = currenteDate.getHours();
        let currentMinutes = currenteDate.getMinutes();
        
        let available_service_id=[];
        let available_trip_id=[];
        
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
        ///trips.txt
        rawFile.open("GET", "./GTFSCaltrainDevs/trips.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
                    for(let i=1; i<lineArray.length; i++){
                        let wordArray = lineArray[i].split(',');
                        if(available_service_id.indexOf(wordArray[1])!==-1){
                            available_trip_id.push(wordArray[2]);    
                        }
                    }
                }
            }
        }
        rawFile.send(null);

        ///stop_times.txt
        rawFile.open("GET", "./GTFSCaltrainDevs/stop_times.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
                    
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
                }
            }
        }
        rawFile.send(null);
        console.log(resultArray);
        
        //stops.txt
        let origZone='';
        let destZone='';
        let origName='';
        let destName='';
        
        rawFile.open("GET", "./GTFSCaltrainDevs/stops.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
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
                }
            }
        }
        rawFile.send(null);
        console.log('origZone: '+origZone);
        console.log('destZone: '+destZone);
        
        //fare_rules.txt
        let fare_id='';
        
        rawFile.open("GET", "./GTFSCaltrainDevs/fare_rules.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
                    for(let i=1; i<lineArray.length; i++){
                        let wordArray = lineArray[i].split(',');
                        if(origZone===wordArray[2]&&destZone===wordArray[3]){
                            fare_id=wordArray[0];
                            break;
                        }
                    }
                }
            }
        }
        rawFile.send(null);
        console.log('fare_id: '+fare_id);
        //fare_attributes.txt
        let price='';
        
        rawFile.open("GET", "./GTFSCaltrainDevs/fare_attributes.txt", false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    let allText = rawFile.responseText;
                    let lineArray = allText.split(/\n/);
                    for(let i=1; i<lineArray.length; i++){
                        let wordArray = lineArray[i].split(',');
                        if(fare_id===wordArray[0]){
                            price=wordArray[1]+' '+wordArray[2];
                            break;
                        }
                    }
                }
            }
        }
        rawFile.send(null);
        console.log('price: '+price);
        this.setState({price: price});
        
        //displayArray
        let forDisplayArray=[];
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
            //tempObj.origName= origName;
            //tempObj.destName= destName;
            tempObj.duration= duration;
            //trips.txt
            rawFile.open("GET", "./GTFSCaltrainDevs/trips.txt", false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        let allText = rawFile.responseText;
                        let lineArray = allText.split(/\n/);
                        for(let i=1; i<lineArray.length; i++){
                            let wordArray = lineArray[i].split(',');
                            if(trip_id==wordArray[2]){
                                type=wordArray[0];
                                break;
                            }
                        }
                    }
                }
            }
            rawFile.send(null);
            ////
            tempObj.type= type;
            
            forDisplayArray.push(tempObj);
        }
        ////////
        forDisplayArray.sort(function(a, b) {
            if (a.orig_arr > b.orig_arr) {
                return 1;
            }
            else {
                return -1;
            }
        });
        
        
        this.setState({displayArray: forDisplayArray, origName:origName, destName:destName});  
    }
    
    handleChangeOrig(e){
        this.setState({selectOrig: e.target.value});
        if(e.target.value!==this.state.selectDest){
            this.setState({warning: ''}); 
        }
        else{
            this.setState({warning: 'stops can not be the same.'});    
        }
    }
    
    handleChangeDest(e){
        this.setState({selectDest: e.target.value});
        if(e.target.value!==this.state.selectOrig){
            this.setState({warning: ''}); 
        }
        else{
            this.setState({warning: 'stops can not be the same.'});    
        }
    }
    
    renderStops() {
        return this.state.stops.map((stop) => {
            return (
                <option key={stop.preId} value={stop.preId}>{stop.displayName}</option>
            );
        });
    }
    
    renderdisplayArray() {
        if(this.state.displayArray.length===0){
            return "no train found";
        }
        return this.state.displayArray.map((schedule) => {
            return (
                <div key={schedule.orig_arr} className="scheduleWrapper">
                    <div className="schedule">
                        <div className="arr">{schedule.orig_arr.slice(0,-3)}</div>
                        <div className="typeDuration">
                            <div className="type">{schedule.type}</div>
                            <div className="duration">{schedule.duration} &nbsp;min</div>
                        </div>
                        <div className="arr">{schedule.dest_arr.slice(0,-3)}</div> 
                    </div>
                </div>
            );
        });
    }
    
	render() {          
		return (
			<div>
                <div className="title">Caltrain Schedule</div>
                <div className="formWrapper">
                    <div className="selectWrapper">
                        <label htmlFor="from">
                            <div className="selectLabel">From:</div>
                            <select id="from" value={this.state.selectOrig} onChange={this.handleChangeOrig.bind(this)}>
                               {this.renderStops()}
                            </select>
                        </label>
                    </div>
                    <div className="selectWrapper">
                        <label htmlFor="to">
                            <div className="selectLabel">To:</div>
                            <select id="to" value={this.state.selectDest} onChange={this.handleChangeDest.bind(this)}>
                               {this.renderStops()}
                            </select>
                        </label>
                    </div>    
                    <div className="warningWrapper">{this.state.warning}</div>        
                    <button className="searchButton" type="button" onClick={this.sendInfo.bind(this)}>SEARCH</button>
                </div>
                <div className={this.state.price===""?"hide":"resultWrapper"}>
                    <div className="priceAndName">
                        <div className="name"> 
                            <div className="fromTo">FROM:</div>
                            <div>{this.state.origName}</div>
                        </div>
                        <div className="price">
                            {this.state.price}
                        </div>
                        <div className="name">
                            <div className="fromTo">TO:</div>
                            <div>{this.state.destName}</div>
                        </div>
                    </div>
                    <div className="displayArray">        
                        { this.renderdisplayArray()}
                    </div>        
                </div>    
			</div>
		);
	}
}

const mapStateToProps = (appState) => {
	return { 
    
    };
};

const mapDispatchToProps = (dispatch) => {
	return {
        findSchedule(data) {dispatch(actions.findSchedule(data))}  
	};
};

export default connect(null, null)(OrigDest);

