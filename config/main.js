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

$().ready(function () {
  $("#b-cancel").click(function () {
    console.log("Cancel");
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to;
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
      $("#" + [key]).val(obj[key]);
      $("#" + [key]).val(obj[key]).slider("refresh");
    }
  }
});
