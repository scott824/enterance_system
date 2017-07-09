/*
 * MakeDuty.js :
 * 이 javascript는 MakeDuty.html을 동적으로 만들기 위함 입니다.
 * 
 *		-> getWorkplace.jsp 요청
 *		-> getWorker.jsp 요청
 *		-> setWorker.jsp 요청
 *		-> getDuty.jsp 요청
 *		-> setDuty.jsp 요청
 *		-> getSeries.jsp 요청
 *		-> setSeries.jsp 요청
 *		-> getAutoComplete.jsp 요청
 *
 *		SC PRODUCTION made by SangChul,Lee
 */

(function() {
/***********************************************************************************************/
//	global variable

//	수정 버튼 클릭여부
var modify_WorkerList = false;
var modify_DutyList = false;

//	선택된 객체
var selectWorker = {
	changingTr: null,
	workerNum: 0
};
//	오늘 날짜
var date = new Date();

// auto complete key focus
var autoFocus = 0;

//	병사 여부
var isByung = false;

//	setting page click
var setting = false;
var modify_setting = false;

//	initiate Page
function initPage() {
	//	오른클릭 방지
	/*document.body.oncontextmenu = function() {
		return false;
	}*/
	//	드래그 방지
	$("#List1").ondragstart = function() { return false; }
	$("#List1").onselectstart = function() { return false; }

	getUserInfo();
	getWorkplaceList();

	$("#date_year").selectedIndex = date.getFullYear()-2015;
	$("#date_month").selectedIndex = date.getMonth();
	$("#date_year").onchange = function() { getDuty(); }
	$("#date_month").onchange = function() { getDuty(); }

	$("#autoComplete").innerHTML = "";
	//	WorkerList modify button
	$("#modify_WorkerList").onclick = initWorkerListModifyButton;
	$("#modify_DutyList").onclick = function() {
		var today = new Date();
		if( (($("#date_year").value.toString() + $("#date_month").value.toString())-0) >= (today.getFullYear().toString() + (today.getMonth()+1).toString()-0) ) {
			initDutyListModifyButton();
		}
		else
			alert("지난 월은 수정 불가합니다!");
	}
	//$("#input_excel").onclick = makeExcel;
	
	imgRollover();
}

//	DutyList modify button
function initDutyListModifyButton() {
	if(!modify_DutyList) {
		//	수정버튼 클릭
		$("#modify_DutyList").value = "저장";
		$("#modify_DutyList").src = "../image/button_save.jpg";
		modify_DutyList = true;
		
		// make shadow
		$("#modifyShadow").style.zIndex = "1";
		$("#List2_all").style.zIndex = "2";
		$("#colName_shadow").style.zIndex = "3";
		$("#List2_all").style.boxShadow = "5px 5px 5px #888";
		$("#plus_DutyList").innerHTML = "<img id='cancel_DutyList' type='image' src='../image/button_cancel.jpg' value='취소' />";

		$("#cancel_DutyList").onclick = function() {
			$("#modify_DutyList").value = "수정";
			$("#modify_DutyList").src = "../image/button_edit.jpg";
			modify_DutyList = false;
			// delete shadow
			$("#modifyShadow").style.zIndex = "-1";
			$("#List2_all").style.zIndex = "0";
			$("#List2_all").style.boxShadow = "";
			$("#colName_shadow").style.zIndex = "-1";
			$("#plus_DutyList").innerHTML = "";
			getDuty();
		}

		//var DutyListNum = $("#DutyList").getElementsByClassName("num");
		var DutyListNum = new Array();
		var DutyTDs = $("#DutyList").getElementsByTagName("td");
		for(var i=0; i < DutyTDs.length; i++) {
			if(i%5 == 2)
				DutyListNum.push(DutyTDs[i]);
		}
		for(var i=0; i < DutyListNum.length; i++) {
			var tmp = DutyListNum[i].innerHTML;
			DutyListNum[i].innerHTML = "<input type='text' value='"+tmp+"' />";
		}
		var inputTags = $("#DutyList").getElementsByTagName("input");
		$("#DutyList").getElementsByTagName("input")[0].focus();
		for(var i=0; i < inputTags.length; i++) {
			inputTags[i].index = i;
			inputTags[i].onkeydown = function(event) {
				//var code = (window.event ? event.keyCode : event.which);
				var code = window.event.keyCode;
				/* key codes
				 *
				 * up : 38
				 * down : 40
				 * enter: 13
				 *
				 */
				if (code == 40 || code == 13) {
					$("#DutyList").getElementsByTagName("input")[this.index+1].focus();
				}
				else if(code == 38) {
					$("#DutyList").getElementsByTagName("input")[this.index-1].focus();
				}
			}
			inputTags[i].onblur = function() {
				var tds = $("#WorkerList").getElementsByTagName("td");
				var tdsInRow = this.parentNode.parentNode.getElementsByTagName("td");
				var workerlist = new Array();
				for(var i=0; i < tds.length; workerlist[i] = tds[i++].innerHTML);

				if(((this.value - 0) > 0) && ((this.value - 0) <= workerlist.length/6)) {
					var name = workerlist[(this.value-1)*6 + 3];
					var gunbun = workerlist[(this.value-1)*6 + 5];
					//log(tdsInRow[3].innerHTML + name + gunbun);
					tdsInRow[3].innerHTML = gunbun;
					tdsInRow[4].innerHTML = name;
				}
				else {
					this.value = "";
					tdsInRow[3].innerHTML = "";
					tdsInRow[4].innerHTML = "";
				}
			}
		}
		imgRollover();
	}
	else {
		//	저장버튼 클릭
		displayLoading(true);
		var inputTags = $("#DutyList").getElementsByTagName("input");
		for(var i=0; i < inputTags.length; i++) {
			inputTags[i].onblur();
		}
		var tds = $("#DutyList").getElementsByTagName("td");
		var dutylist = new Array();
		for(var i=0; i < tds.length; i++) {
			if(i%5 == 2)
				dutylist[i] = tds[i].getElementsByTagName("input")[0].value.replace(/^\n*/, "").replace(/\n*$/, "").replace(/\s/gi, "");
			else if(i%5 == 4) {
			}
			else
				dutylist[i] = tds[i].innerHTML.replace(/^\n*/, "").replace(/\n*$/, "").replace(/\s/gi, "");
		}
		dutylist[tds.length] = "end";
		setDuty({dutylist: dutylist.join()});

		$("#modify_DutyList").value = "수정";
		$("#modify_DutyList").src = "../image/button_edit.jpg";
		modify_DutyList = false;
		
		// delete shadow
		$("#List2_all").style.zIndex = "0";
		$("#colName_shadow").style.zIndex = "-1";
		$("#List2_all").style.boxShadow = "";
		$("#plus_DutyList").innerHTML = "";
		$("#modifyShadow").style.zIndex = "-1";
	}
}

//	WorkerList modify button
function initWorkerListModifyButton() {
	if(!modify_WorkerList) {
		//	수정버튼 클릭
		//var WorkerListName = $("#WorkerList").getElementsByClassName("name");
		var WorkerListName = new Array();
		var WorkerTDs = $("#WorkerList").getElementsByTagName("td");
		for(var i=0; i < WorkerTDs.length; i++) {
			if(i%6 == 3)
				WorkerListName.push(WorkerTDs[i]);
		}
		selectWorker.numWorker = WorkerListName.length;
		for(var i=0; i < WorkerListName.length; i++) {
			var tmp = WorkerListName[i].innerHTML;
			WorkerListName[i].innerHTML = "<input type='text' value='"+tmp+"' />";
		}
		giveInputTagAutoComplete()
		$("#modify_WorkerList").value = "저장";
		$("#modify_WorkerList").src = "../image/button_save.jpg";
		modify_WorkerList = true;
		
		// make shadow
		$("#modifyShadow").style.zIndex = "1";
		$("#List1_all").style.zIndex = "2";
		$("#autoComplete").style.zIndex = "3";
		$("#List1").style.boxShadow = "5px 5px 5px #888";

		//	make plus button
		$("#plus_WorkerList").innerHTML = "<img id='cancel_WorkerList' type='image' src='../image/button_cancel.jpg' value='취소' /><img id='add_WorkerList' type='image' src='../image/button_add.jpg' value='+' />";
		$("#add_WorkerList").onclick = function() {
			var tmp = $("#WorkerList").innerHTML;
			if(tmp.lastIndexOf("</tr>") == -1 && tmp.lastIndexOf("</TR>") == -1)
				tmp = "<table>";
			else if(tmp.lastIndexOf("</tr>") == -1)
				tmp = tmp.substring(0, tmp.lastIndexOf("</TR>")+5);
			else
				tmp = tmp.substring(0, tmp.lastIndexOf("</tr>")+5);
			$("#WorkerList").innerHTML = tmp + "<tr><td class='num numTD'>"+(++selectWorker.numWorker)+"</td><td class='member'></td><td class='rank'></td><td class='name'><input type='text' value='' /></td><td class='other'><div style='float: right;'><img class='sub_WorkerList' type='image' src='../image/button_del.png' value='-' /></div></td><td class='gunbun'></td></tr></table>";
			giveInputTagAutoComplete();
			subInputButton();
			imgRollover();
			giveMoveingToTR();
		}
		$("#cancel_WorkerList").onclick = function() {
			$("#modify_WorkerList").value = "수정";
			$("#modify_WorkerList").src = "../image/button_edit.jpg";
			modify_WorkerList = false;
			// delete shadow
			$("#modifyShadow").style.zIndex = "-1";
			$("#List1_all").style.zIndex = "0";
			$("#autoComplete").style.zIndex = "0";
			$("#List1").style.boxShadow = "";
			//	delete plus button
			$("#plus_WorkerList").innerHTML = "";
			$("#autoComplete").innerHTML = "";
			getWorker();
		}
		//var WorkerListOther = $("#WorkerList").getElementsByClassName("other");
		var WorkerListOther = new Array();
		var WorkerTDs = $("#WorkerList").getElementsByTagName("td");
		for(var i=0; i < WorkerTDs.length; i++) {
			if(i%6 == 4)
				WorkerListOther.push(WorkerTDs[i]);
		}
		for(var i=0; i < WorkerListOther.length; i++) {
			var tmp = WorkerListOther[i].innerHTML;
			WorkerListOther[i].innerHTML = tmp + "<div style='float: right;'><img class='sub_WorkerList' type='image' src='../image/button_del.png' value='-'></div>";
		}
		subInputButton();
		giveMoveingToTR();

		//$("#WorkerList").getElementsByTagName("input")[0].focus();
		imgRollover();
	} else {
		//	저장버튼 클릭
		displayLoading(true);
		var tds = $("#WorkerList").getElementsByTagName("td");
		var workerlist = new Array();
		for(var i=0; i < tds.length; i++) {
			if(i%6 == 3)
				workerlist[i] = tds[i].getElementsByTagName("input")[0].value;
			else if(i%6 == 4)
				workerlist[i] = tds[i].innerHTML.substring(0, tds[i].innerHTML.indexOf("<div"));
			else
				workerlist[i] = tds[i].innerHTML;
		}
		workerlist[tds.length] = "end";
		setWorker({workerlist: workerlist.join()});

		$("#modify_WorkerList").value = "수정";
		$("#modify_WorkerList").src = "../image/button_edit.jpg";
		modify_WorkerList = false;
		
		// delete shadow
		$("#modifyShadow").style.zIndex = "-1";
		$("#List1_all").style.zIndex = "0";
		$("#autoComplete").style.zIndex = "0";
		$("#List1").style.boxShadow = "";

		//	delete plus button
		$("#plus_WorkerList").innerHTML = "";
	}
}
function giveMoveingToTR() {
	// moving TR
	var WorkerTRs = $("#WorkerList").getElementsByTagName("tr");
	for(var i=0; i < WorkerTRs.length; i++) {
		WorkerTRs[i].onmousedown = movingTR;
		WorkerTRs[i].getElementsByTagName("td")[3].onmousedown = null;
	}
}

//	moving TRs
function movingTR() {
	if(this.getElementsByTagName("img")[0].src.indexOf("_rollover") > 0) {
		this.getElementsByTagName("img")[0].onclick();
		return;
	}
	var startY = window.event.clientY;
	var origY = this.offsetTop;
	var WorkerList = $("#WorkerList");
	var trs = WorkerList.getElementsByTagName("tr");
	//console.log(trs);
	var offsets = (function() {
		var array = [];
		for(var i=0; i < trs.length; i++) {
			array.push(trs[i].offsetTop);
		}
		return array;
	})();
	var indexOfTR = (function() {
		for(var i=0; i < offsets.length; i++) {
			if(offsets[i] == origY)
				return i;
		}
	})();
	//alert(offsets);
	//offsets.map(function(each){return each+15;});
	//alert(offsets);
	var oldMousemove = document.onmousemove;
	var oldMouseup = document.onmouseup;
	
	WorkerList.innerHTML += "<div id='movingTR'></div>";
	setDOMStyle( $("#movingTR"), {
		position: "absolute",
		backgroundColor: "#cec",
		zIndex: "4",
		top: origY+"px"
		}
	);

	$("#movingTR").innerHTML = "<table><tr>" + trs[indexOfTR].innerHTML + "</tr></table>";
	WorkerList.getElementsByTagName("table")[0].deleteRow(indexOfTR);
	WorkerList.getElementsByTagName("table")[0].insertRow(indexOfTR).insertCell().className = "num numTD";
	//console.log(indexOfTR);
	var before = indexOfTR;
	function moveHandler() {
		$("#movingTR").style.top = (window.event.clientY - (startY - origY))+"px";
		for(var i=0; i < offsets.length; i++) {
			if(($("#movingTR").offsetTop+15) > offsets[i] && ($("#movingTR").offsetTop+15) < offsets[i+1]) {
				if(before != i) {
					WorkerList.getElementsByTagName("table")[0].deleteRow(before);
					WorkerList.getElementsByTagName("table")[0].insertRow(i).insertCell().className = "num numTD";
					before = i;
					break;
				}
			}
			//console.log($("#movingTR").offsetTop + " " + offsets[offsets.length-1]);
			if($("#movingTR").offsetTop+15 > offsets[offsets.length-1]){
				if(before != offsets.length) {
					//console.log(before);
					WorkerList.getElementsByTagName("table")[0].deleteRow(before);
					WorkerList.getElementsByTagName("table")[0].insertRow(offsets.length-1).insertCell().className = "num numTD";
					before = offsets.length-1;
					break;
				}
			}
		}
	}
	function upHandler() {
		var tds = $("#movingTR").getElementsByTagName("td");
		//console.log(tds);
		WorkerList.getElementsByTagName("table")[0].deleteRow(before);
		var row = WorkerList.getElementsByTagName("table")[0].insertRow(before);
		//console.log(row);
		var td = row.insertCell(0);
		td.className = "num numTD";
		td.innerHTML = tds[0].innerHTML;
		td = row.insertCell(1);
		td.className = "member";
		td.innerHTML = tds[1].innerHTML;
		td = row.insertCell(2);
		td.className = "rank";
		td.innerHTML = tds[2].innerHTML;
		td = row.insertCell(3);
		td.className = "name";
		td.innerHTML = tds[3].innerHTML;
		td = row.insertCell(4);
		td.className = "other";
		td.innerHTML = tds[4].innerHTML;
		td = row.insertCell(5);
		td.className = "gunbun";
		td.innerHTML = tds[5].innerHTML;
		$("#movingTR").innerHTML = "";
		$("#movingTR").style.zIndex = "-1";
		document.onmouseup = oldMouseup;
		document.onmousemove = oldMousemove;
		var nums = new Array();
		var numTDs = $("#WorkerList").getElementsByTagName("td");
		for(var i=0; i < numTDs.length; i++) {
			if(i%6 == 0)
				nums.push(numTDs[i]);
		}
		for(var i=0; i < nums.length; i++) {
			nums[i].innerHTML = i+1;
		}
		row.getElementsByTagName("input")[0].focus();
		giveInputTagAutoComplete();
		giveMoveingToTR();
		subInputButton();
		imgRollover();
	}
	document.onmousemove = moveHandler;
	document.onmouseup = upHandler;
}
function giveInputTagAutoComplete() {
	var inputTags = $("#WorkerList").getElementsByTagName("input");
	for(var i=0; i < inputTags.length; i++) {
		inputTags[i].onchange = function() {
			selectWorker.changingTr = this.parentNode.parentNode;
			getAutoComplete({name: this.value, isByung: isByung});
		}
		//	자동완성에서 키보드 조작 기능 부분
		inputTags[i].onkeydown = function(event) {
			var trs = $("#autoComplete").getElementsByTagName("tr");
			//var code = (window.event ? event.keyCode : event.which);
			var code = window.event.keyCode;
			/*if (code == 40) {
				// down key
				if($("#autoComplete").innerHTML.indexOf("<tr>") != -1) {
					trs[autoFocus++].style.backgroundColor = "";
					trs[autoFocus].style.backgroundColor = "#eaa";
				}
			}
			else if(code == 38) {
				//	up key
				if($("#autoComplete").innerHTML.indexOf("<tr>") != -1) {
					trs[autoFocus--].style.backgroundColor = "";
					trs[autoFocus].style.backgroundColor = "#eaa";
				}
			}*/
			if(code == 13) {
				//	enter key
				this.onchange();
				this.blur();
				this.focus();
				/*if($("#autoComplete").innerHTML.indexOf("<tr>") != -1) {
					trs[autoFocus].onclick();
				}*/
			}
		}
	}
}
function subInputButton() {
	var inputs = $("#WorkerList").getElementsByTagName("img");
	for(var i=0; i < inputs.length; i++) {
		inputs[i].style.zIndex = "10";
		inputs[i].onclick = function() {
			var num = this.parentNode.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
			this.parentNode.parentNode.parentNode.parentNode.deleteRow(num-1);
			var nums = new Array();
			var numTDs = $("#WorkerList").getElementsByTagName("td");
			for(var i=0; i < numTDs.length; i++) {
				if(i%6 == 0)
					nums.push(numTDs[i]);
			}
			for(var i=0; i < nums.length; i++) {
				nums[i].innerHTML = i+1;
			}
			selectWorker.numWorker--;
		}
	}
}
function displayAutoComplete(req) {
	$("#autoComplete").innerHTML = "<table>"+req.responseText+"</table>";
	var trs = $("#autoComplete").getElementsByTagName("tr");
	for(var i=0; i < trs.length; i++) {
		var tr = trs[i];
		trs[i].trIndex = i;
		tr.onmouseover = function() {
			this.style.backgroundColor = "#aea";
		}
		tr.onmouseout = function() {
			//if(this.trIndex != autoFocus)
				this.style.backgroundColor = "";
			//else
				//this.style.backgroundColor = "eaa";
		}
		tr.onclick = function() {
			var tds = this.getElementsByTagName("td");
			selectWorker.changingTr.getElementsByTagName("td")[1].innerHTML = tds[1].innerHTML.replace(/^\n*/, "").replace(/\n*$/, "");
			selectWorker.changingTr.getElementsByTagName("td")[2].innerHTML = tds[2].innerHTML.replace(/^\n*/, "").replace(/\n*$/, "");
			selectWorker.changingTr.getElementsByTagName("td")[3].innerHTML = "<input type='text' value="+tds[3].innerHTML.replace(/^\n*/, "").replace(/\n*$/, "")+">";
			selectWorker.changingTr.getElementsByTagName("td")[3].getElementsByTagName("input")[0].onchange = function() {
				selectWorker.changingTr = this.parentNode.parentNode;
				getAutoComplete({name: this.value, isByung: isByung});
			}
			selectWorker.changingTr.getElementsByTagName("td")[5].innerHTML = tds[0].innerHTML.replace(/^\n*/, "").replace(/\n*$/, "");
			$("#autoComplete").innerHTML = "";
			autoFocus = 0;
			giveMoveingToTR();
			//$("#WorkerList").getElementsByTagName("input")[(this.trIndex)*2].focus();
		}
	}
	//trs[autoFocus].style.backgroundColor = "#eaa";
}
displayDutyList.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
displayDutyList.days = ["일", "월", "화", "수", "목", "금", "토"];
function displayDutyList(req) {
	if(req.responseText.indexOf("<tr") > 0)
		$("#DutyList").innerHTML = "<table><tbody>"+req.responseText+"</tbody></table>";
	else {
		$("#DutyList").innerHTML  = "no Table";
		var year = $("#date_year").value;
		var month = $("#date_month").value;
		var tmp = "";
		if(month == 2) {
			if(year%4 == 0 && (year%100 != 0 || year%400 == 0))
				displayDutyList.monthsDays[1] = 29;
			else
				displayDutyList.monthsDays[1] = 28;
		}
		var num = seriesArray[seriesArray.indexOf($("#series").value) + 1];
		for(var i=0; i < displayDutyList.monthsDays[month-1]; i++) {
			/*******************************************************/
			if(num == 1) {
				var date = new Date(year, month-1, i+1);
				if(date.getDay() == 0 || date.getDay() == 6)
					tmp += "<tr style='background-color: #fff2f2;'>\n";
				else if(date.getDay() == 5)
					tmp += "<tr style='background-color: #fffff2;'>\n";
				else
					tmp += "<tr>\n";
				if(i+1 < 10)
					tmp += "<td class='date'>" + year + "/" + month + "/0" + (i+1) + "</td>\n";
				else
					tmp += "<td class='date'>" + year + "/" + month + "/" + (i+1) + "</td>\n";
				tmp += "<td class='day'>" + displayDutyList.days[date.getDay()] + "</td>\n";
				tmp += "<td class='num'></td>\n";
				tmp += "<td class='gunbun'></td>\n";
				tmp += "<td class='name'></td>\n";
				tmp += "</tr>\n";
			} else if(num == 2) {
				var date = new Date(year, month-1, i+1);
				if(date.getDay() == 0 || date.getDay() == 6)
					tmp += "<tr style='background-color: #fff2f2; border-bottom: 2px solid #fff2f2;'>\n";
				else if(date.getDay() == 5)
					tmp += "<tr style='background-color: #fffff2; border-bottom: 2px solid #fffff2;'>\n";
				else
					tmp += "<tr style='border-bottom: 2px solid white;'>\n";
				if(i+1 < 10)
					tmp += "<td class='date'>" + year + "/" + month + "/0" + (i+1) + "</td>\n";
				else
					tmp += "<td class='date'>" + year + "/" + month + "/" + (i+1) + "</td>\n";
				tmp += "<td class='day'>" + displayDutyList.days[date.getDay()] + "</td>\n";
				tmp += "<td class='num'></td>\n";
				tmp += "<td class='gunbun'></td>\n";
				tmp += "<td class='name'></td>\n";
				tmp += "</tr>\n";
				if(date.getDay() == 0 || date.getDay() == 6)
					tmp += "<tr style='background-color: #fff2f2; border-top: 2px solid #fff2f2;'>\n";
				else if(date.getDay() == 5)
					tmp += "<tr style='background-color: #fffff2; border-top: 2px solid #fffff2;'>\n";
				else
					tmp += "<tr style='border-top: 2px solid white;'>\n";
				if(i+1 < 10)
					tmp += "<td class='date' style='visibility: hidden'>" + year + "/" + month + "/0" + (i+1) + "</td>\n";
				else
					tmp += "<td class='date' style='visibility: hidden'>" + year + "/" + month + "/" + (i+1) + "</td>\n";
				tmp += "<td class='day' style='visibility: hidden'>" + displayDutyList.days[date.getDay()] + "</td>\n";
				tmp += "<td class='num'></td>\n";
				tmp += "<td class='gunbun'></td>\n";
				tmp += "<td class='name'></td>\n";
				tmp += "</tr>\n";
			}
			/*******************************************************/
		}
		$("#DutyList").innerHTML = "<table><tbody>" + tmp + "</tbody></table>";
		tmp = "";
	}
}
function displayWorkplaceList(req) {
	var workplace = [];
	var workplacecode = [];
	var arr = req.responseText.split(",");
	arr.splice(0, 1);
	for(var i=0; i < arr.length; ++i) {
		(i%2 == 0 ? workplace.push(arr[i]) : workplacecode.push(arr[i]));
	}

	$("select_in_head").innerHTML = workplace[0];
	$("workplace").value = workplacecode[0];
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
			for(var i=0; i < workplace.length; i++) {
				if(i%4 == 0)
					tmp += "<tr>";
				tmp += "<td>" + workplace[i] + "</td>";
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
					$("workplace").value = workplacecode[workplace.indexOf(this.innerHTML)];
					$("select_in_head").innerHTML = this.innerHTML;
					$("select_in_head").onclick();
					getSeries();
				}
			}
		}
	};
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

	getSeries();
	$("#setting").onclick = function() {
		modify_setting = false;
		if(!setting) {
			setting = true;
			getSeries({workplace: "all"});
			$("#setting_div").style.display = "block";
			$("#setting_div").style.border = "2px solid black";
			$("#setting_div").style.width = "700px";
			$("#setting_div").style.height = "600px";
			$("#setting_div").style.backgroundColor = "white";
			var tmp = "<div id='setting_button'><img id='modify_series' type='image' src='../image/button_edit.jpg' value='수정' /></div>";
			tmp += "<table id='setting_table'><tr><th>순서</th><th>종류</th><th>인원수</th><th>병사여부</th></tr>";
			for(var i=0; i < seriesArray.length/4; i++) {
				tmp += "<tr>";
				tmp += ("<td>" + (i+1) + "</td>");
				tmp += ("<td>" + seriesArray[i*4+3] + "</td>");
				tmp += ("<td>" + seriesArray[i*4+1] + "</td>");
				tmp += ("<td>" + seriesArray[i*4+2] + "</td>");
				tmp += "</tr>";
			}
			tmp = tmp + "</table>";
			//	주의사항부분
			tmp += "<div id='setting_caution'><span id='setting_caution_title'>주의사항!</span><br><br>";
			tmp += "1. 순서 1번은 출입통제시스템에서 사용되는 무기고관리체계에 입력되는 명단입니다.<br>&nbsp&nbsp&nbsp신중하게 선택해주시기 바랍니다.<br><br>";
			tmp += "2. 병사여부를 올바로 선택하셔야 자동완성때 간부or병사가 올바로 검색됩니다.<br><br>";
			tmp += "3. 인원수는 최대 2명까지 선택가능합니다.</div>";
			$("#setting_div").innerHTML = tmp;

			$("#modify_series").onclick = modify_series;
		}
		else {
			$("#setting_div").style.display = "none";
			$("#setting_div").innerHTML = "";
			setting = false;
		}
		imgRollover();
	}
}
function modify_series() {
	if(!modify_setting) {
		$("#modify_series").src = "../image/button_save.jpg";
		$("#setting_button").innerHTML += "<img id='cancel_series' type='image' src='../image/button_cancel.jpg' value='취소' /><img id='add_series' type='image' src='../image/button_add.jpg' value='+' />";
		var tds = $("#setting_table").getElementsByTagName("td");
		for(var i=0; i < tds.length; i++) {
			if(i%4 == 2) {
				if(tds[i].innerHTML == 1)
					tds[i].innerHTML = "<select><option value='1' selected>1</option><option value='2'>2</option></select>";
				else if(tds[i].innerHTML == 2)
					tds[i].innerHTML = "<select><option value='1'>1</option><option value='2' selected>2</option></select>";
			}
			else if(i%4 == 3) {
				if(tds[i].innerHTML == "true")
					tds[i].innerHTML = "<select><option value='true' selected>true</option><option value='false'>false</option></select>";
				else if(tds[i].innerHTML == "false")
					tds[i].innerHTML = "<select><option value='true'>true</option><option value='false' selected>false</option></select>";
			}
			else if(i%4 == 1) {
				var tmp_in = "<select>";
				for(var j=0; j < allSeriesArray.length/2; j++) {
					if(tds[i].innerHTML == allSeriesArray[j*2])
						tmp_in += ("<option value='" + allSeriesArray[j*2+1] + "' selected>" + allSeriesArray[j*2] + "</option>");
					else
						tmp_in += ("<option value='" + allSeriesArray[j*2+1] + "'>" + allSeriesArray[j*2] + "</option>");
				}
				tmp_in += "</select>";
				tds[i].innerHTML = tmp_in;
			}
			else if(i%4 == 0) {
				tds[i].innerHTML = "<img class='sub_Series' type='image' src='../image/button_del.png' value='-' /><span>" + tds[i].innerHTML + "</span>";
			}
		}
		var sub_Series = $("#setting_table").getElementsByTagName("img");
		for(var i=0; i < sub_Series.length; i++) {
			sub_Series[i].onclick = function() {
				$("#setting_table").deleteRow(this.parentNode.getElementsByTagName("span")[0].innerHTML);
				var tds = $("#setting_table").getElementsByTagName("td");
				for(var j=0; j < tds.length; j++) {
					if(j%4 == 0)
						tds[j].getElementsByTagName("span")[0].innerHTML = j/4 + 1;
				}
			}
		}
		$("#cancel_series").onclick = function() {
			setting = false;
			$("#setting").onclick();
		}
		$("#add_series").onclick = function() {
			var trs = $("#setting_table").getElementsByTagName("tr");
			var newRow = $("#setting_table").insertRow(trs.length);
			var tmp_in = "<select>";
			for(var j=0; j < allSeriesArray.length/2; j++) {
				tmp_in += ("<option value='" + allSeriesArray[j*2+1] + "'>" + allSeriesArray[j*2] + "</option>");
			}
			tmp_in += "</select>";
			newRow.insertCell(0).innerHTML = "<select><option value='true'>true</option><option value='false' selected>false</option></select>";
			newRow.insertCell(0).innerHTML = "<select><option value='1' selected>1</option><option value='2'>2</option></select>";
			newRow.insertCell(0).innerHTML = tmp_in;
			newRow.insertCell(0).innerHTML = "<img class='sub_Series' type='image' src='../image/button_del.png' value='-' /><span>" + (trs.length-1) + "</span>";
			var sub_Series = $("#setting_table").getElementsByTagName("img");
			for(var i=0; i < sub_Series.length; i++) {
				sub_Series[i].onclick = function() {
					$("#setting_table").deleteRow(this.parentNode.getElementsByTagName("span")[0].innerHTML);
					var tds = $("#setting_table").getElementsByTagName("td");
					for(var j=0; j < tds.length; j++) {
						if(j%4 == 0)
							tds[j].getElementsByTagName("span")[0].innerHTML = j/4 + 1;
					}
				}
			}
			imgRollover();
		}
		$("#modify_series").onclick = modify_series;
		imgRollover();
		modify_setting = true;
	}
	else {
		modify_setting = false;
		var tds = $("#setting_table").getElementsByTagName("td");
		var seriesList = [];
		for(var i=0; i < tds.length; i++) {
			if(i%4 == 0)
				seriesList[i] = tds[i].getElementsByTagName("span")[0].innerHTML;
			else
				seriesList[i] = tds[i].getElementsByTagName("select")[0].value
		}
		seriesList[tds.length] = "end";
		setSeries({serieslist: seriesList.join()});
	}
}
var seriesArray = null;
var allSeriesArray = null;
function displaySeriesList(req) {
	if(!setting) {
		$("#select_series").innerHTML = "<select name='series' id='series'>" + req.responseText.split(",")[0] + "</select>";
		seriesArray = req.responseText.split(",").slice(1);
		if(seriesArray[seriesArray.indexOf($("#series").value) + 2] == "true")
			isByung = true;
		else
			isByung = false;
		$("#series").onchange = function() {
			if(seriesArray[seriesArray.indexOf($("#series").value) + 2] == "true") {
				isByung = true;
			} else {
				isByung = false;
			}
			getWorker();
			getDuty();
		}
		//	List appear
		getWorker();
		getDuty();
	}
	else {
		allSeriesArray = req.responseText.split(",").slice(0, req.responseText.split(",").length-1);
	}
}
//	make excel
function makeExcel() {
	var workplace = $("#workplace").value;
	var date_year = $("#date_year").value;
	var date_month = $("#date_month").value;
	window.location = "lastexcel.jsp?workplace="+workplace+"&date_year="+date_year+"&date_month="+date_month+"&random="+Math.random();
}
//	display loading
function displayLoading(inOut) {
	if(inOut) {
		setDOMStyle($("#shadow"), {
			zIndex: "100",
			background: "url('../image/loading_s.png') no-repeat",
			backgroundPositionX: "545px",
			backgroundPositionY: "430px"});
	}
	else {
		setDOMStyle($("#shadow"), {
			zIndex: "-1",
			background: "",
			backgroundColor: "#ccc"});
	}
}
//	make ajax request
var getUserInfo = ajaxRequest({
		requestName: "UserInfo",
		method: "GET",
		url: "../getUserInfo.jsp",
		sendVariables: {need: false},
		responseAction: function(req) {
			$("#userInfo").innerHTML = ( (req.responseText.indexOf("null") > 0) ? "로그인 후 이용해주세요!" : req.responseText + "님, 환영합니다!" );
		}});
