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
    //cuando el archivo php responde, entonces...
    mishJsonObjs.timelineJson = data.timeline;
    mishGA.timeRulerGroups = [];
    timeLineJsonSuccessRead();
  });
}


///Leer el archivo json de usuarios
function readJSonUser() {
  jQuery.get('/MISH/PHP/cuentaUsuarios.php', function (data) {
    if (data) {
      next_user_id = parseInt(data) + 1;
    }
  });
}

/**
 * Function that creates a new event and push it to the 'eventsJsonElement' array.
 *
 * @returns {undefined}
 */
function createMISHEvent() {
  //Get the ID that the event will have
  var eventsArrayLastPos = eventsJsonElement.length;
  var eventID = (eventsArrayLastPos === 0) ? 1 : eventsJsonElement[eventsArrayLastPos - 1].id + 1;

  //Create an event object with the info of the new event
  var newEvent = {
    "id": eventID,
    "title": jQuery("#eventName").val(),
    "text": "ToDo",
    "date": jQuery("#eventDate").val(),
    "time": (moment(jQuery("#eventDate").val(), "DD-MM-YYYY")).valueOf(),
    "image": jQuery("#eventImg").val(),
    "urllink": "ToDo"
  };

  //Add the created event object to the array of events of the timeline
  eventsJsonElement.push(newEvent);
}


function timeLineJsonSuccessRead() {
  eventsJsonElement = mishJsonObjs.timelineJson.events;
  colorsch_id = mishJsonObjs.timelineJson.color_scheme;
  readColorSchemeXML();
}


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


  drawTimeRuler();
}

function colorSchemeXMLReadError() {
  confirm("Hubo un error al intentar cargar el archivo XML para el color scheme");
}


function createMISHUser() {
  readJSonUser();
  //Creamos un objeto newuser con los datos del nuevo usuario
  var newuser = {
    "user_id": next_user_id,
    "user_name": jQuery("#userName").val(),
    "user_password": jQuery("#userPassword").val()
  };
//se envía este objeto al archivo PHP como un objeto tipo Json
  jQuery.ajax({
    "url": "PHP/addUser.php",
    "type": "POST",
    "data": {
      "newUserObject": JSON.stringify(newuser)
    },
    "dataType": "JSON"
  }).done(function (data) {
    confirm("fsdf " + JSON.parse(data).error);
  });
  user_loggedIn = true;
  logged_user_id = next_user_id;

}


function lookForUserLogIn() {


  var logInUser = {
    "user_name": jQuery("#registeredUserName").val(),
    "user_password": jQuery("#registeredUserPassword").val()
  };

  jQuery.ajax({
    "url": "PHP/validaUsuarioRegistrado.php",
    "type": "POST",
    "data": {
      "regUserObj": JSON.stringify(logInUser)
    },
    "dataType": "JSON"
  }).done(function (data) {

//
    if (data.error != "") {
      jQuery('#logInErrorMsg').empty();
      login_error = "El usuario y la contaseña no coinciden"
      jQuery('#logInErrorMsg').append("" + login_error);
      user_loggedIn = false;
      jQuery('#errorLogin').show();
    }
    else {
      user_loggedIn = true;
      logged_user_id = data.user_id;
      user_timelines = data.timelines;
      loadUserTimelines();
    }
  });


}


function guardarTimelineOnJson() {

  if (user_loggedIn) {
    var calcMitadResponse = calcularCenterDate();
    //confirm(calcMitadResponse);
    if (calcMitadResponse != null) {

      var newTimeline = {
        "timeline": {
          "timeline_id": user_timelines_count + 1,
          "timeline_name": jQuery("#timelineName").val(),
          "color_scheme": "01",
          "user_id": logged_user_id,
          "creation_date": moment().format("DD-MM-YYYY"),
          "center_date": calcMitadResponse,
          "zoom_level": zoom_local,
          "events": eventsJsonElement
        }
      };
      confirm("" + JSON.stringify(newTimeline));

      jQuery.ajax({
        "url": "PHP/saveTimeline.php",
        "type": "POST",
        "data": {
          "userNewTimeline": JSON.stringify(newTimeline)
        },
        "dataType": "JSON"
      }).done(function (data) {
        confirm(data);
        console.log(data);
      });
      jQuery('#newTimelineDialog').dialog('close');
    }
    else {
      confirm("Debe crear al menos un evento");
    }
  }
}