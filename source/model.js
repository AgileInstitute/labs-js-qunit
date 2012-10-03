Model = function() {
};

Model.prototype = {
  getProduct: function(productId, callback) {
      // Note: no ajax because we do not rely on server code this time
      setTimeout(function() {
          if(productId === 4711) {
              var product = { name: 'Lars'};
              callback(null, product);
          } else {
              callback(new Error("product with id " + productId + " not found"));
          }
      }, 2000);
  }
};