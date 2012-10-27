// Note: this implementation is sufficient for use in this particular project, it is NOT meant for general reuse
var qunitTest = test;
var test = function(name, testFunction) {
    qunitTest(name, function() {
        testFunction.apply(this);
        var assertion = QUnit.config.current.assertions.pop();
        if(assertion.message.indexOf("<span class='test-message'>expectedFailure</span>") >= 0) {
            equal(assertion.result, false, "failed");
        } else {
            QUnit.config.current.assertions.push(assertion);
        }
    });
};

