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

// Begin slide 113 (Technique: "Obvious Implementation")
ConversionRates = function() {
    this.rates = [];
};

ConversionRates.prototype = {
    putRate: function(from, to, rate) {
        this.rates[from + to] = rate;
    },
    getRate: function(from, to) {
        return this.rates[from + to];
    }
};
// End slide 113