var myToken;
var subscribed = [];

/*
function sendUser() {
  console.log('Sending user');
//   var user = {
//     id: myToken
//   };

  var req = new XMLHttpRequest();
  req.open('PUT', 'http://pi.amcolash.com:3000/user', true);
//   req.setRequestHeader('Content-Type', 'application/json');
//   req.send(user);
  req.setRequestHeader('userid', myToken);
  req.send();
}
*/

Pebble.getTimelineToken(
  function (token) {
    console.log('My timeline token is ' + token);
    myToken = token;
  },
  function (error) { 
    console.log('Error getting timeline token: ' + error);
  }
);

getSubscriptions();

Pebble.addEventListener('appmessage', function(e) {
//   console.log('Received message: ' + JSON.stringify(e.payload));
//   subscribe('temperature');
});

Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('http://pi.amcolash.com/pebblepi/index.html' + getUrl());
});

Pebble.addEventListener('webviewclosed',
  function(e) {
    var configuration = JSON.parse(decodeURIComponent(e.response));
    console.log('Configuration window returned: ', JSON.stringify(configuration));
    
    for(var key in configuration) {
      var attrName = key;
      var attrValue = configuration[key];
      if (attrValue) {
        subscribe(attrName);
      } else {
        unsubscribe(attrName);
      }
    }
  }
);

function getUrl() {
  var url = '?';
  for (var i = 0; i < subscribed.length; i++) {
    url = url + subscribed[i] + '=true';
    if (i < subscribed.length - 1) {
      url += '&';
    }
  }
  console.log(url);
  return url;
}
  
function getSubscriptions() {
  Pebble.timelineSubscriptions(
    function (topics) {
      console.log('You are currently subscribed to: [' + topics.join(', ') + ']');
      subscribed = topics;
    },
    function (errorString) {
      console.error('Error getting subscriptions: ' + errorString);
    }
  );
}

function subscribe(topic) {
  if (subscribed.indexOf(topic) === -1) {
    Pebble.timelineSubscribe(topic, 
      function () { 
//         console.log('Now subscribed to ' + topic);
        getSubscriptions();
      }, 
      function (errorString) { 
        console.error('Error subscribing to topic: ' + errorString);
      }
    );
  } else {
//     console.log('Already subscribed to ' + topic);
  }
}

function unsubscribe(topic) {
  if (subscribed.indexOf(topic) !== -1) {
    Pebble.timelineUnsubscribe(topic, 
      function () { 
//         console.log('Now unsubscribed to ' + topic);
        getSubscriptions();
      }, 
      function (errorString) { 
        console.error('Error unsubscribing to topic: ' + errorString);
      }
    );
  } else {
//     console.log('Not subscribed to ' + topic);
  }
}