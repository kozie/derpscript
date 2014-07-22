(function() {
	"use strict";

	var root          = this,
	    API           = {},
	    _steps        = {},
	    _outputBuffer = '',
	    _output;

	API.outputContainer = root.document.getElementById('output-container');

	// Initialize
	API.init = function() {
		_output = React.createClass({
			render: function() {
				return React.DOM.pre({id: 'output'}, _outputBuffer);
			}
		});
	};

	API.step = function(name, fn) {
		//setTimeout(function() {
			_steps[name] = fn;

			if (name == 'initial') {
				API.doStep(name);
			}
		//} , 1500);
	};

	API.doStep = function(name) {
		if (name in _steps) {
			(_steps[name])();
		} else {
			console.log('Step ' + name + ' undefined');
		}
	};

	// Output function to add output to buffer
	API.output = function(str) {
		_outputBuffer = _outputBuffer + str + "\n";
	};

	// Function to flush the output buffer to the pre element
	API.flushOutput = function() {
		React.renderComponent(_output(), API.outputContainer);
	};

	API.resetOutputBuffer = function() {
		_outputBuffer = '';
	};

	// Action class
	API.Action = function(str) {
		this.text = str;
	};

	API.Action.prototype.constructor = API.Action;

	API.Action.prototype.append = function(str) {
		this.text = this.text + ' ' + str;

		return this;
	};

	API.Action.prototype.getStr = function(object) {
		var str = '';
		if (typeof object == 'object') {
			str = object.str();
		} else {
			str = object;
		}

		return str;
	};

	API.Action.prototype.in = function(object) {
		var str = this.getStr(object);
		return this.append('in ' + str);
	};

	API.Action.prototype.on = function(object) {
		var str = this.getStr(object);
		return this.append('on ' + str);
	};

	API.Action.prototype.over = function(object) {
		var str = this.getStr(object);
		return this.append('over ' + str);
	};

	API.Action.prototype.out = function(object) {
		var str = this.getStr(object);
		return this.append('out ' + str);
	};

	API.Action.prototype.from = function(object) {
		var str = this.getStr(object);
		return this.append('from ' + str);
	};

	API.Action.prototype.with = function(object) {
		var str = this.getStr(object);
		return this.append('with ' + str);
	};

	API.Action.prototype.end = function() {
		API.output(this.text);
	};

	// Animal class
	API.Animal = function(type) {
		this.type = type;
	}

	API.Animal.prototype.constructor = API.Animal;

	API.Animal.prototype.str = function() {
		return this.type;
	};

	// Human class
	API.Human = function(name) {
		this.name = name;
	};

	// human constructor
	API.Human.prototype.constructor = API.Human;

	API.Human.prototype.str = function() {
		return this.name;
	};

	API.Human.prototype.put = function(object) {
		var str = '';
		if (typeof object == 'object') {
			str = object.str();
		} else {
			str = object;
		}

		return new API.Action(this.name + ' puts ' + str);
	};

	API.Human.prototype.part = function(str) {
		return _.template("${ self }'s ${ part }", {'self': this.name, 'part': str});
	};

	// Human::interactWith
	API.Human.prototype.interactWith = function(other, wut) {
		if (wut === undefined) wut = 'it';
		var str = _.template('${ self } is doing '+ wut +' with ${ theOther }', {'self': this.name, 'theOther': other.name});
		API.output(str);
	};

	// Expose API's content to root element (global)
	for (var name in API) {
		if (API.hasOwnProperty(name)) {
			root[name] = API[name];
		}
	}

	API.init();

}).call(this);