(function() {
	"use strict";

	var root          = this,
	    API           = {},
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

	// Human class
	API.Human = function(name) {
		this.name = name;
	};

	// human constructor
	API.Human.prototype.constructor = API.Human;

	// Human::getName
	API.Human.prototype.getName = function() {
		return this.name;
	};

	// Human::interactWith
	API.Human.prototype.interactWith = function(other) {
		var str = _.template('${ self } is doing something with ${ theOther }', {'self': this.name, 'theOther': other.getName()});
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