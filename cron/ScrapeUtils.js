var CronJob = require('cron').CronJob;


module.exports = {
  startCronJob: function() {
    new CronJob('* * * * * *', function () {
      console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
  }
}