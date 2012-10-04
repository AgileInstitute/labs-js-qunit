Model = function() {
};

Model.prototype = {
  getProduct: function(productId, callback) {
      jQuery.ajax("/product", {
          data: { productId : productId },
          success: function(data) {
              if(data.error) {
                  callback(data.error);
              } else {
                  callback(null, data.product);
              }
          },
          error: function() {
              callback(new Error("server connection failed"));
          }
      });
  }
};