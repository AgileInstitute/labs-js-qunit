/*
 * Qt+WebKit powered headless test runner using Phantomjs
 *
 * Phantomjs installation: http://code.google.com/p/phantomjs/wiki/BuildInstructions
 *
 * Run with:
 *  phantomjs runner.js [url-of-your-qunit-testsuite]
 *
 * E.g.
 *      phantomjs runner.js http://localhost/qunit/test
 */

var url = phantom.args[0];

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onInitialized = function() {
	page.evaluate(addLogging);
};
page.open(url, function(status){
	if (status !== "success") {
		console.log("Unable to access network: " + status);
		phantom.exit(1);
	} else {
		// page.evaluate(addLogging);
		var interval = setInterval(function() {
			if (finished()) {
				clearInterval(interval);
				onfinishedTests();
			}
		}, 500);
	}
});

function finished() {
	return page.evaluate(function(){
		return !!window.qunitDone;
	});
}

function onfinishedTests() {
	var output = page.evaluate(function() {
			return JSON.stringify(window.qunitDone);
	});
	phantom.exit(JSON.parse(output).failed > 0 ? 1 : 0);
}

function addLogging() {
	window.document.addEventListener( "DOMContentLoaded", function() {
		var xmlEncode = function (text) {
			text = text.replace(/&/g, '&amp;');
			text = text.replace(/\"/g, '&quot;');
			text = text.replace(/\'/g, '&apos;');
			text = text.replace(/</g, '&lt;');
			text = text.replace(/>/g, '&gt;');
			return text;
		};

		var moduleList = [];
		var getModule = function(moduleName) {
			if (!moduleList[moduleName]) {
				moduleList[moduleName] = {
					name: moduleName,
					time: 0,
					tests: [],
					failureCount: 0,
				};
			}
			return moduleList[moduleName];
		};
		var currentModuleName;

		QUnit.testStart(function(result) {
			currentModuleName = result.name;
		});

		QUnit.log(function(details) {
			var module = getModule(currentModuleName);
			var response = details.message || '';

			if (typeof details.expected !== 'undefined') {
				if (response) {
					response += ', ';
				}
				response += 'expected: ' + details.expected + ', but was: ' + details.actual;
			}
			module.tests.push({ moduleName: currentModuleName, name: details.message, result: details.result, message: response });
			if(!details.result) ++module.failureCount;
		});

		QUnit.done(function(result){
			console.log('<?xml version="1.0"?>');
			console.log('<testsuites>');
			for(moduleName in moduleList) {
				var module = moduleList[moduleName];
				console.log('  <testsuite timestamp="' + module.time + '" tests="' + module.tests.length + '" failures="' + module.failureCount + '" name="' + xmlEncode(module.name) + '">');
				for(testName in module.tests) {
					var test = module.tests[testName];
					console.log('    <testcase name="' + xmlEncode(test.name) + '" classname="' + xmlEncode(test.moduleName) + '">');
					if(!test.result) {
						console.log('      <failure>' + xmlEncode(test.message) + '</failure>');
					}
					console.log('    </testcase>');
				}
				console.log('  </testsuite>');
			}
			console.log('</testsuites>');
			console.log('<!--');
			console.log('Took ' + result.runtime +  'ms to run ' + result.total + ' tests. ' + result.passed + ' passed, ' + result.failed + ' failed.');
			console.log('-->');

			var total = 0;
			var covered = 0;
			try {
				for(fileName in _$jscoverage) {
					var covForFile = _$jscoverage[fileName];
					for(var i = 0; i < covForFile.length; ++i) {
						if(covForFile[i] !== undefined) {
							++total;
							if(covForFile[i] > 0) { ++covered; }
						}
					}
				}
			} catch(e) {}
			var coverage = { total: total, covered: covered};
			if(coverage.total > 0) {
				var percent = coverage.covered / coverage.total * 100;
				console.log("<!--");
				console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLCovered' value='" + coverage.covered + "']");
				console.log("##teamcity[buildStatisticValue key='CodeCoverageAbsLTotal ' value='" + coverage.total + "']");
				console.log("##teamcity[buildStatisticValue key='CodeCoverageL' value='" + percent + "']");
				console.log("-->");
			}
			window.qunitDone = result;
		});
	}, false );
}
