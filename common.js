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
			return document.getElementById(id);	//	�����ڵ���� ȣȯ�� ������ ���� �ӽ��ڵ�
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
 *	ajaxRequest(obj) -- ajax ��û�� ���� �Լ��� �����ϴ� �Լ�
 *
 *
 *	�� �Լ��� ������ �������ڷ� ��ü �ϳ��� ������, �� ��ü�� �ִ� �����͸� �������
 *	ajax ��û �Լ��� ����� ��ȯ�Ѵ�.
 *
 *	�������ڷ� �Ѿ���� ��ü���� ���� ������Ƽ ��� �Ǵ� �Ϻΰ� �־�� �Ѵ�.(* �ʼ�)
 *
 *		requestName : ��û�� �̸�, ������� �ӽ� ��û���� ��ü�Ѵ�.
 *
 *		     method : ��û ����� ���Ѵ� GET : POST, ������� GET ���� ��ü�Ѵ�.
 *
 *			   *url : ��û�� �����ּ� �� ���ϸ�, �ݵ�� �ʿ�� �Ѵ�.
 *
 *	  sendVariables : ��û�� ���� data��, ��ü�̸� {Name: value} ������ �ۼ��ʿ�.
 *					  value �� ���ڿ��� ������ȯ �� ���Ǹ�
 *					  value �� ������ ���� ���� ���򰡵ǿ��� �� ��� ���ڿ� �Ǿտ�
 *					  eval�� �߰��Ѵ�.
 *
 *	 responseAction : ��û�� ���� ������ ���������� ������ �۵��� �Լ�, �� �Լ��� ��û�� 
 *					  ���� request�� ���ڷ� �޴´�. ������� ������ �Լ��� ��ü�Ѵ�.
 *
 *	�� �Լ��� ���۵� �ϱ��Լ��� sendVariables �ܿ� �߰������� ���� data�� ��ü ���ڷ� �޴´� 
 *	������ sendVariable�� �����ϴ�.
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
			// GET �� ��� �������ڵ��� URL�� ���δ�.
			// POST �� ��� �������ڸ� ���� content�� ���δ�.
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
				if(this[i] === value)	//	������ ��Ȯ�� ��ġ �ؾ��Ѵ�.
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
//	Ajax�� ���Ѱ� - ȣȯ�� �ӽ�!!
function createRequest() {
	var request = new XMLHttpRequest();
	return request;
}