// Begin slide 117 (Partially refactored)
CurrencyConverter = function(rates) {
    this.rates = rates;
};
// End slide 117

// Begin slide 118 (Replace the Hard-Coded Value)
CurrencyConverter.prototype = {
    convert: function(value, from, to) {
        if(to === from) {
            return value;
        }
        return value * this.conversionRate(from, to);
    },
    conversionRate: function(from, to) {
        return this.rates.getRate(from, to);
    }
};
// End slide 118

ConversionRates = function() {
    this.rates = [];
};

ConversionRates.prototype = {
    putRate: function(from, to, rate) {
        this.rates[this.key(from, to)] = rate;
    },
    getRate: function(from, to) {
        return this.rates[this.key(from, to)];
    },
    key: function(from, to) {
        return from + to;
    }
};
