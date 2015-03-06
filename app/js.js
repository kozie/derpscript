(function() {
	"use strict";

	var root = this,
	    _menu,
	    _editor;

	// Initialize
	(function init() {
		_editor = React.createClass({
			render: function() {
				return React.DOM.textarea({id: 'editor'}, '# Insert code here\n');
			},
			componentDidMount: function() {
				_editor = CodeMirror.fromTextArea(root.document.getElementById('editor'), {
					mode: 'coffeescript',
					theme: 'paraiso-dark',
					keyMap: 'sublime',
					tabSize: 2,
					lineNumbers: true,
					autofocus: true,
					indentWithTabs: true
				});

				if (root.location.hash) {
					var hash = root.location.hash.replace('#', '');
					// var content = atob(hash);

					//_editor.setValue(content);
					$.ajax({
						url: _.template('//api.github.com/gists/${gist_id}', {gist_id: hash}),
						type: 'GET',
						dataType: 'jsonp'
					}).success(function(gist) {
						if (gist && gist.data && gist.data.file) {
							var files = _.keys(gist.data.files);
							var content = gist.data.files[files[0]].content;

							_editor.setValue(content);
						}
					});
				}

				// _editor.on('change', function(ed) {
				// 	var hash = btoa(ed.getValue());
				// 	root.history.replaceState({editorVal: ed.getValue()}, root.document.title, 'index.html#' + hash);
				// });
			}
		});
		React.renderComponent(_editor(), root.document.getElementById('editor-container'));

		_menu = React.createClass({
			render: function() {
				return React.DOM.ul({className: 'nav navbar-nav'},
					React.DOM.li({}, React.DOM.a({id: 'btn-run', href: '#'}, [React.DOM.span({'className': 'glyphicon glyphicon-play'}), ' Run!'])),
					React.DOM.li({}, React.DOM.a({id: 'btn-save', href: '#'}, [React.DOM.span({'className': 'glyphicon glyphicon-floppy-disk'}), ' Save']))
				);
			},
			componentDidMount: function() {
				root.document.getElementById('btn-run').addEventListener('click', function(e) {
					e.preventDefault();
					runThatShit();
				});

				root.document.getElementById('btn-save').addEventListener('click', function(e) {
					e.preventDefault();
					saveAsGist();
				});
			}
		});
		React.renderComponent(_menu(), root.document.getElementById('menu'));

		output('Welcome to DerpScript!');
		flushOutput();
	})();

	function runThatShit() {
		console.log('Running!');
		resetOutputBuffer();

		try {
			var code = _editor.getValue();

			// Compile coffeescript and evaluate
			//console.log(CoffeeScript.compile(code));
			CoffeeScript.eval(code);

			// Run inital step, if present
			doStep('initial');
		} catch (e) {
			output('Error..');
			console.log(e.message);
		}

		flushOutput();
	}

	function saveAsGist() {
		var code = _editor.getValue();

		$.ajax({
			url: '//api.github.com/gists',
			type: 'POST',
			data: { 'public': true, 'files': { 'derpscript.coffee': { 'content': JSON.stringify(code) } } },
			dataType: 'jsonp'
		}).success(function(gist) {

			if (gist && gist.data && gist.data.id) {
				root.history.replaceState({editorVal: _editor.getValue()}, root.document.title, 'index.html#' + gist.data.id);

				output('Story saved!');
				flushOutput();
			}
		});
	}

}).call(this);
