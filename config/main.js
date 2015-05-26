function saveOptions() {
  var options = {};
  //Add all textual values
  $('textarea, select, [type="hidden"], [type="password"], [type="text"]').each(function () {
    options[$(this).attr('id')] = $(this).val();
  });

  //Add all checkbox type values
  $('[type="radio"], [type="checkbox"]').each(function () {
    options[$(this).attr('id')] = $(this).is(':checked');
  });
  return options;
}

function getQueryParam(variable, defaultValue) {
  // Find all URL parameters
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    // If the query variable parameter is found, decode it to use and return it for use
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

$().ready(function () {
  $("#b-cancel").click(function () {
    console.log("Cancel");
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent('{}');
  });

  $("#b-submit").click(function () {
    console.log("Submit");

    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    var location = return_to + encodeURIComponent(JSON.stringify(saveOptions()));
    console.log("Warping to: " + location);
    console.log(location);
    document.location = location;
  });

  //Set form values to whatever is passed in.
  if (window.location.search.substring(1) !== "") {
    var obj = jQuery.parseJSON(decodeURIComponent(window.location.search.substring(1)));
    for (var key in obj) {
      console.log('key: ' + key + ', val: ' + obj[key]);
      $("#" + [key]).val(obj[key]);
      $("#" + [key]).val(obj[key]).slider("refresh");
    }
  }
});