var getAutoComplete = ajaxRequest({
		requestName: "AutoComplete",
		method: "GET",
		url: "../getAutoComplete.jsp",
		sendVariables: {},
		responseAction: function(req) {
			displayAutoComplete(req);
		}});
var getWorker = ajaxRequest({
		requestName: "WorkerList",
		method: "GET",
		url: "getWorker.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			$("#WorkerList").innerHTML = "<table><tbody>"+req.responseText.replace(/null/g, '-')+"</tbody></table>";
		}});
var setWorker = ajaxRequest({
		requestName: "WorkerList",
		method: "POST",
		url: "setWorker.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			getWorker();
		}});
var getDuty = ajaxRequest({
		requestName: "DutyList",
		method: "GET",
		url: "getDuty.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value',
						year: 'eval$("#date_year").value',
						month: 'eval$("#date_month").value'},
		responseAction: function(req) {
			displayDutyList(req);
		}});
var setDuty = ajaxRequest({
		requestName: "DutyList",
		method: "POST",
		url: "setDuty.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value+$("#series").value'},
		responseAction: function(req) {
			getDuty();
		}});
var getWorkplaceList = ajaxRequest({
		requestName: "WorkplaceList",
		method: "GET",
		url: "getWorkplace.jsp",
		sendVariables: {},
		responseAction: function(req) {
			displayWorkplaceList(req);
		}});
var setSeries = ajaxRequest({
		requestName: "Series",
		method: "POST",
		url: "setSeries.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value'},
		responseAction: function(req) {
			setting = true;
			$("#setting").onclick();
			getSeries();
		}});
var getSeries = ajaxRequest({
		requestName: "Series",
		method: "GET",
		url: "getSeries.jsp",
		sendVariables: {workplace: 'eval$("#workplace").value'},
		responseAction: function(req) {
			displaySeriesList(req);
		}});
window.onload = initPage;
})();