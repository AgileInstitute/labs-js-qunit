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

ConversionRates = function() {
    this.rates = [];
};

// Begin slide 114 (Isolate Behavior)
ConversionRates.prototype = {
    putRate: function(from, to, rate) {
        this.rates[this.key(from, to)] = rate;
    },
    getRate: function(from, to) {
        return this.rates[this.key(from, to)];
    },
    key: function(from, to) {
        return from + "." + to;
    }
};
// End slide 114