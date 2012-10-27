var qunitTest = test;
var test = function(name, testFunction) {
    qunitTest(name, function() {
        testFunction();
        var assertion = QUnit.config.current.assertions.pop();
        ok(assertion.message.indexOf("<span class='test-message'>expectedFailure</span>") >= 0, "message");
        equal(assertion.result, false, "failed");
    });
};

