/**
 Copyright Church of Crypto, Baron Nashor
 */
var moment = require('moment');
module.exports = {
  chartDailyCoinHistory: function(responseData) {
    const coinSymbol = Object.keys(responseData)[0];
    const historyData = responseData[coinSymbol];
    const ChartjsNode = require('chartjs-node');


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
            fontSize: 16,
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

        // write to a file
        console.log("Charting image now");
        return chartNode.writeImageToFile('image/png', 'public/images/charts/'+coinSymbol+'.png');
      })
      .then(() => {
        // chart is now written to the file path
        // ./testimage.png
      });
  }
}