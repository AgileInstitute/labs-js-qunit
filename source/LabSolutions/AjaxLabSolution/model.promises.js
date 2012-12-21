Model = function () {
};

Model.prototype = {

    // Note: this method returns a promise
    getProduct: function(productId)
    {
        return this.fetchData({
            url: "/product",
            data: {productId : productId},
            extractResult: function(response) {
                return response.product;
            }
        });
    },

    // Note: this method returns a promise
    fetchData: function(options) {

        // Note: request the data from the backend
        var responsePromise = $.ajax(options.url, {data: options.data});

        var doneFilter = function(response) {
            if(response.error) {
                // Note: when the server response has .error, reject the promise with that error message
                return $.Deferred().reject(response.error);
            }
            // Note: otherwise extract the result from the server response
            return options.extractResult(response);
        };

        var failFilter = function(){
            // Note: when the server request fails, reject the promise with a generic error message
            return new Error("server connection failed");
        };

        // Note: apply the filters
        var resultPromise = responsePromise.pipe(doneFilter, failFilter);
        return resultPromise;
    },

    // Note: this method returns a promise
    getProducts: function (productIds) {

        // Note: get each of the products using individual promises
        var productPromises = [];
        for(i = 0; i < productIds.length; i += 1) {
            var productPromise = this.getProduct(productIds[i]);
            productPromises.push(productPromise);
        }

        // Note: create a promise that will receive the results of all the individual promises
        var productsPromise = $.when.apply($, productPromises).pipe(function() {

            // Note: this function receives each of the products as an argument, so convert all arguments into a single array and return that
            return Array.prototype.slice.call(arguments, 0);
        });
        return productsPromise;
    }
};