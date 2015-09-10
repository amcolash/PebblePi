var Timeline = require('pebble-api').Timeline;
var key = require('./key.js');
var debug = require('./debug.js').debug;
var myKey = key.sandboxKey;

var timeline = new Timeline({
  apiKey: myKey
});

module.exports.sendPin = function(userToken, pinId, pinTitle, pinBody) {
  var pin = new Timeline.Pin({
    id: pinId,
    time: new Date(),
    duration: 10,
    layout: new Timeline.Pin.Layout({
      type: Timeline.Pin.LayoutType.GENERIC_PIN,
      tinyIcon: Timeline.Pin.Icon.STOCKS_EVENT,
      title: pinTitle,
      body: pinBody
    })
  }).addAction(new Timeline.Pin.Action({
    title: 'Reboot Pi',
    type: Timeline.Pin.ActionType.OPEN_WATCH_APP,
    launchCode: 1
  }));

  timeline.sendUserPin(userToken, pin, function (err) {
    if (err) {
      return console.error(err);
    }

    if (debug) {
      console.log('Pin sent successfully!');
    }
  });
};

module.exports.sendSharedPin = function(topics, pinId, pinTitle, pinBody) {
  var pin = new Timeline.Pin({
    id: pinId,
    time: new Date(),
    duration: 10,
    layout: new Timeline.Pin.Layout({
      type: Timeline.Pin.LayoutType.GENERIC_PIN,
      tinyIcon: Timeline.Pin.Icon.STOCKS_EVENT,
      title: pinTitle,
      subtitle: pinBody
    })
  }).addAction(new Timeline.Pin.Action({
    title: 'Reboot Pi',
    type: Timeline.Pin.ActionType.OPEN_WATCH_APP,
    launchCode: 1
  }));

  timeline.sendSharedPin(topics, pin, function (err) {
    if (err) {
      return console.error(err);
    }

    if (debug) {
      console.log('Pin sent successfully!');
    }
  });
};
