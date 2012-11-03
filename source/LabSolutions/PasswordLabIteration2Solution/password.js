PasswordEvaluator = function () {
    this.rules = [ PasswordEvaluator.longEnough, PasswordEvaluator.mixedCategories ];
};

PasswordEvaluator.validationResult = function (valid, message) {
    return { valid: valid, message: message };
};

PasswordEvaluator.longEnough = function (password) {
    return PasswordEvaluator.validationResult(password.length > 4, "more than 4 characters");
};

PasswordEvaluator.mixedCategories = function (password) {
    var digitCount = (password.match(/\d/g) || []).length;
    var alphaCount = (password.match(/[a-zA-Z]/g) || []).length;
    return PasswordEvaluator.validationResult(digitCount > 0 && alphaCount > 0, "mix of letters and digits");
};

PasswordEvaluator.prototype = {
    evaluate: function (password) {
        var failedRules = [];
        var i;
        for (i = 0; i < this.rules.length; i += 1) {
            var rule = this.rules[i];
            var result = rule(password);
            if (!result.valid) {
                failedRules.push(result.message);
            }
        }
        return { valid: failedRules.length === 0, failedRules: failedRules };
    }
};
