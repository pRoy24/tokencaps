
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
  },

  writeFileToS3Location: function(coinSymbol, coinName) {
    var AWS = require('aws-sdk'),
      fs = require('fs');

    const coinURI = 'public/images/charts/' + coinName + '.png';
// For dev purposes only
    AWS.config.update({ accessKeyId: 'AKIAJELMCMBAAONTCKTQ', secretAccessKey: '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'});


    // Read in the file, convert it to base64, store to S3
    fs.readFile(coinURI, function (err, data) {
      if (err) {
        console.log(err);
        throw err;
      }


      var base64data = new Buffer(data, 'binary');

      var s3 = new AWS.S3();
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