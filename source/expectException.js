// Note: this implementation is sufficient for use in this particular project, it is NOT meant for general reuse
var qunitTest = test;
var test = function(name, testFunction) {
    qunitTest(name, function() {
        try {
            testFunction();
            ok(false, "expected exception but got none");
        } catch(e) {
            equal(e, expectedException, "exception");
        }
    });
};

