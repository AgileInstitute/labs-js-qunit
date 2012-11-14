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

    getOrder: function (orderId, callback) {
        var self = this;
        jQuery.ajax("/order", {
            data: { orderId : orderId },
            success: function (response) {
                if (response.error) {
                    callback(response.error);
                } else {
                    self.getProducts(response.order.productIds, function (error, products) {
                        if (error) {
                            callback(error);
                        } else {
                            callback(null, { products: products});
                        }
                    });
                }
            },
            error: function () {
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
    },

    getProductsNonRecursive: function (productIds, callback) {
        var products = [];
        var errors = [];
        var i;
        var getProductCallback = function(error, product) {
            if(error) {
                errors.push(error);
                products.push(null);
            } else {
                products.push(product);
            }
            if(products.length === productIds.length) { // Note: now we've got them all
                callback(errors.length === 0 ? null : errors, products);
            }
        };
        for(i = 0; i < productIds.length; i += 1) {
            this.getProduct(productIds[i], getProductCallback);
        }
    },

    getProductPromise: function(productId)
    {
        return this.getSomethingPromise(
            "/product",
            {productId : productId},
            function(response) {
                return response.product;
            }
        );
    },

    getSomethingPromise: function(url, data, getResult) {
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

    getProductsPromise: function (productIds) {
        var productPromises = [];
        for(i = 0; i < productIds.length; i += 1) {
            var productPromise = this.getProductPromise(productIds[i]);
            productPromises.push(productPromise);
        }
        var productsPromise = $.when.apply($, productPromises).pipe(function() {
            return Array.prototype.slice.call(arguments, 0);
        });
        return productsPromise;
    }
};