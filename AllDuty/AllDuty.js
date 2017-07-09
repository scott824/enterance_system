/*
 * AllDuty.js :
 * 이 javascript는 AllDuty.html을 동적으로 만들기 위함 입니다.
 * 
 *
 *		SC PRODUCTION made by SangChul,Lee and JongMin,Seok
 */

window.onload = initPage;
// Ajax 요청
var requestForWorkerList = null;
var requestForCalList = null;
var requestForSeries = null;

var response = null;
var Today = new Date();
var SelectedDay = new Date();
function initPage() {
	getUserInfo();
	getWorkplaceList();
	$("month").innerHTML = Today.getFullYear()+"년 "+(Today.getMonth()+1)+"월";
	$("prevMonthButton").onclick = function() {
		SelectedDay = new Date(SelectedDay.getFullYear(), (SelectedDay.getMonth()-1));
		$("month").innerHTML = SelectedDay.getFullYear()+"년 "+(SelectedDay.getMonth()+1)+"월";
		getCalList(SelectedDay);
	}
	$("nextMonthButton").onclick = function() {
		SelectedDay = new Date(SelectedDay.getFullYear(), (SelectedDay.getMonth()+1));
		$("month").innerHTML = SelectedDay.getFullYear()+"년 "+(SelectedDay.getMonth()+1)+"월";
		getCalList(SelectedDay);
	}
	imgRollover();
}
/***********************************************************************************************/
//	calender
makeCalender.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function makeCalender(year, month) {
	var calString = "<table><tr><th colspan=7><img src=../image/calender_bar.png></th></tr>";
	var date = new Date(year, month);
	if(month == 1) {
		if(year%4 == 0 && (year%100 != 0 || year%400 == 0))
			makeCalender.monthsDays[1] = 29;
		else
			makeCalender.monthsDays[1] = 28;
	}
	var end = date.getDay()+makeCalender.monthsDays[month];
	if(end%7 == 0)
		end = end;
	else
		end = end - end%7 + 7;

	var prev_month = new Date(year, month-1);
	var next_month = new Date(year, month+1);
	for(var i=0, j=1; i < end; i++) {
		var sunday = "background-color: #e1b4ac;";
		var saturday = "background-color: #79daf3;";
		var isWeekend = "";
		if(i%7 == 0)
			isWeekend = sunday;
		else if(i%7 == 6)
			isWeekend = saturday;
		if(i == 0)
			calString += "<tr>";
		else if(i%7 == 0)
			calString += "</tr><tr>"
		var tmpdate = "";

		function getDatePerson(tmpdate) {
			var printNum = 0;
			var num = [];
			var code = [];
			var worker = "";
			for(var i=0; i < seriesList.length; i++)
				if(i%4 == 2)
					num.push(parseInt(seriesList[i]));
			for(var i=0; i < seriesList.length; i++)
				if(i%4 == 1)
					code.push(seriesList[i]);
			for(var i=0; i < selectedList.length; i++) {
				if(selectedList[i] == true) {
					for(var j=0; j < response.length; j++) {
						if(response[j] == tmpdate) {
							if(printNum < num[i] && code[i] == response[j+1]) {
								worker += (response[j+2] + "<br>");
								printNum++;
							}
						}
					}
					printNum = 0;
				}
			}
			return worker;
		}

		if(i < date.getDay()) {
			tmpdate = prev_month.getFullYear()+"/"+makeTwoFigure(prev_month.getMonth()+1)+"/"+makeTwoFigure(makeCalender.monthsDays[prev_month.getMonth()] + i - date.getDay() + 1);
			worker = getDatePerson(tmpdate);
			calString += "<td style='color: #aaa; "+isWeekend+"'>"+(makeCalender.monthsDays[prev_month.getMonth()] + i - date.getDay() + 1)+"<br>"+worker+"</td>";
		}
		else if(i < date.getDay()+makeCalender.monthsDays[month]) {
			tmpdate = year+"/"+makeTwoFigure(month+1)+"/"+makeTwoFigure(i - date.getDay()+1);
			worker = getDatePerson(tmpdate);
			if(Today.getFullYear() == year && Today.getMonth() == month && Today.getDate() == (i - date.getDay()+1))
				calString += "<td style='background-color: #eec;'>";
			else
				calString += "<td style='"+isWeekend+"'>";
			calString += (i - date.getDay()+1) + "<br>"+worker+"</td>";
		}
		else {
			tmpdate = next_month.getFullYear()+"/"+makeTwoFigure(next_month.getMonth()+1)+"/"+makeTwoFigure(j);
			worker = getDatePerson(tmpdate);
			calString += "<td style='color: #aaa; "+isWeekend+"'>"+(j++)+"<br>"+worker+"</td>";
		}
	}
	return calString += "</tr></table>";
}
function makeTwoFigure(number) {
	if(number < 10)
		return "0" + number;
	else
		return number;
}
/***********************************************************************************************/
//	get workplace list
function getWorkplaceList() {
	requestForWorkplaceList = createRequest();
	if(requestForWorkplaceList==null) {
		alert("Unable to create request!");
	}
	var url = "getWorkplace.jsp";
	requestForWorkplaceList.open("GET", url, true);
	requestForWorkplaceList.onreadystatechange = displayWorkplaceList;
	requestForWorkplaceList.send(null);
}

