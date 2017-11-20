// pRoy24 TokenPlex

module.exports = {
  getUserAuthToken: function(headers) {
    const headerParts = req.headers.authorization.split(' ')
    let token = "";
    if (headerParts[0].toLowerCase() === 'bearer') {
      token = headerParts[1];
    }
    return token;
  }
}