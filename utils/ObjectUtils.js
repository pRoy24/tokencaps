// pRoy24 tokenplex

module.exports = {
  isNonEmptyObject: function(obj) {
    if (typeof(obj) === "undefined" || obj === null || Object.keys(obj).length === 0) {
      return false;
    }
    return true;
  },
  isNonEmptyArray: function(arr) {
    if (typeof arr === "undefined" || arr === null || arr.length === 0) {
      return false;
    }
    return true;
  },

  isEmptyString: function(str) {
    if (typeof str === "undefined" || str === null || str.length === 0) {
      return true;
    }
    return false;
  },

  writeFileToS3Location: function(coinSymbol, coinName) {
    var AWS = require('aws-sdk'),
      fs = require('fs');
    const coinURI = 'public/images/charts/' + coinName + '.png';
    // For dev purposes only
    // Add AWS Config
    // Read in the file, convert it to base64, store to S3
    fs.readFile(coinURI, function (err, data) {
      if (err) {
        // Silently absorb write error for now
        // TODO handle upload to S3 error
        console.log(err);
      }
      const base64data = new Buffer(data, 'binary');
      const s3 = new AWS.S3();
      s3.upload({
        Bucket: 'images.tokenplex.io',
        Key: coinSymbol+".png",
        Body: base64data,
        ACL: 'public-read'
      },function (resp) {
        console.log(arguments);
        console.log('Successfully uploaded package.');
      });
    });
  }
}