/*
 * EnteranceSystem.js :
 * 이 javascript는 EnteranceSystem.html을 동적으로 만들기 위함 입니다.
 * 
 *		-> getCheckerByDate.jsp 요청
 *		-> getCheckerByWrokplace.jsp 요청
 *		-> getWorkplace.jsp 요청
 *		-> setCheckerByDate.jsp 요청
 *
 *		SC PRODUCTION made by SangChul,Lee and JongMin,Seok
 */

window.onload = initPage;

var requestForWorkplaceList = null;
var requestForChecker = null;

var checkedDate = new Date();

function initPage() {
	getUserInfo();
	displayCalender();
	$("prevMonthButton").onclick = function() {
		var changedDate = new Date(checkedDate.getFullYear(), (checkedDate.getMonth()-1));
		displayCalender(changedDate);
		if(displayWorkplaceList.clickedTD != null)
			getCheckerByWorkplace(displayWorkplaceList.clickedTD.className, changedDate);
	}
	$("nextMonthButton").onclick = function() {
		var changedDate = new Date(checkedDate.getFullYear(), (checkedDate.getMonth()+1));
		displayCalender(changedDate);
		if(displayWorkplaceList.clickedTD != null)
			getCheckerByWorkplace(displayWorkplaceList.clickedTD.className, changedDate);
	}
	getWorkplaceList();
	imgRollover();
	$("display").style.background = "url(../image/select.jpg) no-repeat top";
	$("display").style.backgroundPositionY = "100px";
}
/***********************************************************************************************/
displayCalender.clickedTD = null;
function displayCalender(date) {
	if(date == null)
		date = new Date();
	checkedDate = date;
	$("cal_content").innerHTML = makeCalender(date.getFullYear(), date.getMonth());
	$("month").innerHTML = checkedDate.getFullYear() + "/" + (date.getMonth()+1);
	var tds = $("cal_content").getElementsByTagName("td");
	for(var i=0; i < tds.length; i++) {
		if(tds[i].innerHTML != "") {
			tds[i].onmouseover = function() {
				if(displayCalender.clickedTD != this)
					this.style.backgroundColor = "#fcc";
			}
			tds[i].onmouseout = function() {
				if(displayCalender.clickedTD != this)
					this.style.backgroundColor = "";
			}
			tds[i].onclick = function() {
				var date  = new Date(checkedDate.getFullYear(), checkedDate.getMonth(), parseInt(this.innerHTML));
				checkedDate = date;
				getCheckerByDate(date);
				if(displayCalender.clickedTD != null)
					displayCalender.clickedTD.style.backgroundColor = "";
				displayCalender.clickedTD = this;
				this.style.backgroundColor = "#faa";
				if(displayWorkplaceList.clickedTD != null) {
					displayWorkplaceList.clickedTD.style.backgroundColor = "";
					displayWorkplaceList.clickedTD = null;
				}
				$("display").style.background = "";
			}
		}
	}
}
makeCalender.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function makeCalender(year, month) {
	var calString = "<table><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>";
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
	for(var i=0; i < end; i++) {
		if(i == 0)
			calString += "<tr>";
		else if(i%7 == 0)
			calString += "</tr><tr>"

		if(i < date.getDay()) {
			calString += "<td></td>";
		}
		else if(i < date.getDay()+makeCalender.monthsDays[month]) {
			calString += "<td>" + (i - date.getDay()+1) + "</td>";
		}
		else
			calString += "<td></td>";
	}
	return calString += "</tr></table>";
}
/***********************************************************************************************/
//	get checker by date
function getCheckerByDate(date) {
	displayLoading(true);
	requestForChecker = createRequest();
	if(requestForChecker==null) {
		alert("Unable to create request!");
	}
	var url = "getCheckerByDate.jsp?year=" + date.getFullYear() + "&month=" + (date.getMonth()+1) + "&date=" + date.getDate()+"&random="+Math.random();
	requestForChecker.open("GET", url, true);
	requestForChecker.onreadystatechange = displayDisplayByDate;
	requestForChecker.send(null);
}
function displayDisplayByDate() {
	if(requestForChecker.readyState == 4) {
		if(requestForChecker.status == 200) {
			alertError(requestForChecker.responseText);
			displayLoading(false);
			$("display").innerHTML = "<table>" + requestForChecker.responseText + "</table>";
			imgRollover();
			var imgTags = $("display").getElementsByTagName("img");
			for(var i=0; i < imgTags.length; i++) {
				imgTags[i].onclick = function() {
					var sosokcode = this.parentNode.className.substring(0, 4);
					var workplacecode = $("display").getElementsByTagName("tr")[this.parentNode.parentNode.rowIndex-1].getElementsByTagName("td")[0].className.substring(0, 4);
					setCheckerByDate(workplacecode, sosokcode, checkedDate);
				}
			}
		}
	}
}
/***********************************************************************************************/
//	get checker by workplace
function getCheckerByWorkplace(workplace, date) {
	displayLoading(true);
	requestForChecker = createRequest();
	if(requestForChecker==null) {
		alert("Unable to create request!");
	}
	var url = "getCheckerByWorkplace.jsp?year=" + date.getFullYear() + "&month=" + (date.getMonth()+1) + "&workplace=" + workplace+"&random="+Math.random();
	requestForChecker.open("GET", url, true);
	requestForChecker.onreadystatechange = displayDisplayByWorkplace;
	requestForChecker.send(null);
}
function displayDisplayByWorkplace() {
	if(requestForChecker.readyState == 4) {
		if(requestForChecker.status == 200) {
			alertError(requestForChecker.responseText);
			displayLoading(false);
			$("display").innerHTML = "<table>" + requestForChecker.responseText + "</table>";
			//if(requestForChecker.responseText.indexOf("undefined") != -1) {
				imgRollover();
				var imgTags = $("display").getElementsByTagName("img");
				log(imgTags);
				for(var i=0; i < imgTags.length; i++) {
					imgTags[i].onclick = function() {
						var sosokcode = this.parentNode.className.substring(0, 4);
						var workplacecode = displayWorkplaceList.clickedTD.className;
						var changeDate = new Date($("display").getElementsByTagName("tr")[this.parentNode.parentNode.rowIndex-1].getElementsByTagName("td")[0].innerHTML);
						setCheckerByDate(workplacecode, sosokcode, changeDate);
					}
				}
			//}
		}
	}
}
/***********************************************************************************************/
//	set checker by date
function setCheckerByDate(workplacecode, sosokcode, date) {
	displayLoading(true);
	requestForChecker = createRequest();
	if(requestForChecker==null) {
		alert("Unable to create request!");
	}
	var url = "setCheckerByDate.jsp?workplace="+workplacecode+"&sosok="+sosokcode+"&year="+date.getFullYear()+"&month="+(date.getMonth()+1)+"&date="+date.getDate();
	requestForChecker.open("GET", url, true);
	requestForChecker.onreadystatechange = debugdisplay;
	requestForChecker.send(null);
}
function debugdisplay() {
	if(requestForChecker.readyState == 4) {
		if(requestForChecker.status == 200) {
			alertError(requestForChecker.responseText);
			if(displayWorkplaceList.clickedTD == null)
				getCheckerByDate(checkedDate);
			else
				getCheckerByWorkplace(displayWorkplaceList.clickedTD.className, checkedDate);
		}
	}
}
/***********************************************************************************************/
//	get workplace list
function getWorkplaceList() {
	displayLoading(true);
	requestForWorkplaceList = createRequest();
	if(requestForWorkplaceList==null) {
		alert("Unable to create request!");
	}
	var url = "getWorkplace.jsp";
	requestForWorkplaceList.open("GET", url, true);
	requestForWorkplaceList.onreadystatechange = displayWorkplaceList;
	requestForWorkplaceList.send(null);
}
displayWorkplaceList.clickedTD = null;
function displayWorkplaceList() {
	if(requestForWorkplaceList.readyState == 4) {
		if(requestForWorkplaceList.status == 200) {
			alertError(requestForWorkplaceList.responseText);
			displayLoading(false);
			$("workplaceList").innerHTML = requestForWorkplaceList.responseText;
			var tds = $("workplaceList").getElementsByTagName("td");
			for(var i=0; i < tds.length; i++) {
				tds[i].onmouseover = function() {
					if(displayWorkplaceList.clickedTD != this)
						this.style.backgroundColor = "#adf";
				}
				tds[i].onmouseout = function() {
					if(displayWorkplaceList.clickedTD != this)
						this.style.backgroundColor = "";
				}
				tds[i].onclick = function() {
					//	근무지 선택시 작동
					if(displayWorkplaceList.clickedTD != null)
						displayWorkplaceList.clickedTD.style.backgroundColor = "";
					displayWorkplaceList.clickedTD = this;
					this.style.backgroundColor = "#adf";
					getCheckerByWorkplace(this.className, checkedDate);
					if(displayCalender.clickedTD != null) {
						displayCalender.clickedTD.style.backgroundColor = "";
						displayCalender.clickedTD = null;
					}
					$("display").style.background = "";
				}
			}
		}
	}
}
function displayLoading(load) {
	if(load)
		$("shadow").style.zIndex = "4";	else
		$("shadow").style.zIndex = "-1";
}
var getUserInfo = ajaxRequest({
		requestName: "UserInfo",
		method: "GET",
		url: "../getUserInfo.jsp",
		sendVariables: {need: true},
		responseAction: function(req) {
			var response = req.responseText;
			if(!(response.indexOf("null") > 0)) {
				$("authority").innerHTML = response.substring(0, response.lastIndexOf("\n")) + " 권한";
				$("userInfo").innerHTML = response.substring(response.lastIndexOf('\n'), response.length) + "님, 환영합니다!";
			}
			else {
				$("authority").innerHTML = "권한이 없습니다";
				$("userInfo").innerHTML = "로그인 후 이용해주세요!";
			}
		}});