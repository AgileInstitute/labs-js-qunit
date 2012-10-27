CurrencyConverter = function() {
};

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

// Begin slide 112 (Fail)
ConversionRates = function() {
};

ConversionRates.prototype = {
    putRate: function(from, to, rate) {
    },
    getRate: function(from, to) {
        return 0;
    }
};
// End slide 112