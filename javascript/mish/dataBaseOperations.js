/**
 * Function that looks for a user in the database and begins its session when when it is found.
 */
function logInUser() {
  var userData = {
    "user_name": jQuery("#registeredUserName").val(),
    "user_password": jQuery("#registeredUserPassword").val()
  };

  jQuery.ajax({
    "url": "PHP/validaUsuarioRegistrado.php",
    "type": "POST",
    "data": {
      "regUserObj": JSON.stringify(userData)
    },
    "dataType": "JSON"
  }).done(function (data) {
    if (data.error != "") {
      jQuery('#logInErrorMsg').empty();
      login_error = "El usuario y la contaseña no coinciden"
      jQuery('#logInErrorMsg').append("" + login_error);
      user_loggedIn = false;
      jQuery('#errorLogin').show();
    } else {
      user_loggedIn = true;
      logged_user_id = data.user_id;
      user_timelines = data.timelines;
      loadUserTimelines();
    }
  }).fail(function(){
    user_loggedIn = false;
  });
}

/**
 * Function that creates a new user and save it in database.
 */
function createMISHUser() {
  readJSonUser(function(){
    //1. Create the object with the information of the new user to create
    var newuser = {
      "user_id": next_user_id,
      "user_name": jQuery("#userName").val(),
      "user_password": jQuery("#userPassword").val()
    };

    //2. Send the object created to database
    jQuery.ajax({
      "url": "PHP/addUser.php",
      "type": "POST",
      "data": {
        "newUserObject": JSON.stringify(newuser)
      },
      "dataType": "JSON"
    }).done(function (data) {
      user_loggedIn = true;
      logged_user_id = next_user_id;
    }).fail(function(){
      //@todo Implement behaviour
    });
  });
}

/**
 * Function that reads the users in database for getting the ID to use in the creation of a new one.
 *
 * @param callback
 */
function readJSonUser(callback) {
  jQuery.get('/MISH/PHP/cuentaUsuarios.php', function (data) {
    if (data) {
      next_user_id = parseInt(data) + 1;
      if(callback){
        callback();
      }
    }
  });
}

/**
 * Function that save the current timeline in database.
 */
function saveTimeline() {
  if (user_loggedIn) {
    //1. Find the center date of all the events of the current timeline
    var centerDate = findCenterDate();

    if (centerDate != null) {
      //2. Create the object to save in database
      var newTimeline = {
        "timeline": {
          "timeline_id": user_timelines_count + 1,
          "timeline_name": jQuery("#timelineName").val(),
          "color_scheme": "01",//@todo Implement this
          "user_id": logged_user_id,
          "creation_date": moment().format("DD-MM-YYYY"),
          "center_date": calcMitadResponse,
          "zoom_level": zoom_local,
          "events": mishJsonObjs.eventsJsonElement
        }
      };

      //3. Send the object to database
      jQuery.ajax({
        "url": "PHP/saveTimeline.php",
        "type": "POST",
        "data": {
          "userNewTimeline": JSON.stringify(newTimeline)
        },
        "dataType": "JSON"
      }).done(function (data) {
        //@todo Implement behaviour
        jQuery('#newTimelineDialog').dialog('close');
      }).fail(function(){
        //@todo Implement behaviour
        jQuery('#newTimelineDialog').dialog('close');
      });
    } else {
      confirm("Debe crear al menos un evento");
    }
  }
}

/**
 * Function that opens a timeline saved as JSON with the ID received as parameter.
 *
 * @param id
 */
function readJSonTimeline(id) {
  var timelineToLoad = {
    "user_id": logged_user_id,
    "timeline_id": id
  };

  jQuery.ajax({
    "url": "PHP/openTimeline.php",
    "type": "POST",
    "data": {
      "objTimelineToLoad": JSON.stringify(timelineToLoad)
    },
    "dataType": "JSON"
  }).done(function (data) {
    //The PHP file has responded. Call the function that will use the data received.
    timeLineJsonLoaded(data);
  }).fail(function(){
    //@todo Implement what happens here
  });
}









/**
 * Function that reads the color schemes available in database.
 * @todo Change the implementation for read a JSON file instead of a XML file.
 */
function readColorSchemeXML() {
  jQuery.ajax({
    type: "GET",
    url: "color_schemes.xml",
    dataType: "xml",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    success: colorSchemeXMLSuccessRead,
    error: colorSchemeXMLReadError
  });
}
function colorSchemeXMLSuccessRead(xml) {
  jQuery(xml).find("color_schemes color_scheme[id|=" + colorsch_id + "]").each(function () {
    jQuery(this).children().each(function () {
      timeline_color_scheme [timeline_color_scheme.length] = jQuery(this).text();
    });
  });
}
function colorSchemeXMLReadError() {
  confirm("Hubo un error al intentar cargar el archivo XML para el color scheme");
}