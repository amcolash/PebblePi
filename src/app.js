var UI = require('ui');
var ajax = require('ajax');

var url = [
  'http://pi.amcolash.com:3000/temp'
];

var main = new UI.Menu({
  sections: [{
    title: 'PebblePi',
    items: [
      {
        title: 'Current Temp'
      }
    ]
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
      url: url[e.itemIndex],
      type: 'json'
    },
    
    function(data) {
      // Success!
      console.log('Successfully fetched data!');
      
      loading.hide();
      
      new UI.Card({
        title: data.title,
        subtitle: data.body,
        scrollable: true
      }).show();
    },
    
    function(error) {
      // Failure!
      console.log('Failed fetching data: ' + error);
      
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