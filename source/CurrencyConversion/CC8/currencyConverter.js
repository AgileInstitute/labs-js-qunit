CurrencyConverter = function() {
};

// Begin slide 104 (..."Fake It"...)
CurrencyConverter.prototype = {
    convert: function(value, from, to) {
        if(to === from) {
            return value;
        }
        return value * 0.5000;
    }
};
// End slide 104