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