var clickedList = [];
var workplaceList = [];
var workplacecodeList = [];
function displayWorkplaceList() {
	if(requestForWorkplaceList.readyState == 4) {
		if(requestForWorkplaceList.status == 200) {
			alertError(requestForWorkplaceList.responseText);
			var tmp = requestForWorkplaceList.responseText.split(",").slice(1);
			for(var i=0; i < tmp.length; i++) {
				if(i%2 == 0)
					workplacecodeList.push(tmp[i]);
				else
					workplaceList.push(tmp[i]);
			}
			$("select_in_head").innerHTML = workplaceList[0];
			$("workplace").value = workplacecodeList[workplaceList.indexOf($("select_in_head").innerHTML)];
			$("workplaceList").innerHTML = "";
			$("select_in_head").onclick = function() {
				if($("workplaceList").innerHTML) {
					this.style.background = "";
					$("workplaceList").innerHTML = "";
				}
				else {
					this.style.background = "url(../image/placeselect.png) no-repeat center";
					this.style.backgroundPositionY = "0px";
					$("workplaceList").style.boxShadow = "5px 5px 5px #888";
					var tmp = "<table>";
					for(var i=0; i < workplaceList.length; i++) {
						if(i%4 == 0)
							tmp += "<tr>";
						tmp += "<td>" + workplaceList[i] + "</td>";
						if(i%4 == 3)
							tmp += "</tr>";
					}
					tmp += "</tr></table>";
					$("workplaceList").innerHTML = tmp;
					var tds = $("workplaceList").getElementsByTagName("td");
					for(var i=0; i < tds.length; i++) {
						tds[i].style.cursor = "pointer";
						tds[i].onmouseover = function() {
							this.style.backgroundColor = "#fea";
						}
						tds[i].onmouseout = function() {
							this.style.backgroundColor = "";
						}
						tds[i].onclick = function() {
							$("workplace").value = workplacecodeList[workplaceList.indexOf(this.innerHTML)];
							$("select_in_head").innerHTML = this.innerHTML;
							$("select_in_head").onclick();
							getCalList(Today);
						}
					}
				}
			}
			$("select_in_head").onmouseover = function() {
				if(!$("workplaceList").innerHTML) {
					this.style.background = "url(../image/placeselect.png) no-repeat center";
					this.style.backgroundPositionY = "0px";
				}
			}
			$("select_in_head").onmouseout = function() {
				if(!$("workplaceList").innerHTML) {
					this.style.background = "";
				}
			}
			getCalList(Today);
		}
	}
}
/***********************************************************************************************/
//	get Series list
function getSereisList() {
	requestForSeries = createRequest();
	if(requestForSeries==null) {
		alert("Unable to create request!");
	}
	var url = "getSeries.jsp?workplace="+$("workplace").value+"&random="+Math.random();
	requestForSeries.open("GET", url, true);
	requestForSeries.onreadystatechange = displaySereisList;
	requestForSeries.send(null);
}
var seriesList = [];
var selectedList = null;
function displaySereisList() {
	if(requestForSeries.readyState == 4) {
		if(requestForSeries.status == 200) {
			alertError(requestForSeries.responseText);
			seriesList = requestForSeries.responseText.split(",").slice(1);
			$("displayWho").innerHTML = "";
			for(var i=0; i < seriesList.length; i++) {
				if(i%4 == 0)
					$("displayWho").innerHTML += "<div><span>"+ seriesList[i] +"</span><img src='../image/check.jpg' value='check' /></div>";
			}
			selectedList = Array(seriesList.length/4);
			for(var i=0; i < selectedList.length; i++) {
				selectedList[i] = false;
			}
			var divs = $("displayWho").getElementsByTagName("div");
			for(var i=0; i < divs.length; i++) {
				divs[i].onmouseover = function() {
					if(this.getElementsByTagName("img")[0].src.indexOf("selected") <= 0)
						this.getElementsByTagName("img")[0].src = "../image/check_rollover.jpg";
				}
				divs[i].onmouseout = function() {
					if(this.getElementsByTagName("img")[0].src.indexOf("selected") <= 0)
						this.getElementsByTagName("img")[0].src = "../image/check.jpg";
				}
				divs[i].onclick = function() {
					if(this.getElementsByTagName("img")[0].src.indexOf("selected") > 0) {
						this.getElementsByTagName("img")[0].src = "../image/check.jpg";
						selectedList[seriesList.indexOf(this.getElementsByTagName("span")[0].innerHTML)/4] = false;
					}
					else {
						this.getElementsByTagName("img")[0].src = "../image/check_selected.jpg";
						selectedList[seriesList.indexOf(this.getElementsByTagName("span")[0].innerHTML)/4] = true;
					}
					$("calender").innerHTML = makeCalender(SelectedDay.getFullYear(), SelectedDay.getMonth());
				}
			}
			divs[0].onclick();
			$("calender").innerHTML = makeCalender(SelectedDay.getFullYear(), SelectedDay.getMonth());
		}
	}
}
/***********************************************************************************************/
//	get cal list
function getCalList(date) {
	displayLoading(true);
	requestForCalList = createRequest();
	if(requestForCalList==null) {
		alert("Unable to create request!");
	}
	var url = "getCalByWorkplace.jsp?year=" + date.getFullYear() + "&month=" + (date.getMonth()+1) + "&workplacecode=" + $("workplace").value +"&random="+Math.random();
	requestForCalList.open("GET", url, true);
	requestForCalList.onreadystatechange = displayCalList;
	requestForCalList.send(null);
}
function displayCalList() {
	if(requestForCalList.readyState == 4) {
		if(requestForCalList.status == 200) {
			alertError(requestForCalList.responseText);
			response = requestForCalList.responseText.split("%").slice(1);
			//$("content").innerHTML += (requestForCalList.responseText);
			displayLoading(false);
			getSereisList();
		}
	}
}
function displayLoading(display) {
	if(display)
		$("shadow").style.zIndex = "3";
	else
		$("shadow").style.zIndex = "-1";
}
var getUserInfo = ajaxRequest({
		requestName: "UserInfo",
		method: "GET",
		url: "../getUserInfo.jsp",
		sendVariables: {need: false},
		responseAction: function(req) {
			$("#userInfo").innerHTML = ( (req.responseText.indexOf("null") > 0) ? "로그인 후 이용해주세요!" : req.responseText + "님, 환영합니다!" );
		}});