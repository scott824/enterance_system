/*
 *	AdminPage/orderProcedure.js : 
 *		
 *		iterator class : ordering procedure and guarantee its ordered execute
 *
 *		SC PRODUCTION made by SangChul,Lee
 */


function Order(model, view) {
// private:
	/* if i == -1 stop next */
	var i = 0;
	var model = model;
	var view = view;
	var order = this;

// privileged:
	this.next = function() {
		if(i != -1) {
			i = i + 1;
			order.funcArray[i](model, view, order, arguments);
			if(i === order.funcArray.length) {
				order.resetI();
			}
		}
	};
	this.nextXCount = function() {
		if(i != -1)
			order.funcArray[i+1](model, view, order, arguments);
	};
	this.exeSpecific = function(num) {
		var argu = [].slice.call(arguments);
		argu.splice(0, 1);
		order.funcArray[num](model, view, order, argu);
	};

	this.getModel = function() {
		return model;
	};
	this.getView = function() {
		return view;
	};
	this.getOrder = function() {
		return order;
	};

	this.setI = function(input) {
		i = input;
	};
	this.resetI = function() {
		i = 0;
	};

// public:
	/* functions are saved here */
	this.funcArray = [];

};

Order.prototype.addFunc = function(func) {
	this.funcArray.push(func);
};

Order.prototype.start = function(num) {
	var start;
	var argu = [].slice.call(arguments);

	if(typeof num === "number" && num < this.funcArray.length) {
		start = num;
		argu.splice(0, 1);
	}
	else {
		start = 0;
	}
	this.setI(start);
	this.funcArray[start](this.getModel(), this.getView(), this.getOrder(), argu);
};