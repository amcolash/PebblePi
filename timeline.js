var Timeline = require('pebble-api').Timeline;

var timeline = new Timeline();

var userToken = 'SBMAFLFtyTVTXyXbh6KBinNNOZbpxg31';

var pin = new Timeline.Pin({
  id: (new Date().getTime()).toString(),
  time: new Date(),
  duration: 10,
  layout: new Timeline.Pin.Layout({
    type: Timeline.Pin.LayoutType.GENERIC_PIN,
    tinyIcon: Timeline.Pin.Icon.NOTIFICATION_FLAG,
    title: 'Hello Timeline!',
    body: 'This is my first pin :)'
  })
});

timeline.sendUserPin(userToken, pin, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log('Pin sent successfully!');
});
