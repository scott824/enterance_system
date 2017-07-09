/*
 *	AdminPage/control.js : 
 *		Control Class for AdminPage
 *		
 *
 *		SC PRODUCTION made by SangChul,Lee
 */

window.onload = function() {
	getUserInfo();
};

var init = function() {
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//		view, model, order
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
// body
	var body = {};
	body.view = new View( document.body );

// extraWindow
	var extraWindow = {};
	extraWindow.view = new View( $("extra_window") );

// autoComplete
	var autoComplete = {};
	autoComplete.view = new View( $("autocomplete") );
	autoComplete.model = new Model("AutoComplete");
	
	/* start argument : name, top, left, nextFunction */
	autoComplete.get = new Order(autoComplete.model, autoComplete.view);				/* 완료 */

// workplace
	var workplace = {};
	workplace.model = new Model("Workplace");

// sosok
	var sosok = {};
	sosok.model = new Model("Sosok");

	sosok.get = new Order(sosok.model, autoComplete.view);								/* 완료 */

// orderCert
	var orderCert = {};
	orderCert.view = new View( $("left_body") );
	orderCert.model = new Model("OrderCert");

	orderCert.refreshTable = new Order(orderCert.model, orderCert.view);				/* 완료 */
	orderCert.modifyTable = new Order(orderCert.model, orderCert.view);					/* 완료 */
	orderCert.add = new Order(workplace.model, extraWindow.view);						/* 완료 */

// tree
	var tree = {};
	tree.view = new View( $("mid_body") );
	tree.model = new Model("Tree");

	tree.refreshTable = new Order(tree.model, tree.view);								/* 완료 */
	tree.modifyTable = new Order(tree.model, tree.view);								/* 완료 */

// enteranceCert
	var enteranceCert = {};
	enteranceCert.view = new View( $("right_body") );
	enteranceCert.model = new Model("EnteranceCert");

	enteranceCert.refreshTable = new Order(enteranceCert.model, enteranceCert.view);	/* 완료 */
	enteranceCert.modifyTable = new Order(enteranceCert.model, enteranceCert.view);		/* 완료 */
	enteranceCert.add = new Order(sosok.model, extraWindow.view);						/* 완료 */

// admin
	var admin = {};
	admin.model = new Model("Admin");

	admin.add = new Order(admin.model, extraWindow.view);								/* 완료 */

// series
	var series = {};
	series.model = new Model("Series");

	series.add = new Order(series.model, extraWindow.view);								/* 완료 */


////////////////////////////////////////////////////////////////////////////////////////////////////////
//ORDER
//	autocomplete :
//		getAutoComplete - 1, 2, 3, 4
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 1 : get Data from server */
	var getAutoCompleteFunc1 = function(model, view, order, argu) {
		var name = argu[0];
		var top = argu[1];
		var left = argu[2];
		order.modifyNextFunc = argu[3];
		
		view.DOM.style.top = top;
		view.DOM.style.left = left;
		model.getServerData({name: name, isByung: false}, order.next);
	};

	/* 2 : display data to view */
	var getAutoCompleteFunc2 = function(model, view, order) {
		view.DOM.innerHTML = view.makePlainTable([model.getData(0), 
												  model.getData(2), 
												  model.getData(3), 
												  model.getData(4)]);
		order.next();
	};

	/* 2_tree : display data to view for tree */
	var getAutoCompleteFunc2_tree = function(model, view, order) {
		view.DOM.innerHTML = view.makePlainTable([model.getData(0)]);
		view.DOM.style.width = "115px";
		order.next();
	};

	/* 3 : bind event to autocomplete table */
	var getAutoCompleteFunc3 = function(model, view, order) {
		var trs = view.DOM.getElementsByTagName("tr");	/* autocomplete TRs */
		var i;
		for(i=0; i < trs.length; ++i) {
			trs[i].onmouseover = function() {
				this.style.backgroundColor = "#aea";
				this.style.cursor = "pointer";
			};
			trs[i].onmouseout = function() {
				this.style.backgroundColor = "";
			};
			trs[i].onclick = function() {
				order.nextXCount(this);
			};
		}
	};
	
	/* 4 : return autocomplete data to next function */
	var getAutoCompleteFunc4 = function(model, view, order, argu) {
		var tr = argu[0];	/* autocomplete clicked TR */
		var trIndex = tr.rowIndex;
		var obj = {};
		var series = model.series;
		var i;

		for(i=0; i < series.length; ++i) {
			obj[series[i]] = model.getData(series[i])[trIndex];
		}
		order.modifyNextFunc(obj);
		view.DOM.innerHTML = "";
	};

	autoComplete.get.addFunc( getAutoCompleteFunc1 );
	autoComplete.get.addFunc( getAutoCompleteFunc2 );
	autoComplete.get.addFunc( getAutoCompleteFunc3 );
	autoComplete.get.addFunc( getAutoCompleteFunc4 );

	sosok.get.addFunc( getAutoCompleteFunc1 );
	sosok.get.addFunc( getAutoCompleteFunc2_tree );
	sosok.get.addFunc( getAutoCompleteFunc3 );
	sosok.get.addFunc( getAutoCompleteFunc4 );


////////////////////////////////////////////////////////////////////////////////////////////////////////
//ORDER
//	OrderCert, Tree, EnteranceCert
//		refreshTable - 1, 2
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
// refresh all table
	/* 1 : get Data from server */
	var refreshTableFunc1 = function(model, view, order){model.getServerData({}, order.next);};

	/* 2 : display Data to view */
	var refreshTableFunc2 = function(model, view, order){
		view.DOM.innerHTML = view.makeTreeTable([model.getData(0), model.getData(1)]);
		imgRollover();
	};

	orderCert.refreshTable.addFunc( refreshTableFunc1 );
	orderCert.refreshTable.addFunc( refreshTableFunc2 );
	orderCert.refreshTable.start();

	tree.refreshTable.addFunc( refreshTableFunc1 );
	tree.refreshTable.addFunc( refreshTableFunc2 );
	tree.refreshTable.start();

	enteranceCert.refreshTable.addFunc( refreshTableFunc1 );
	enteranceCert.refreshTable.addFunc( refreshTableFunc2 );
	enteranceCert.refreshTable.start();


////////////////////////////////////////////////////////////////////////////////////////////////////////
//ORDER
//	OrderCert, Tree, EnteranceCert
//		modifyTable - 1, 2
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
// click modify
	/* 1 : bind click event to table button */
	var modifyTableFunc1 = function(model, view, order) {
		var add = view.getButton("add");
		var del_left = view.getButton("del_left");
		var del_right = view.getButton("del_right");
		var i;

		view.buttonOnOff(true);
		/* add onclick */
		for(i=0; i < add.length; ++i) {
			add[i].onclick = function() {
				var td = this.parentNode;
				var tr = td.parentNode;
				var table = view.DOM.getElementsByTagName("table")[0];
				var cell = table.insertRow(tr.rowIndex + td.rowSpan).insertCell();
				var input = document.createElement("input");
				cell.appendChild(input);
				td.rowSpan = td.rowSpan + 1;
				input.focus();
				order.nextXCount(input, tr.rowIndex);
			};
		}
		/* del_right onclick */
		for(i=0; i < del_right.length; ++i) {
			del_right[i].onclick = function() {
				var td = this.parentNode;
				var tr = td.parentNode;
				var trIndex = tr.rowIndex;
				var imgString = "";

				if(!model.delData(trIndex)) {alert("delete data fail!");}
				else {
					/* deleting animation play */
					td.style.position = "relative";
					imgString = "<img style='display: block; position: absolute; top: 0px; left: 0px;' ";
					imgString += "src='../image/clear_animation.gif?"+Math.random()+"' />";
					td.innerHTML += imgString;
					setTimeout(function() {
						refreshTableFunc2(model, view, order);	/* refresh display table */
						modifyTableFunc1(model, view, order);	/* give event to button */
					}, 400);
				}
			};
		}
		/* del_left onclick */
		for(i=0; i < del_left.length; ++i) {
			del_left[i].onclick = function() {
				alert("인원을 전부 삭제해주시면 됩니다!");
			};
		}
	};

	/* 2 : bind autocomplete to input button when click add button */
	var modifyTableFunc2 = function(model, view, order, argu) {
		var input = argu[0];
		var plusIndex = argu[1];

		var countKeyDown = 0;
		var timerID;
		var input;

		input.onchange = function() {
			var top, left;
			var td = this.parentNode;
			var tdIndex = td.parentNode.rowIndex;
			var div = td.parentNode.parentNode.parentNode.parentNode;
			var autoCompleteWidth = autoComplete.view.DOM.offsetWidth;
			
			if(div.offsetLeft + autoCompleteWidth > document.body.clientWidth) {
				left = (div.offsetLeft + td.offsetLeft - autoCompleteWidth + td.offsetWidth/2) + "px";
			}
			else {
				left = (div.offsetLeft + td.offsetLeft + td.offsetWidth/2) + "px";
			}
			top = (td.offsetTop - div.scrollTop + div.offsetTop + 30) + "px";

			view.buttonUnclickable();
			view.scrollOnOff(false);

			order.autoComplete.start(this.value, top, left, function(obj){
														      order.exeSpecific(2, plusIndex, tdIndex, obj);
														  });// only tree will differant
		};
		input.onkeydown = function() {
			input = this;
			clearTimeout(timerID);
			if(window.event.keyCode === 13) {
				this.onchange();
				this.blur();
				this.focus();
				return;
			}
			else if(window.event.keyCode === 8) {		//구현 필요(엔터 치지 않고도 자동완성 실행 but 한글문제...)//
				if(countKeyDown > 0)
					countKeyDown--;
			}
			else {
				countKeyDown++;
			}
			if(countKeyDown > 3) {
				timerID = setTimeout(function(){input.onchange(); input.blur(); input.focus();}, 1000);
			}
		};
	};

	/* 3 : after autocomplete */
	var modifyTableFunc3 = function(model, view, order, argu) {
		var plusIndex = argu[0]
		var tdIndex = argu[1];
		var autoCompleteObj = argu[2];
		var series = model.series;
		var obj = {};
		
		obj[series[0]] = model.getData(0)[plusIndex];
		obj[series[1]] = autoCompleteObj["rank"] + " " + autoCompleteObj["name"];
		obj[series[2]] = model.getData(2)[plusIndex];
		obj[series[3]] = autoCompleteObj["per_code"];
		
		if(model.checkData(obj)) { alert("already inserted!"); }
		else {
			if(!model.addData(obj, tdIndex)) { alert("insert data fail!"); }
			else {
				view.scrollOnOff(true);
				refreshTableFunc2(model, view, order);/* refresh display table */
				modifyTableFunc1(model, view, order);	/* give event to button */
			}
		}
	};

	/* 3_tree : after autocomplete for tree */
	var modifyTableFunc3_tree = function(model, view, order, argu) {
		var plusIndex = argu[0]
		var tdIndex = argu[1];
		var autoCompleteObj = argu[2];
		var series = model.series;
		var obj = {};
		
		obj[series[0]] = model.getData(0)[plusIndex];
		obj[series[1]] = autoCompleteObj["short_sosokcode"];
		obj[series[2]] = model.getData(2)[plusIndex];
		obj[series[3]] = autoCompleteObj["sosokcode"];
		
		if(model.checkData(obj)) { alert("already inserted!"); }
		else {
			if(!model.addData(obj, tdIndex)) { alert("insert data fail!"); }
			else {
				view.scrollOnOff(true);
				refreshTableFunc2(model, view, order);/* refresh display table */
				modifyTableFunc1(model, view, order);	/* give event to button */
			}
		}
	};

	orderCert.modifyTable.addFunc( modifyTableFunc1 );
	orderCert.modifyTable.addFunc( modifyTableFunc2 );
	orderCert.modifyTable.addFunc( modifyTableFunc3 );
	orderCert.modifyTable.autoComplete = autoComplete.get;

	enteranceCert.modifyTable.addFunc( modifyTableFunc1 );
	enteranceCert.modifyTable.addFunc( modifyTableFunc2 );
	enteranceCert.modifyTable.addFunc( modifyTableFunc3 );
	enteranceCert.modifyTable.autoComplete = autoComplete.get;

	tree.modifyTable.addFunc( modifyTableFunc1 );
	tree.modifyTable.addFunc( modifyTableFunc2 );
	tree.modifyTable.addFunc( modifyTableFunc3_tree );
	tree.modifyTable.autoComplete = sosok.get;

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//		modify_button onclick event
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* bind onclick event to modify button */
	var bindOnclickEventToModify_button = function(/*string div position*/position, obj) {
		$(position + "_modify").onclick = function() {
		/* modify - 구현 완료*/
			if(this.src.indexOf("edit") != -1) {
				obj.modifyTable.start();
				this.src = "../image/button_save.jpg";
				$(position + "_cancel").style.display = "inline";
				if($(position + "_add"))
					$(position + "_add").style.display = "inline";
			}
		/* save - 구현 완료*/
			else {
				obj.model.setServerData({}, function(){obj.refreshTable.start();});
				$(position + "_cancel").style.display = "none";
				if($(position + "_add"))
					$(position + "_add").style.display = "none";
				this.src = "../image/button_edit.jpg";
				autoComplete.view.clear();
			}
		};
		/* cancel - 구현 완료*/
		$(position + "_cancel").onclick = function() {
			obj.model.resetData();
			refreshTableFunc2(obj.model, obj.view);
			this.style.display = "none";
			if($(position + "_add"))
				$(position + "_add").style.display = "none";
			$(position + "_modify").src = "../image/button_edit.jpg";
			autoComplete.view.clear();
			obj.view.scrollOnOff(true);
		};
		/* add - 구현 완료*/
		if($(position + "_add"))
			$(position + "_add").onclick = function() {
				obj.add.start();
			};
	};

	bindOnclickEventToModify_button( "left", orderCert );
	bindOnclickEventToModify_button( "right", enteranceCert );
	bindOnclickEventToModify_button( "mid", tree );

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//		add_button onclick event
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 1 : get data from server, display extra window */
	var addFunc1 = function(model, view, order) {
		var contentView = view.contentView = new View( $("extra_content") );
		var inputView = view.inputView = new View( $("extra_input") );
		var listView = view.listView = new View( $("extra_list") );
		var helpView = view.helpView = new View( $("extra_help") );
		var shadowView = view.shadowView = new View( $("shadowAll") );

		var imgTagStr = "<img id='extra_addition' class='addition_button' type='image' src='../image/button_addition.png' value='addition' />";
		var inputTags;
		
		view.show(true);
		shadowView.show(true);
		body.view.scrollOnOff(false);
		
		$("extra_subject").innerHTML = order.subject;
		inputView.DOM.innerHTML = "이름 : <input><br>코드 : <input>" + imgTagStr;

		inputTags = inputView.DOM.getElementsByTagName("input");
		inputTags[0].focus();

		/* add button onclick */
		$("extra_addition").onclick = function() {
			var name = inputTags[0].value;
			var code = inputTags[1].value;
			var nameObj = {}, codeObj = {}, addObj = {};
			nameObj[model.series[0]] = name;
			codeObj[model.series[1]] = code;
			addObj[model.series[0]] = name;
			addObj[model.series[1]] = code;

			if(model.checkData(nameObj) || model.checkData(codeObj)){ alert("중복된 자료가 있습니다."); }
			else if(name === "" || code === ""){ alert("모두 입력하셔야 합니다."); }
			else {
				model.addData(addObj);
				model.setServerData({}, function(){order.resetI();addFunc1(model, view, order);});
			}
		};

		/* close button onclick */
		$("extra_close").onclick = function() {
			view.show(false);
			shadowView.show(false);
			listView.clear();
			body.view.scrollOnOff(true);
			$("extra_cancel").onclick();
		};

		imgRollover( $("extra_window") );

		model.getServerData({}, order.next);
	};

	/* 1_admin : get data from server, display extra window for admin*/
	var addFunc1_admin = function(model, view, order) {
		var contentView = view.contentView = new View( $("extra_content") );
		var inputView = view.inputView = new View( $("extra_input") );
		var listView = view.listView = new View( $("extra_list") );
		var helpView = view.helpView = new View( $("extra_help") );
		var shadowView = view.shadowView = new View( $("shadowAll") );

		var imgTagStr = "<img id='extra_addition' class='addition_button' type='image' src='../image/button_addition.png' value='addition' />";
		var check1Str = "<div><span>명령</span><img id='check1' src='../image/check.jpg' value='check' /></div>";
		var check2Str = "<div><span>출입통제</span><img id='check2' src='../image/check.jpg' value='check' /></div>";
		var check = [false, false];
		var checkClick;

		var inputTag;
		var countKeyDown = 0;
		var timerID;
		
		view.show(true);
		shadowView.show(true);
		body.view.scrollOnOff(false);
		
		$("extra_subject").innerHTML = order.subject;
		inputView.DOM.innerHTML = "이름 : <input><br>권한 : "+ check1Str +"    "+ check2Str + imgTagStr;

		inputTag = inputView.DOM.getElementsByTagName("input")[0];
		inputTag.focus();	// -> autocomplete 주기
	
		inputTag.onchange = function() {
			var top = "140px";
			var left = "570px";

			autoComplete.get.start(this.value, top, left, function(obj){ order.exeSpecific(4, obj); });// only tree will differant
		};
		inputTag.onkeydown = function() {
			input = this;
			clearTimeout(timerID);
			if(window.event.keyCode === 13) {
				this.onchange();
				this.blur();
				this.focus();
				return;
			}
			else if(window.event.keyCode === 8) {		//구현 필요(엔터 치지 않고도 자동완성 실행 but 한글문제...)//
				if(countKeyDown > 0)
					countKeyDown--;
			}
			else {
				countKeyDown++;
			}
			if(countKeyDown > 3) {
				timerID = setTimeout(function(){input.onchange(); input.blur(); input.focus();}, 1000);
			}
		};

		checkClick = function() {
			var bool = (this.src.indexOf("selected") == -1);
			this.src = "../image/check" + (bool ? "_selected" : "") + ".jpg";
			check[parseInt(this.id.charAt(this.id.length-1))-1] = bool;
			log(parseInt(this.id.charAt(this.id.length-1)));
		};
		$("check1").onclick = checkClick;
		$("check2").onclick = checkClick;
		
		/* add button onclick */
		$("extra_addition").onclick = function() {
			var person = order.person;
			var per_code = order.per_code;
			var admin = [(check[0] ? "ADMIN" : "X"), (check[1] ? "ADMIN" : "X")];
			var obj = {workplacecode: admin[0], sosokcode : admin[1], per_code: per_code, person: person};
			var workplacecodeObj = {workplacecode: admin[0], per_code: per_code, person: person};
			var sosokcodeObj = {sosokcode : admin[1], per_code: per_code, person: person};
			
			log(obj);
			log(check);
			log(model.checkData(obj));
			if(!(check[0] || check[1])) { alert("하나 이상 체크 해주세요!"); }
			else if(model.checkData(workplacecodeObj) || model.checkData(sosokcodeObj)) { alert("중복된 자료가 있습니다."); }
			else if(per_code && inputTag.value === person) {
				model.addData(obj);
				model.setServerData({}, function(){order.resetI();addFunc1_admin(model, view, order);});
			}
			else {
				alert("자동완성으로 채워주세요!")
			}
		};

		/* close button onclick */
		$("extra_close").onclick = function() {
			view.show(false);
			shadowView.show(false);
			listView.clear();
			body.view.scrollOnOff(true);
			$("extra_cancel").onclick();
		};

		imgRollover( $("extra_window") );

		model.getServerData({}, order.next);
	};

	/* 2 : display list */
	var addFunc2 = function(model, view, order) {
		var listView = view.listView;

		listView.DOM.innerHTML = view.makePlainTableWithDel([model.getData(0), model.getData(1)]);
		order.next();
	};

	/* 2_admin : display list for admin*/
	var addFunc2_admin = function(model, view, order) {
		var listView = view.listView;

		listView.DOM.innerHTML = view.makePlainTableWithDel([model.getData(0), model.getData(1), model.getData(3)]);
		order.next();
	};
	
	/* 3 : bind button onclick event */
	var addFunc3 = function(model, view, order) {
		var inputView = view.inputView;
		var listView = view.listView;
		var tmpFunc = $("extra_addition").onclick;

		/* modify button onclick */
		$("extra_modify").onclick = function() {
			if(this.src.indexOf("edit") != -1) {
				order.nextXCount();
				this.src = "../image/button_save.jpg";
				$("extra_cancel").style.display = "inline";
				inputView.buttonUnclickable();
			}
			else {
				this.src = "../image/button_edit.jpg";
				$("extra_cancel").style.display = "none";
				$("extra_addition").onclick = tmpFunc;
				model.setServerData({}, function(){order.resetI();order.funcArray[0](model, view, order);});
			}
		};
		$("extra_cancel").onclick = function() {
			$("extra_modify").src = "../image/button_edit.jpg";
			this.style.display = "none";
			model.resetData();
			$("extra_addition").onclick = tmpFunc;
			order.setI(1);
			order.funcArray[1](model, view, order);
			listView.buttonOnOff(false);
			imgRollover( $("extra_window") );
		};

		$("extra_tooltip").style.background = "url('"+order.tooltip+"') no-repeat center";
		$("extra_help").onmouseover = function() {
			$("extra_tooltip").style.display = "block";
		};
		$("extra_help").onmouseout = function() {
			$("extra_tooltip").style.display = "none";
		};
	};

	/* 4 : modify list */
	var addFunc4 = function(model, view, order) {
		var listView = view.listView;
		var delButtons;
		var i;

		listView.buttonOnOff(true);
		imgRollover( listView.DOM );
		delButtons = listView.getButton("del");
		for(i=0; i < delButtons.length; ++i) {
			delButtons[i].onclick = function() {
				var rowIndex = this.parentNode.parentNode.rowIndex;
				model.delData(rowIndex);
				order.setI(-1);
				order.funcArray[1](model, view, order);
				order.funcArray[3](model, view, order);
				order.setI(2);
			}
		}

		var tds = listView.DOM.getElementsByTagName("td");
		var originalValue;

		for(i=0; i < tds.length; ++i) {
			if(i%2 == 0) {
				tds[i].ondblclick = function() {
					this.innerHTML = "<input value='"+this.innerHTML+"'>";
					this.firstChild.onchange = function() {
						var series = model.series;
						var index = this.parentNode.parentNode.rowIndex;
						var name = model.getData(0)[index];
						var code = model.getData(1)[index];
						var from = {};
						var to = {};

						from[series[0]] = name;
						from[series[1]] = code;

						to[series[0]] = this.value;
						to[series[1]] = code;

						model.modifyData(from, to);
						this.parentNode.innerHTML = this.value;
					};
					this.firstChild.onkeydown = function() {
						if(window.event.keyCode === 13) {
							this.blur();
							return;
						}
					};
				}
			}
		}
	};
	
	/* autocomplete : after autocomplete */
	var addFunc_autocomplete = function(model, view, order, argu) {
		var autoCompleteObj = argu[0];
		var input = view.inputView.DOM.getElementsByTagName("input")[0];
		var per_code = autoCompleteObj["per_code"];
		var person = autoCompleteObj["rank"] + " " + autoCompleteObj["name"];

		input.value = person;
		
		order.person = person;
		order.per_code = per_code;
	};

	orderCert.add.addFunc( addFunc1 );
	orderCert.add.addFunc( addFunc2 );
	orderCert.add.addFunc( addFunc3 );
	orderCert.add.addFunc( addFunc4 );
	orderCert.add.subject = "근무지 추가";
	orderCert.add.tooltip = "../image/tooltip_addWorkplace.png";

	enteranceCert.add.addFunc( addFunc1 );
	enteranceCert.add.addFunc( addFunc2 );
	enteranceCert.add.addFunc( addFunc3 );
	enteranceCert.add.addFunc( addFunc4 );
	enteranceCert.add.subject = "소속 추가";
	enteranceCert.add.tooltip = "../image/tooltip_addSosok.png";

	series.add.addFunc( addFunc1 );
	series.add.addFunc( addFunc2 );
	series.add.addFunc( addFunc3 );
	series.add.addFunc( addFunc4 );
	series.add.subject = "근무종류 추가";
	series.add.tooltip = "../image/tooltip_addSeries.png";
	$("head_addSeries").onclick = function() {
		series.add.start();
	};

	admin.add.addFunc( addFunc1_admin );
	admin.add.addFunc( addFunc2_admin );
	admin.add.addFunc( addFunc3 );
	admin.add.addFunc( addFunc4 );
	admin.add.addFunc( addFunc_autocomplete );
	admin.add.subject = "관리자 추가"
	admin.add.tooltip = "../image/tooltip_addAdmin.png";
	$("head_addAdmin").onclick = function() {
		admin.add.start();
	};
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//		etc
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* prohibit drag */
	document.body.ondragstart = function() { return false; };
	document.body.onselectstart = function() { return false; };
	
	/* make button hover event, change mouse cursor */
	imgRollover();
};

var getUserInfo = ajaxRequest({
		requestName: "UserInfo",
		method: "GET",
		url: "../getUserInfo.jsp",
		sendVariables: {need: false},
		responseAction: function(req) {
			$("#userInfo").innerHTML = ( (req.responseText.indexOf("null") > 0) ? "로그인 후 이용해주세요!" : req.responseText + "님, 환영합니다!" );
			if(req.responseText.indexOf("관리자") != -1)
				init();
			else
				$("#content").innerHTML = "관리자가 아닙니다.";
		}});