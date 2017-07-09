/*
 *	AdminPage/view.js : 
 *		View Class for AdminPage
 *
 *		SC PRODUCTION made by SangChul,Lee
 */

function View(dom) {

// private:

// privileged:

// public:
	this.DOM = dom;
};

/*
 *	View prototype function
 *
 *		- view DOM relative functions
 *		getButton(string className)		return button array
 *		clear()
 *
 *		- view style relative functions
 *		buttonOnOff(boolean onOff)
 *		scrollOnOff(boolean onOff)
 *		show(boolean onOff)
 *
 *		- view utility functions
 *		makeTreeTable(multiArray)		return table string
 *		makePlainTable(multiArray)		return table string
 *		makePlainTableWithDel(multiArray)		return table string
 */


// makeTreeTable : make two column table like tree
View.prototype.makeTreeTable = function(multiArray) {
	var tableString = "<table><tr>";
	var getSeries = function(arr) {
		var length = arr.length;
		var arr = arr.slice();	//copy array
		var returnObject = {};
		var checkRepeat = function(array, find) {
			var indexes = [];
			for(var i=0; i < array.length; ++i) {
				if(array[i] == find)
					indexes.push(i);
			}
			return indexes;
		};
		for(var i=0; i < arr.length; ++i) {
			if(!returnObject[String(arr[i])]) {
				returnObject[String(arr[i])] = checkRepeat(arr, arr[i]);
			}
		}
		return returnObject;
	};
	var seriesObject = getSeries(multiArray[0]);

	for(var series in seriesObject) {
		var rowspan = seriesObject[series].length;
		tableString += "<td rowspan='"+rowspan+"' class='left_tds'>";
		tableString += "<img name='add' class='add' style='float: left' src='../image/s_button_add.png' value='+' />";
		tableString += "<span>" + series + "</span>";
		tableString += "<img name='del' class='del_left' style='float: right;' src='../image/s_button_del.png' value='-' />";
		tableString += "</td>";
		for(var i=0; i < rowspan; ++i) {
			tableString += "<td class='right_tds'>";
			tableString += multiArray[1][seriesObject[series][i]];
			tableString += "<img name='del' class='del_right' style='float: right;' src='../image/s_button_del.png' value='-' />";
			tableString += "</td></tr><tr>";
		}
	}
	tableString += "</tr></table>";

	return tableString;
};

// makePlainTable
View.prototype.makePlainTable = function(multiArray) {
	var tableString = "<table>";

	for(var i=0; i < multiArray[0].length; ++i) {
		tableString += "<tr>";
		for(var j=0; j < multiArray.length; ++j) {
			tableString += "<td>";
			tableString += (multiArray[j].constructor === Array ?
										multiArray[j][i] : 
										multiArray[j]);
			tableString += "</td>";
		}
		tableString += "</tr>";
	}
	tableString += "</table>";

	return tableString;
};
// makePlainTableWithDel
View.prototype.makePlainTableWithDel = function(multiArray) {
	var tableString = "<table>";

	for(var i=0; i < multiArray[0].length; ++i) {
		tableString += "<tr>";
		for(var j=0; j < multiArray.length; ++j) {
			tableString += "<td>";
			tableString += (multiArray[j].constructor === Array ?
										multiArray[j][i] : 
										multiArray[j]);
			if(j == multiArray.length-1)
				tableString += "<img name='del' class='del' src='../image/s_button_del.png' value='-' />"
			tableString += "</td>";
		}
		tableString += "</tr>";
	}
	tableString += "</table>";

	return tableString;
};

// buttonOnOff
View.prototype.buttonOnOff = function(onOff) {
	var display = (onOff ? "inline" : "none");
	var imgs = this.DOM.getElementsByTagName("img");
	var i;

	for(i=0; i < imgs.length; ++i) {
		imgs[i].style.display = display;
	}
};

// getButton by className
View.prototype.getButton = function(className) {
	var imgs = this.DOM.getElementsByTagName("img");
	var filter = [];
	var i;

	for(i=0; i < imgs.length; ++i) {
		if(imgs[i].className === className) {
			filter.push(imgs[i]);
		}
	}
	return filter;
};

// scroll on off
View.prototype.scrollOnOff = function(onOff) {
	var str = (onOff ? "auto" : "hidden");
	this.DOM.style.overflow = str;
};

// clear DOM
View.prototype.clear = function() {
	this.DOM.innerHTML = "";
};

// make button unclickable
View.prototype.buttonUnclickable = function() {
	var buttons = this.DOM.getElementsByTagName("img");
	var button;
	var i;

	for(i=0; i < buttons.length; ++i) {
		button = buttons[i];
		button.onclick = function() { return false; };
		button.onmouseover = function() { return false; };
		button.onmouseout = function() { return false; };
		button.style.cursor = "default";
	}
};

// show
View.prototype.show = function(onOff) {
	this.DOM.style.display = onOff ? "block" : "none";
};