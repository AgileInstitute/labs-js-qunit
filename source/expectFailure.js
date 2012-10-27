var qunitTest = test;
var test = function(name, testFunction) {
    qunitTest(name, function() {
        testFunction();
        var assertion = QUnit.config.current.assertions.pop();
        if(assertion.message.indexOf("<span class='test-message'>expectedFailure</span>") >= 0) {
            equal(assertion.result, false, "failed");
        } else {
            QUnit.config.current.assertions.push(assertion);
        }
    });
};

