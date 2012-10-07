PasswordEvaluator = function() {
};

PasswordEvaluator.prototype = {
    strength: function(password) {
        var result = 0;
        if(password.length > 4) {
            ++result;
        }
        if(password.length > 8) {
            ++result;
        }
        var digitCount = (password.match(/\d/g) || []).length;
        var alphaCount = (password.match(/[a-zA-Z]/g) || []).length;
        var specialCount = password.length - digitCount - alphaCount;
        var categoryCount = 0;
        if(digitCount > 0) { ++categoryCount; }
        if(alphaCount > 0) { ++categoryCount; }
        if(specialCount > 0) { ++categoryCount; }
        if(categoryCount > 1) {
            ++ result;
        }
        if(categoryCount > 2) {
            ++result;
        }
        var lowerCount = (password.match(/[a-z]/g) || []).length;
        var upperCount = (password.match(/[A-Z]/g) || []).length;
        if(lowerCount > 0 && upperCount > 0) {
            ++result;
        }
        return result;
    }
};
