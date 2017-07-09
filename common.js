/*
 *	common.js : 
 *	
 *	library for happy web developer
 *	
 *	SC_PRODUCTION made by SangChul,Lee
 */

/***********************************************************************************************/
//	document.get ~	->	$ , '#id', '.class', ' tagname'
function $(id) {
	var classify = id.charAt(0);
	var name = id.substring(1);
	switch(classify) {
		case "#":
			return document.getElementById(name);
		case ".":
			return document.getElementsByClassName(name);
		case " ":
			return document.getElementsByTagName(name);
		default:
			return document.getElementById(id);	//	기존코드와의 호환성 유지를 위한 임시코드
	}
}
/***********************************************************************************************/
//	img rollover
//	img.extension -> original file
//	img_rollover.extension -> rollover file
//	button -> use img Tag, exept image -> use background
function imgRollover(dom) {
	if((typeof dom) == "undefined")
		dom = $("#all");	//	for enterance
	var imgTags = dom.getElementsByTagName("img");
	for(var i=0; i < imgTags.length; i++) {
		var imgTag = imgTags[i];

		function findExtension(img) {
			if(img.src.indexOf(".jpg") != -1)
				return ".jpg";
			else if(img.src.indexOf(".gif") != -1)
				return ".gif";
			else if(img.src.indexOf(".png") != -1)
				return ".png";
			else
				return null;
		}

		imgTag.style.cursor = "pointer";
		imgTag.onmouseover = function() {
			var findstr = findExtension(this);
			this.src = this.src.substring(0, this.src.lastIndexOf(findstr)) + "_rollover" + findstr;
		}
		imgTag.onmouseout = function() {
			var findstr = findExtension(this);
			if(this.src.indexOf("_rollover") > 0)
				this.src = this.src.substring(0, this.src.lastIndexOf("_rollover")) + findstr;
		}
	}
}
/***********************************************************************************************/
//	alert error
//	in jsp : you should print "error" in catch
function alertError(responseText) {
	if(responseText.indexOf("error") != -1)
		alert("you got error! please report to 6464");
}
/***********************************************************************************************/
//	set DOM Style
function setDOMStyle(dom, styleObj) {
	for(var i in styleObj) {
		dom.style[i] = styleObj[i];
	}
}
/***********************************************************************************************/
/*
 *	ajaxRequest(obj) -- ajax 요청을 위한 함수를 제작하는 함수
 *
 *
 *	이 함수는 유일한 전달인자로 객체 하나를 받으며, 그 객체에 있는 데이터를 기반으로
 *	ajax 요청 함수를 만들어 반환한다.
 *
 *	전달인자로 넘어오는 객체에는 다음 프로퍼티 모두 또는 일부가 있어야 한다.(* 필수)
 *
 *		requestName : 요청의 이름, 없을경우 임시 요청으로 대체한다.
 *
 *		     method : 요청 방식을 정한다 GET : POST, 없을경우 GET 으로 대체한다.
 *
 *			   *url : 요청할 파일주소 및 파일명, 반드시 필요로 한다.
 *
 *	  sendVariables : 요청에 보낼 data들, 객체이며 {Name: value} 식으로 작성필요.
 *					  value 는 문자열로 강제변환 후 사용되며
 *					  value 를 보낼때 마다 값이 재평가되여야 할 경우 문자열 맨앞에
 *					  eval을 추가한다.
 *
 *	 responseAction : 요청에 대한 응답을 성공적으로 받을시 작동될 함수, 이 함수는 요청에 
 *					  대한 request를 인자로 받는다. 없을경우 무동작 함수로 대체한다.
 *
 *	이 함수로 제작된 일급함수는 sendVariables 외에 추가적으로 보낼 data를 객체 인자로 받는다 
 *	형식은 sendVariable과 동일하다.
 **/
ajaxRequest.request = {};
function ajaxRequest(obj) {
	var requestName = obj.requestName || "tmpRequestName";
	var method = obj.method || "GET";
	var url = obj.url;
	var sendVariables = obj.sendVariables || {};
	var responseAction = obj.responseAction || function(req){};

	return function(additionalSendVariables) {
		var finalSendVariables = mergeObject(sendVariables, additionalSendVariables);
		var request = requestName in ajaxRequest.request ? 
							ajaxRequest.request[requestName] :
							ajaxRequest.request[requestName] = createRequest();
		var requestURL = url + (method == "GET" ? makeURL() : "");

		displayLoading(true);
		if(request == null) alert("Unable to create request!");

		request.open(method, requestURL, true);
		request.onreadystatechange = function() {
			if(request.readyState == 4) {
				if(request.status == 200) {
					alertError(request.responseText);
					responseAction(request);
					displayLoading(false);
				}
			}
		};
		if(method == "POST")
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send((method == "GET" ? null : makeURL()));

		function makeURL() {
			// GET 일 경우 전달인자들을 URL에 붙인다.
			// POST 일 경우 전달인자를 따로 content에 붙인다.
			var str = (method == "GET" ? "?" : "");
			for(var i in finalSendVariables) {
				var sendString = (String(finalSendVariables[i]).substring(0, 4) == "eval" ? 
								  eval(String(finalSendVariables[i]).substring(4)) :
								  finalSendVariables[i]);
				str += (i + "=" + (method == "POST" ? encodeURIComponent(encodeURIComponent(sendString)) : sendString) + "&");
			}
			return str+"random="+Math.random();
		}
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
					/*backgroundColor: "#ccc"*/});
			}
		}
	};
}
/***********************************************************************************************/
//	merge object and return new merged object
function mergeObject(A, B) {
	var returnObject = {};
	for(var i in A)
		returnObject[i] = A[i];
	for(var i in B)
		returnObject[i] = B[i];
	return returnObject;
}
/***********************************************************************************************/
//	print log (if browser doesn't have console.log(), just ignore this function)
function log(info) {
	try{
		console.log(info);
	}
	catch(e){
		return;
	}
}
function explorerLog(info) {
	$("log").innerHTML += info;
}
/***********************************************************************************************/
(function() {
	// for ie8 which doesn't have map in Array Class
	if(!Array.prototype.map) {
		Array.prototype.map = function(func) {
			for(var i=0; i < this.length; i++) {
				this[i] = func(this[i]);
			}
		};
	}
	// for ie8 which doesn't have indexOf in Array Class
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(value) {
			for(var i=0; i < this.length; i++) {
				if(this[i] === value)	//	형까지 정확히 일치 해야한다.
					return i;
			}
			return -1;
		};
	}
	// pop array element by value
	Array.prototype.popByValue = function(value) {
		for(var i=0; i < this.length; ++i) {
			if(this[i] === value) {
				this.splice(i, 1);
			}
		}
	};
})();
/***********************************************************************************************/
//	Ajax를 위한것 - 호환성 임시!!
function createRequest() {
	var request = new XMLHttpRequest();
	return request;
}