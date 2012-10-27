CurrencyConverter = function() {
};

// Begin slide 105 (...Refactor...)
CurrencyConverter.prototype = {
    convert: function(value, from, to) {
        if(to === from) {
            return value;
        }
        return value * this.conversionRate(from, to);
    },
    conversionRate: function(from, to) {
        return 0.5000;
    }
};
// End slide 105