var UI = require('ui');
var ajax = require('ajax');

var url = 'http://jsonplaceholder.typicode.com/posts/';

var main = new UI.Menu({
  sections: [{
    items: [{
      title: 'Pebble.js',
      icon: 'images/menu_icon.png',
      subtitle: 'Can do Menus'
    }, {
      title: 'Second Item',
      subtitle: 'Subtitle Text'
    }]
  }]
});

main.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  var loading = new UI.Card({
    title: 'Loading...',
    subtitle: 'Please Wait'
  }).show();
  
  ajax(
    {
      url: url + (e.itemIndex + 1),
      type: 'json'
    },
    
    function(data) {
      // Success!
      console.log('Successfully fetched weather data!');
      
      loading.hide();
      
      new UI.Card({
        title: data.id + ': ' + data.title,
        subtitle: data.body,
        scrollable: true
      }).show();
    },
    
    function(error) {
      // Failure!
      console.log('Failed fetching weather data: ' + error);
      
      loading.hide();
      
      new UI.Card({
        title: 'Error!',
        subtitle: error,
        scrollable: true
      }).show();
    }
  );
  
});

main.show();