/**
 Copyright Church of Crypto, Baron Nashor
 */
var moment = require('moment');
module.exports = {
  chartDailyCoinHistory: function(responseData) {
    const coinSymbol = Object.keys(responseData)[0];
    const historyData = responseData[coinSymbol];
    const ChartjsNode = require('chartjs-node');

    if (historyData.length === 0) {
      console.log("Empty data response");
    }

    const historyDataMap = historyData.map((dataItem) => ({y: dataItem.high, x: dataItem.time}));
    const historyLabels = historyData.map((dataItem)=>moment(dataItem.time).format("hh:mm"));

    const chartOptions = {
      "type": "line",
      "data": {
        "labels": historyLabels,
        "datasets": [{
          "data": historyDataMap,
          "borderWidth": 2,
          backgroundColor: 'rgb(103,110,117)',
          borderColor: 'rgb(0,176,241)',
        }]
      },
      "options": {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        elements: { point: { radius: 0 } },
        "pointRadius": 0,
        "scales": {
        "yAxes": [{
          gridLines: {
            display:false
          },
          drawOnChartArea: false,
          "ticks": {
            fontColor: "#ECECEC",
            fontSize: 12,
            fontWeight: "bold",
            maxTicksLimit: 4,
            "beginAtZero": false
          }
        }],
          "xAxes": [{
            display: false,
            gridLines: {
              display:false
            },
            drawOnChartArea: false
          }]
        }
      }
    }


    var chartNode = new ChartjsNode(180, 90);
    return chartNode.drawChart(chartOptions)
      .then(() => {
        // chart is created

        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
      })
      .then(buffer => {
        Array.isArray(buffer) // => true
        // as a stream
        return chartNode.getImageStream('image/png');
      })
      .then(streamResult => {
        // using the length property you can do things like
        // directly upload the image to s3 by using the
        // stream and length properties
        streamResult.stream // => Stream object
        streamResult.length // => Integer length of stream

        let filePath = 'public/images/charts/' + coinSymbol + '.png';

        return chartNode.writeImageToFile('image/png', 'public/images/charts/' + coinSymbol + '.png');
      })
      .then((file) => {
        writeFileToS3Location(coinSymbol);
        // chart is now written to the file path
        // ./testimage.png
      }).catch(function(err){
        console.log(err);
      });
  },

}

function writeFileToS3Location(coinSymbol) {
  var AWS = require('aws-sdk'),
    fs = require('fs');

  const coinURI = 'public/images/charts/' + coinSymbol + '.png';
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
    },function (err, resp) {
      console.log('Successfully uploaded package.');
    });
  });
}