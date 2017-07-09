/*
 *	AdminPage/model.js : 
 *		model for AdminPage
 *		model save data and transfer with server
 *
 *		SC PRODUCTION made by SangChul,Lee
 */

function Model(modelName) {
// private:
	var _modelName = modelName;	/* name of Model */
	var _initialString = ""		/* 서버에서 처음 받은 문자열 */

// privileged:
	this.getModelName = function() {
		return _modelName;
	};
	this.setInitialString = function(init) {
		_initialString = init;
	};
	this.getInitialString = function() {
		return _initialString;
	};
// public:
	this.series = [];		/* data 객체 순서 배열 */
	this.data = {};			/* data 객체 */

	this.deletedData = [];	/* 삭제된 data */
	this.addedData = [];	/* 추가된 data */
	this.modifiedFrom = [];	/* 수정되기 전 data */
	this.modifiedTo = [];	/* 수정된 후 data */
};

/*
 *	Model prototype function
 *
 *		- model connect with server
 *		getServerData(additionalSendVariables, viewFunc) - 구현 완료
 *		setServerData(additionalSendVariables, viewFunc) - 구현 완료
 *		
 *		- model use saved data
 *		getData() - 구현 완료
 *		addData() - 구현 완료
 *		delData() - 구현 완료
 *		resetData() - 구현 완료
 *		checkData() - 구현 완료
 */

// getServerData : get Data from Server
Model.prototype.getServerData = function(/*object*/additionalSendVariables, /*function*/viewFunc) {
	var series = this.series;
	var data = this.data;
	var modelName = this.getModelName();
	var setInitialString = this.setInitialString;
	var viewFunc = viewFunc || function(){};
	var additionalSendVariables = additionalSendVariables || {};
	var each;
	
	var ajaxReq = ajaxRequest({
			requestName: modelName,
			method: "GET",
			url: "jsps/get" + modelName + ".jsp",
			sendVariables: {},
			responseAction: function(res) {
				var responseArray = res.responseText.split(",");
				var seriesNum = parseInt(responseArray[0]);
				
				/* clear all save data */
				series.splice(0, series.length);
				for(each in data) {
					delete data[each];
				}
				
				/* save data from server */
				setInitialString(res.responseText);
				for(var i=1; i <= seriesNum; ++i) {
					series.push(responseArray[i].replace(/^\n*/, "").replace(/\n*$/, ""));
					data[responseArray[i].replace(/^\n*/, "").replace(/\n*$/, "")] = [];
				}
				responseArray = responseArray.slice(seriesNum+1);
				for(i=0; i < responseArray.length; ++i) {
					data[series[i%seriesNum]].push(responseArray[i].replace(/^\n*/, "").replace(/\n*$/, ""));
				}
				
				viewFunc();
			}});
	ajaxReq(additionalSendVariables);
};

// setServerData : set Data to Server
Model.prototype.setServerData = function(/*object*/additionalSendVariables, /*function*/viewFunc) {
	var series = this.series;
	var data = this.data;
	var modelName = this.getModelName();
	var viewFunc = viewFunc || function(){};
	var additionalSendVariables = additionalSendVariables || {};

	var deletedData = this.deletedData;
	var addedData = this.addedData;
	var modifiedFrom = this.modifiedFrom;
	var modifiedTo = this.modifiedTo;

	var ajaxReq = ajaxRequest({
			requestName: modelName,
			method: "POST",
			url: "jsps/set" + modelName + ".jsp",
			sendVariables : {series: series.join(),
							 deletedData: deletedData.join(),
							 addedData: addedData.join(),
							 modifiedFrom: modifiedFrom.join(),
							 modifiedTo: modifiedTo.join()},
			responseAction: function() {
				viewFunc();
				/* clear change data */
				deletedData.splice(0, deletedData.length);
				addedData.splice(0, addedData.length);
				modifiedFrom.splice(0, modifiedFrom.length);
				modifiedTo.splice(0, modifiedTo.length);
			}});
	ajaxReq(additionalSendVariables);
};

