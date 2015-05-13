var express = require('express');
require("console-stamp")(console, "mm/dd HH:MM:ss");

var app = express();

app.get('/', function(req, res) {
  res.send({
    title: 'Hi There!',
    body: 'Hello from my Raspberry Pi!'
  });
});

app.get('/temp', function(req, res) {
  var temp = '';

  var exec = require('child_process').exec;
  exec('/opt/vc/bin/vcgencmd measure_temp', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout.replace(/(\r\n|\n|\r)/gm,''));
    console.log('stderr: ' + stderr.replace(/(\r\n|\n|\r)/gm,''));
    temp = stdout.substring(5).replace("'", ' °').replace('\n', '');
    if (error !== null) {
      console.log('exec error: ' + error);
      temp = 'Error getting current temp!';
    }

  res.json({
    title: 'Current Temperature',
    body: temp
  });

  });

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
