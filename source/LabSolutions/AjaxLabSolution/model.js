Model = function () {
};

Model.prototype = {
    getProduct: function (productId, callback) {
        jQuery.ajax("/product", {
            data: { productId : productId },
            success: function(response) {
                if (response.error) {
                    callback(response.error);
                } else {
                    callback(null, response.product);
                }
            },
            error: function() {
                callback(new Error("server connection failed"));
            }
        });
    },

    getOrder: function (orderId, callback) {
        var that = this;
        jQuery.ajax("/order", {
            data: { orderId : orderId },
            success: function (response) {
                if (response.error) {
                    callback(response.error);
                } else {
                    that.getProducts(response.order.productIds, function (error, products) {
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
            var that = this;
            this.getProduct(productIds[0], function (error, product) {
                if (error) {
                    callback(error);
                } else {
                    that.getProducts(productIds.slice(1), function (error, products) {
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
    }
};