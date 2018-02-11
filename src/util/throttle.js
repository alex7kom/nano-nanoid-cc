'use strict';

module.exports = function(func, wait) {
  var timeout = null;

  return function() {
    // eslint-disable-next-line no-invalid-this
    var ctx = this;
    var args = arguments;

    if (!timeout) {
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(ctx, args);
      }, wait);
    }
  };
};
