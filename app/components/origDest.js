import React, { Component } from 'react';

import { connect } from 'react-redux';

import actions from '../actions';

import 'whatwg-fetch';

class OrigDest extends Component {
    constructor() {
		super();
        this.state = { warning: '',
                       localOrig:'7002',
                       localDest:'7002'
                     };
	}
    
    componentWillMount() {
        this.props.findStops();    
    }

    sendInfo(e){
        //e.preventDefault();
        let localOrig=this.state.localOrig;
        let localDest=this.state.localDest;
        
        if(localOrig===localDest){
            this.setState({warning: 'stops can not be the same.'}); 
            return;
        }
        this.setState({warning: ''});         
        this.props.findSchedule(localOrig,localDest);
    }
    
    handleChangeOrig(e){
        if(e.target.value!==this.props.stops.selectDest){
            this.setState({warning: '', localOrig:e.target.value});
        }
        else{
            this.setState({warning: 'stops can not be the same.', localOrig:e.target.value});    
        }
    }
    
    handleChangeDest(e){
        if(e.target.value!==this.state.selectOrig){
            this.setState({warning: '', localDest:e.target.value}); 
        }
        else{
            this.setState({warning: 'stops can not be the same.', localDest:e.target.value});    
        }
    }
    
    renderStops() {
        return this.props.stops.stopsArray.map((stop) => {
            return(
                <option key={stop.preId} value={stop.preId}>{stop.displayName}</option>
            );
        });
    }
    
    renderdisplayArray() {
        if(!this.props.schedule.searchfinished){
            return "";    
        }
        if(this.props.schedule.displayArray.length===0){
            return "no train found";
        }
        return this.props.schedule.displayArray.map((schedule) => {
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
                            <select id="from"  onChange={this.handleChangeOrig.bind(this)}>
                               {this.renderStops()}
                            </select>
                        </label>
                    </div>
                    <div className="selectWrapper">
                        <label htmlFor="to">
                            <div className="selectLabel">To:</div>
                            <select id="to"  onChange={this.handleChangeDest.bind(this)}>
                               {this.renderStops()}
                            </select>
                        </label>
                    </div>  

                    <div className="warningWrapper">{this.state.warning}</div>        
                    <button className="searchButton" type="button" onClick={this.sendInfo.bind(this)}>SEARCH</button>
                </div>
                <div className={this.props.schedule.price===""?"hide":"resultWrapper"}>
                    <div className="priceAndName">
                        <div className="name"> 
                            <div className="fromTo">FROM:</div>
                            <div>{this.props.schedule.origName}</div>
                        </div>
                        <div className="price">
                            {this.props.schedule.price}
                        </div>
                        <div className="name">
                            <div className="fromTo">TO:</div>
                            <div>{this.props.schedule.destName}</div>
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
        stops: appState.stops,
        schedule: appState.schedule
    };
};

const mapDispatchToProps = (dispatch) => {
	return {
        findSchedule(localOrig,localDest) {dispatch(actions.findSchedule(localOrig,localDest))},
        findStops() {dispatch(actions.findStops())}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrigDest);

