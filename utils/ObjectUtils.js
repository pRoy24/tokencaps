
module.exports = {
  isNonEmptyObject: function(obj) {
    if (typeof(obj) === "undefined" || obj === null || Object.keys(obj).length === 0) {
      return false;
    }
    return true;
  },
  isNonEmptyArray: function(arr) {
    if (typeof arr === "undefined" || arr === null || arr === [] || arr.length === 0) {
      return false;
    }
    return true;
  }
}