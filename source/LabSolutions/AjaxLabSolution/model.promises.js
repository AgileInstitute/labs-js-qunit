Model = function () {
};

Model.prototype = {

    getProduct: function(productId)
    {
        return this.getSomething(
            "/product",
            {productId : productId},
            function(response) {
                return response.product;
            }
        );
    },

    getSomething: function(url, data, getResult) {
        var promise = jQuery.ajax(url, {data: data}).pipe(function(response) {
            if(response.error) {
                return $.Deferred().reject(response.error);
            }
            return getResult(response);
        },function(){
            return $.Deferred().reject(new Error("server connection failed"));
        });
        return promise;
    },

    getProducts: function (productIds) {
        var productPromises = [];
        for(i = 0; i < productIds.length; i += 1) {
            var productPromise = this.getProduct(productIds[i]);
            productPromises.push(productPromise);
        }
        var productsPromise = $.when.apply($, productPromises).pipe(function() {
            return Array.prototype.slice.call(arguments, 0);
        });
        return productsPromise;
    }
};