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
var logList = [];

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	logList.push(msg);
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
	var qunitDone = page.evaluate(function() {
		return JSON.stringify(window.qunitDone);
	});
    var output = page.evaluate(function() {
        return window.output;
    });
    for(var i = 0; i < output.length; ++i) {
        console.log(output[i]);
    }
    if(logList.length > 0) {
        console.log("<!-- console.log() output:");
        for(var i = 0; i < logList.length; ++i) {
            console.log(logList[i]);
        }
        console.log("-->")
    }
	phantom.exit(JSON.parse(qunitDone).failed > 0 ? 1 : 0);
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
            window.output = [];
            window.output.push('<?xml version="1.0"?>');
			window.output.push('<testsuites>');
			for(moduleName in moduleList) {
				var module = moduleList[moduleName];
				window.output.push('  <testsuite timestamp="' + module.time + '" tests="' + module.tests.length + '" failures="' + module.failureCount + '" name="' + xmlEncode(module.name) + '">');
				for(testName in module.tests) {
					var test = module.tests[testName];
					window.output.push('    <testcase name="' + xmlEncode(test.name) + '" classname="' + xmlEncode(test.moduleName) + '">');
					if(!test.result) {
						window.output.push('      <failure>' + xmlEncode(test.message) + '</failure>');
					}
					window.output.push('    </testcase>');
				}
				window.output.push('  </testsuite>');
			}
			window.output.push('</testsuites>');
			window.output.push('<!--');
			window.output.push('Took ' + result.runtime +  'ms to run ' + result.total + ' tests. ' + result.passed + ' passed, ' + result.failed + ' failed.');
			window.output.push('-->');

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
				window.output.push("<!--");
				window.output.push("##teamcity[buildStatisticValue key='CodeCoverageAbsLCovered' value='" + coverage.covered + "']");
				window.output.push("##teamcity[buildStatisticValue key='CodeCoverageAbsLTotal ' value='" + coverage.total + "']");
				window.output.push("##teamcity[buildStatisticValue key='CodeCoverageL' value='" + percent + "']");
				window.output.push("-->");
			}
			window.qunitDone = result;
		});
	}, false );
}
