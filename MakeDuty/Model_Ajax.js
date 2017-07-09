/**
 *	Model_Ajax.js -- Model for Ajax (MakeDuty page)
 *
 *	READ ONLY
 *
 */

var MakeDuty;
if(!MakeDuty) MakeDuty = {};
if(!MakeDuty.Model) MakeDuty.Model = {};
MakeDuty.Model.Ajax = {};

(function() {
	var ajax = MakeDuty.Model.Ajax;

	ajax.getUserInfo = {
		requestName: "UserInfo",
		method: "GET",
		url: "../getUserInfo.jsp",
		sendVariables: {need: false},
		responseAction: function(req) {
			$("#userInfo").innerHTML = ( (req.responseText.indexOf("null") > 0) ? "로그인 후 이용해주세요!" : req.responseText + "님, 환영합니다!" );
		}};
	ajax.getAutoComplete = {
		requestName: "AutoComplete",
		method: "GET",
		url: "../getAutoComplete.jsp",
		sendVariables: {},
		responseAction: function(req) {
			control.displayAutoComplete(req);
		}};
	ajax.getWorker = {
		requestName: "WorkerList",
		method: "GET",
		url: "getWorker.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			$("#WorkerList").innerHTML = "<table><tbody>"+req.responseText.replace(/null/g, '-')+"</tbody></table>";
		}};
	ajax.setWorker = {
		requestName: "WorkerList",
		method: "POST",
		url: "setWorker.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			control.getWorker();
		}};
	ajax.getDuty = {
		requestName: "DutyList",
		method: "GET",
		url: "getDuty.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value',
						year: 'eval$("#date_year").value',
						month: 'eval$("#date_month").value'},
		responseAction: function(req) {
			control.displayDutyList(req);
		}};
	ajax.setDuty = {
		requestName: "DutyList",
		method: "POST",
		url: "setDuty.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			control.getDuty();
		}};
	ajax.getWorkplaceList = {
		requestName: "WorkplaceList",
		method: "GET",
		url: "getWorkplace.jsp",
		sendVariables: {},
		responseAction: function(req) {
			control.displayWorkplaceList(req);
		}};
	ajax.setSeries = {
		requestName: "Series",
		method: "POST",
		url: "setSeries.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value'},
		responseAction: function(req) {
			setting = true;
			$("#setting").onclick();
			control.getSeries();
		}};
	ajax.getSeries = {
		requestName: "Series",
		method: "GET",
		url: "getSeries.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value'},
		responseAction: function(req) {
			control.displaySeriesList(req);
		}};
})();