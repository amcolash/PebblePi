var express = require('express');
var timeline = require('./timeline.js');
var debug = require('./debug.js').debug;
var app = express();

require("console-stamp")(console, "mm/dd HH:MM:ss");

app.post('/reboot', function(req, res) {
  console.log('Headers: ' + JSON.stringify(req.headers));
  if (req.headers.password === '12345') {
    console.log('Rebooting now');
    res.status(200).send('Success, rebooting now');
    var exec = require('child_process').exec;
    exec('/sbin/reboot', function(error, stdout, stderr) {});
  } else {
    console.error('Unauthorized attempt at reboot!');
    res.status(404).send('Unauthorized');
  }
});

function updateTemperature() {
  if (debug) {
    console.log('Updating temperature pin');
  }

  var temp = '';

  var exec = require('child_process').exec;
  exec('/opt/vc/bin/vcgencmd measure_temp', function(error, stdout, stderr) {
    temp = stdout.substring(5).replace("'", ' °').replace('\n', '');
    // topics, id, title, body
    timeline.sendSharedPin(['temperature'], 'temperaturePi2', 'Raspberry Pi 2 Temperature', temp);
  });
}

function updateStorage() {
  if (debug) {
    console.log('Updating storage pin');
  }

  var storage = '';

  var exec = require('child_process').exec;
  exec("df -Pm | grep /dev/root | awk {'print $4'}", function(error, stdout, stderr) {
    storage = stdout.replace('\n', '') + ' mb';
    // topics, id, title, body
    timeline.sendSharedPin(['storage'], 'storagePi2', 'Raspberry Pi 2 Storage', storage);
  });
}

updateTemperature();
updateStorage();

setInterval(function() {
  updateTemperature();
  updateStorage();
}, 600000);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  if (debug) {
    console.log('App listening at http://%s:%s', host, port);
  }
});
