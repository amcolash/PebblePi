var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/PebblePi');
var timeline = require('./timeline.js');

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
      res.status(500).send('Error getting current temp');
    } else {
      res.status(200).json({
        title: 'Current Temperature',
        body: temp
      });
    }

  });

});

app.put('/user', function(req, res) {
  if (req.headers.userid) {
    res.status(200).send('Hooray, you are ' + req.headers.userid);

    console.log('Trying to add ' + req.headers.userid);

    var found = false;
    var users = db.get('users');
    users.find({ userid: req.headers.userid  }, function (err, doc) {
      console.log(doc);
      if (doc.length === 0) {
        console.log('Added new user');
        users.insert({'userid': req.headers.userid, 'subscriptions': []});
      }
    });

    /*
    users.find({}, {sort: {name: 1}}, function (err, doc) {
      // sorted by name field
      console.log(doc);
    });
    */

  } else {
    console.error('POST ERROR!');
    res.status(404).send('User error');
  }
});

/*
var users = db.get('users');
users.find({}, function (err, doc) {
  for (var i = 0; i < doc.length; i++) {
    console.log(doc[i]);
  }
});
*/

function updateTemperature() {
  console.log('Updating temperature pin');
  var temp = '';

  var exec = require('child_process').exec;
  exec('/opt/vc/bin/vcgencmd measure_temp', function(error, stdout, stderr) {
    temp = stdout.substring(5).replace("'", ' °').replace('\n', '');
    // topics, id, title, body
    timeline.sendSharedPin(['temperature'], 'temperaturePi2', 'Raspberry Pi 2 Temperature', temp);
  });
}

function updateStorage() {
  console.log('Updating storage pin');
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
  console.log('App listening at http://%s:%s', host, port);
});
