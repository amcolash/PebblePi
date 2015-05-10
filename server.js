var express = require('express');

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
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    temp = stdout.substring(5);
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
  console.log('Example app listening at http://%s:%s', host, port);
});
