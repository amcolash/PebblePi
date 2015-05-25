var Timeline = require('pebble-api').Timeline;
var timeline = new Timeline();

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
  });

  timeline.sendUserPin(userToken, pin, function (err) {
    if (err) {
      return console.error(err);
    }

    console.log('Pin sent successfully!');
  });
}
