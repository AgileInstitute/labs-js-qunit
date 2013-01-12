CurrencyConverter = function(rates) {
    this.rates = rates;
};

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

ConversionRates = function() {
    this.rates = [];
};

ConversionRates.prototype = {
    putRate: function(from, to, rate) {
        this.rates[this.key(from, to)] = rate;
    },
    getRate: function(from, to) {
        var rate = this.rates[this.key(from, to)];
        if(rate === undefined) {
            throw "rate not found";
        }
        return rate;
    },
    key: function(from, to) {
        return from + "." + to;
    }
};