// resetData : reset Data from initial Server response
Model.prototype.resetData = function() {
	var series = this.series;
	var data = this.data;
	var init = this.getInitialString();
	var responseArray = init.split(",");
	var seriesNum = parseInt(responseArray[0]);
	var each, i;

	var deletedData = this.deletedData;
	var addedData = this.addedData;
	var modifiedFrom = this.modifiedFrom;
	var modifiedTo = this.modifiedTo;
	
	/* clear data, series and modifiedDatas*/
	series.splice(0, series.length);
	deletedData.splice(0, deletedData.length);
	addedData.splice(0, addedData.length);
	modifiedFrom.splice(0, modifiedFrom.length);
	modifiedTo.splice(0, modifiedTo.length);
	for(each in data) {
		delete data[each];
	}

	for(i=1; i <= seriesNum; ++i) {
		series.push(responseArray[i].replace(/^\n*/, "").replace(/\n*$/, ""));
		data[responseArray[i].replace(/^\n*/, "").replace(/\n*$/, "")] = [];
	}
	responseArray = responseArray.slice(seriesNum+1);
	for(i=0; i < responseArray.length; ++i) {
		data[series[i%seriesNum]].push(responseArray[i].replace(/^\n*/, "").replace(/\n*$/, ""));
	}
};

// checkData : check their is corresponding data
Model.prototype.checkData = function(/*object*/input) {
	var data = this.data;
	var series = this.series;
	var length = data[series[0]].length;
	
	out:
	for(var i=0; i < length; ++i) {
		for(var each in input) {
			if(input[each] !== data[each][i]) {
				continue out;
			}
		}
		return true;
	}
	return false;
};

// getData : getData from Model
Model.prototype.getData = function(/*number or string*/select) {
	var series = this.series;
	var data = this.data;

	if(select === undefined) {
		return data;
	}
	else if(typeof select === "number") {
		if(select > -1 && select < series.length) {
			return data[series[select]];
		}
		else {
			return data;
		}
	}
	else if(typeof select === "string") {
		return data[select];
	}
};

// addData : add Data to Model
Model.prototype.addData = function(/*object*/input, /*number*/index) {
	var data = this.data;
	var series = this.series;
	var addedData = this.addedData;
	var i, each;

	/* check input */
	for(i=0; i < series.length; ++i) {
		if(!input[series[i]]) {
			return false;
		}
	}

	/* save data */
	for(each in input) {
		if(index === undefined) {
			data[each].push(input[each]);
		}
		else {
			data[each].splice(index, 0, input[each]);
		}
		addedData.push(input[each]);
	}
	return true;
};

// delData : delete Data from Model
Model.prototype.delData = function(/*object or number*/input) {
	var data = this.data;
	var series = this.series;
	var length = data[series[0]].length;
	var deletedData = this.deletedData;
	var i, j, each;

	if(typeof input === "object") {
		out:
		for(i=0; i < length; ++i) {
			for(each in input) {
				if(input[each] !== data[each][i]) {
					continue out;
				}
			}
			for(j=0; j < series.length; ++j) {
				deletedData.push( data[series[j]].splice(i, 1) );
			}
		}
		return false;
	}
	else if(typeof input === "number") {
		if(input >= length || input < 0)
			return false;
		for(j=0; j < series.length; ++j) {
			deletedData.push( data[series[j]].splice(input, 1) );
		}
	}
	else {
		log("Model.delData need object or number argument! this model name : "
			+this.getModelName());
		return false;
	}
	return true;
};

// modifyData : modify Data from Model
Model.prototype.modifyData = function(/*object*/from, /*object*/to) {
	var data = this.data;
	var series = this.series;
	var modifiedFrom = this.modifiedFrom;
	var modifiedTo = this.modifiedTo;
	var length = data[series[0]].length;
	var each, i;
	var index;

	/* check input */
	for(i=0; i < series.length; ++i) {
		if( !(from[series[i]] && to[series[i]]) ) {
			return false;
		}
	}

	/* check from == to */
	for(i=0; i < series.length; ++i) {
		if(from[series[i]] !== to[series[i]]) {
			break;
		}
		return false;
	}
	
	for(i=0; i < series.length; ++i) {
		modifiedFrom.push(from[series[i]]);
	}
	for(i=0; i < series.length; ++i) {
		modifiedTo.push(to[series[i]]);
	}

	out:
	for(i=0; i < length; ++i) {
		for(each in from) {
			if(from[each] !== data[each][i]) {
				continue out;
			}
		}
		index = i;
	}

	for(each in to) {
		data[each][index] = to[each];
	}

	return true;
};