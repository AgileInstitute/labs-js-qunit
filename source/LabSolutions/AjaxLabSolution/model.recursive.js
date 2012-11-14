Model = function () {
};

Model.prototype = {
    getProduct: function(productId, callback) {
        this.getSomething(
            "/product",
            {productId : productId},
            function(response) {
                return response.product;
            },
            callback);
    },

    getSomething: function(url, data, getResult, callback) {
        jQuery.ajax(url, {
            data: data,
            success: function(response) {
                if(response.error) {
                    callback(response.error);
                } else {
                    callback(null, getResult(response));
                }
            },
            error: function() {
                callback(new Error("server connection failed"));
            }
        });
    },

    getProducts: function (productIds, callback) {
        if (productIds.length === 0) {
            callback(null, []);
        } else {
            var self = this;
            this.getProduct(productIds[0], function (error, product) {
                if (error) {
                    callback(error);
                } else {
                    self.getProducts(productIds.slice(1), function (error, products) {
                        if (error) {
                            callback(error);
                        } else {
                            products.unshift(product); // Note: add product at front of products
                            callback(null, products);
                        }
                    });
                }
            });
        }
    }
};