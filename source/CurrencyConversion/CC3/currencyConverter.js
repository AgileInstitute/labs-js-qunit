CurrencyConverter = function() {
};

// Begin slide 94 (Technique: "Fake It")
CurrencyConverter.prototype = {
    convert: function(value, from, to) {
        return 100.0;
    }
};
//End slide 94