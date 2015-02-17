/**
 * Function that looks for a user in the database and begins its session when it is found.
 * 
 * @param {string} username
 * @param {string} password
 * @param {function(err,obj)} callback
 */
function loginUser(username,password,callback){
  var userData = {
    "user_name": username,
    "user_password": password
  };

  var errObj = {msg:''};

  jQuery.ajax({
    "url": "PHP/validaUsuarioRegistrado.php",
    "type": "POST",
    "data": {
      "regUserObj": JSON.stringify(userData)
    },
    "dataType": "JSON"
  }).done(function (data){
    if (data.error != "") {
      errObj.msg = data.error;
      callback(errObj,null);
      return;
    }

    callback(null,data);
  }).fail(function(){
    errObj.msg = "error.operation";
    callback(errObj,null);
  });
}

/**
 * Function that creates a new user and save it in database.
 * 
 * @param {object} password
 * @param {function(err,obj)} callback
 */
function createMISHUser(userData,callback){
  readJSonUser(function(){
    //1. Create the object with the information of the new user to create
    var newUserObj = {
      "user_id": next_user_id,
      "user_name": userData.username,
      "user_e_mail": userData.useremail,
      "user_password": userData.password
    };

    var errObj = {msg:''};

    //2. Send the object created to database
    jQuery.ajax({
      "url": "PHP/addUser.php",
      "type": "POST",
      "data": {
        "newUserObject": JSON.stringify(newUserObj)
      },
      "dataType": "JSON"
    }).done(function (data) {
      if (data.error != "") {
        errObj.msg = data.error;
        callback(errObj,null);
        return;
      }

      if(!data.user){
        errObj.msg = "dialog.createUser.error.user.creation";
        callback(errObj,null);
        return;
      }

      callback(null,data.user['user_id']);
    }).fail(function(){
      errObj.msg = "error.operation";
      callback(errObj,null);
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
 * 
 * @param {function(err,object)} callback
 */
function saveTimeline(callback) {
  if (user_loggedIn) {
    var errObj = {msg:''};

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
          "center_date": centerDate,
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
        if (data.error != "") {
          errObj.msg = data.error;
          callback(errObj,null);
          return;
        }

        if(!data.timeline){
          errObj.msg = "dialog.createTimeline.error.timeline.creation";
          callback(errObj,null);
          return;
        }

        callback(null,data.timeline);
        return;

      }).fail(function(){
        errObj.msg = "error.operation";
        callback(errObj,null);
      });
    } else {
      errObj.msg = "dialog.createTimeline.error.noEvents";
      callback(errObj,null);
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