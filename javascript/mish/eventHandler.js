/*
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 MOUSE ACTIONS
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */

/**
 * Function to handle the mouse events.
 *
 * @returns {undefined}
 */
function assignMouseEventsListeners() {
  var wah = document.getElementById("work-area-handler-sq");
  if (wah.addEventListener) {
    //IE9, Chrome, Safari, Opera
    wah.addEventListener("mousewheel", mouseScrollEvent, false);
    //Firefox
    wah.addEventListener("DOMMouseScroll", mouseScrollEvent, false);
  } else {
    //Others
    wah.attachEvent("onmousewheel", mouseScrollEvent);
  }

  //Assign behavior for showing and hiding the context menu
  jQuery("#work-area-handler-sq").bind("click", function (e) {
    jQuery("#canvasContextMenu").hide("fade", 200);
    return false;
  });
  jQuery("#work-area-handler-sq").bind("contextmenu", function (e) {
    jQuery("#canvasContextMenu").hide();
    jQuery("#canvasContextMenu").css('left', e.clientX);
    jQuery("#canvasContextMenu").css('top', e.clientY);
    jQuery("#canvasContextMenu").show("fade", 200);
    return false;
  });

  //Assign behavior of dragging the work area
  jQuery('#work-area-handler').draggable({
    axis: 'x',
    scroll: false,
    drag: function (event, ui) {

      var lastTimerulerXPos = jQuery('#timeline-container').position().left;
      mishGA.timeRulerXPos = parseInt(jQuery(this).position().left);
      jQuery('#timeline-container').css({left: (mishGA.timeRulerXPos) + "px"});

      var evaluateAdditionToRight = (lastTimerulerXPos > mishGA.timeRulerXPos)
        ? true
        : ( (lastTimerulerXPos < mishGA.timeRulerXPos)
          ? false
          : null );

      if (evaluateAdditionToRight !== null) {
        mishGA.zoomData.addGroupToTimeruler(evaluateAdditionToRight);
      }
    },
    stop: function (event, ui) {
      var leftAmount = 0 - parseInt(jQuery(this).position().left);
      jQuery('#work-area-handler-sq').css({left: leftAmount});
    }
  });
}

/**
 * Function called when the mouse wheel moves.
 *
 * @param {type} e
 * @returns {undefined}
 */
function mouseScrollEvent(e) {
  var zoomSubLevelChange = false;
  var zoomLevelChange = false;

  //cross-browser wheel delta
  var e = window.event || e; //old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  zoom_level += delta / Math.abs(delta);

  cellWidth += delta;
  mishGA.zoomData = getZoomData();




  //      updateZoomLevels();
  if (mishGA.zoomData.id !== mishGA.currentZoomSubLevel
    || mishGA.zoomData.parentId !== mishGA.currentZoomLevel) {
    //The ZOOM SUB LEVEL changes, do something
    zoomSubLevelChange = true;
    console.log("ZOOM SUB LEVEL CHANGE");

    if (mishGA.zoomData.id === 'PREV') {
      //It's time to change the Zoom LEVEL
      //The ZOOM LEVEL changes, do something
      zoomLevelChange = true;
      console.log("ZOOM LEVEL CHANGE");

      mishGA.currentZoomLevel--;
      mishGA.currentZoomSubLevel = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]].lastSubLevel;
      cellWidth = null;
      mishGA.zoomData = getZoomData();
    } else if (mishGA.zoomData.id === 'NEXT') {
      //The ZOOM LEVEL changes, do something
      zoomLevelChange = true;
      console.log("ZOOM LEVEL CHANGE");

      //It's time to change the Zoom LEVEL
      mishGA.currentZoomLevel++;
      mishGA.currentZoomSubLevel = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]].initialSubLevel;
      cellWidth = null;
      mishGA.zoomData = getZoomData();
    }

    mishGA.currentZoomSubLevel = mishGA.zoomData.id;
    mishGA.currentZoomLevel = mishGA.zoomData.parentId;

    if (delta > 0) {
      cellWidth = mishGA.zoomData.initialCellWidth;
    } else {
      cellWidth = mishGA.zoomData.lastCellWidth;
    }
  }






  var centerCellObj = findNearestCellToCenter();

  if (zoomSubLevelChange) {
    //Create a moment with the date of the nearest cell to the center
    var nearestCellToCenterDate = moment('' + centerCellObj.idText, "DDMMYYYY");

    if (zoomLevelChange) {
      clearTimeline();
    }

    //Call the function that fill the time ruler
    mishGA.zoomData.fillTimeRuler(nearestCellToCenterDate, centerCellObj.posX);
  } else {
    //Call the function that zoom the time ruler
    mishGA.zoomData.zoomTimeRuler(centerCellObj, delta);
  }

}

/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BUTTONS ACTIONS
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/**
 * Function that assigns listeners for all the buttons in the application.
 *
 * @returns {undefined}
 */
function assignButtonsListeners() {
  //Assign click event for Create User button
  jQuery("#buttCreateUser").click(function () {
    jQuery('#newUserDialog').dialog('open');
    closeMenu();
  });

  //Assign click event for Log In button
  jQuery("#buttLogIn").click(function () {
    jQuery('#logInDialog').dialog('open');
    closeMenu();
  });

  //Assign click event for Log In button
  jQuery("#buttLogOut").click(function () {
    logOutBtnAction();
    closeMenu();
  });

}

/**
 * Function that validates the Log In form and call the database operation that
 * logs the user.
 */
function logInBtnAction() {
  //Delete the timelines previously loaded
  jQuery('#user-timelines-loaded-ul').empty();

  //Hide the showed errors
  showErrorMsg("#errorLogin",false);

  //Boolean that show xor hide the error message
  var showError = false;

  //The ID of the error's container DIV
  var containerDIV = "#logInErrorMsg";

  //Delete the last error message
  clearErrorMessages(containerDIV);

  var username = jQuery("#registeredUserName").val();
  var password = jQuery("#registeredUserPassword").val();

  if (username === ""
    || password === "") {
    appendErrorMessage(containerDIV, "dialog.logIn.error.empty.fields");
    showError = true;
  }

  if (showError) {
    showErrorMsg("#errorLogin",true);
    user_loggedIn = false;
  } else {
    loginUser(username,password,function(err,userObj){
      if(err){
        appendErrorMessage(containerDIV, err.msg);
        showErrorMsg("#errorLogin",true);
        user_loggedIn = false;
        return;
      }

      closeDialog('#logInDialog');
      jQuery(".logout").show();
      jQuery(".login").hide();

      user_loggedIn = true;
      logged_user_id = userObj.user_id;
      user_timelines = userObj.timelines;

      loadUserTimelines();
    });
  }
}

/**
 * Function that validate the creation of a New User and call the database
 * operation function on success.
 *
 * TODO:
 *  - Incluir un campo para el correo electrónico
 *  - Realizar las validaciones de formato para cada campo
 *  - Si se puede, usar un indicador de nivel de seguridad de la contraseña
 *
 */
function createUserBtnAction() {
  //Hide the showed errors
  showErrorMsg("#errorCreateUser",false);

  //Boolean that show xor hide the error message
  var showError = false;

  //The ID of the error's container DIV
  var containerDIV = "#createUserErrorMsg";

  //Delete the last error message
  clearErrorMessages(containerDIV);

  //Create the object with the user data
  var newUserObj = {
    username: jQuery("#userName").val(),
    useremail: jQuery("#userEMail").val(),
    password: jQuery("#userPassword").val()
  };

  //Validate the user name
  if (newUserObj.username !== "") {
    //TODO: Validate format
  } else {
    appendErrorMessage(containerDIV, "dialog.createUser.error.username.empty");
    showError = true;
  }

  //Validate the password
  var passwordConfirm = jQuery("#userPasswordDos").val();
  if (newUserObj.password !== "") {
    //TODO: Validate format

    //Verify if password matches
    if (newUserObj.password !== passwordConfirm) {
      appendErrorMessage(containerDIV, "dialog.createUser.error.password.matches");
      showError = true;
    }
  } else {
    appendErrorMessage(containerDIV, "dialog.createUser.error.password.empty");
    showError = true;
  }

  if (showError) {
    showErrorMsg("#errorCreateUser",true);
  } else {
    createMISHUser(newUserObj,function(err,userId){
      if(err){
        appendErrorMessage(containerDIV, err.msg);
        showErrorMsg("#errorCreateUser",true);
        return;
      }

      user_loggedIn = true;

      jQuery(".logout").show();
      jQuery(".login").hide();

      logged_user_id = userId;
      closeDialog('#newUserDialog');
    });
  }
}

/**
 * Function that logout the user, cleaning all the information.
 */
function logOutBtnAction(){
  //Clear the information of the logged user
  next_user_id = 0;
  user_loggedIn = false;
  user_timelines = null;
  logged_user_id = 0;
  user_timelines_count = 0;

  //Restore the timeline ruler and canvas variables to defaults
  center_date = moment();

  mishJsonObjs.timelineJson = null;
  mishJsonObjs.eventsJsonElement = [];

  cellWidth = null;
  mishGA.currentZoomLevel = 6;
  mishGA.currentZoomSubLevel = 2;
  mishGA.zoomData = getZoomData();
  cellWidth = mishGA.zoomData.initialCellWidth;
  drawTimeRuler();

  jQuery(".logout").hide();
  jQuery(".login").show();

  user_loggedIn = false;
}

/**
 * Function that validates the fields for Creating a New Event and then
 * proceeds to send the data to the database.
 * 
 */
function createMISHEventBtnAction() {
  //Hide the showed errors
  showErrorMsg("#errorNewEvent",false);

  //Boolean that show xor hide the error message
  var showError = false;

  //The ID of the error's container DIV
  var containerDIV = "#newEventErrorMsg";

  //Delete the last error message
  clearErrorMessages(containerDIV);

  //Create an event object with the info of the new event
  var newEventObj = {
    "title": jQuery("#eventName").val(),
    "text": jQuery("#eventDescription").val(),
    "date": jQuery("#eventDate").val(),
    "time": (moment(jQuery("#eventDate").val(), "DD-MM-YYYY")).valueOf(),
    "image": jQuery("#eventImg").val(),
    "urllink": jQuery("#eventUrl").val()
  };

  if (newEventObj.title === "") {
    appendErrorMessage(containerDIV, "dialog.createEvent.error.eventName.empty");
    showError = true;
  }

  if (newEventObj.date === "") {
    appendErrorMessage(containerDIV, "dialog.createEvent.error.eventDate.empty");
    showError = true;
  }

  if (showError) {
    showErrorMsg("#errorNewEvent",true);
    user_loggedIn = false;
  } else {
    //Get the ID that the event will have
    var eventsArrayLastPos = mishJsonObjs.eventsJsonElement.length;
    var eventID = (eventsArrayLastPos === 0) ? 1 : mishJsonObjs.eventsJsonElement[eventsArrayLastPos - 1].id + 1;
    newEventObj.id = eventID;

    //Add the created event object to the array of events of the timeline
    mishJsonObjs.eventsJsonElement.push(newEvent);
  }
}

/**
 * Function that validates the fields for Creating a New Timeline and then
 * proceeds to send the data to the database.
 * 
 */
function createTimelineBtnAction() {
  //Hide the showed errors
  showErrorMsg("#errorSaveTimeline",false);

  //Boolean that show xor hide the error message
  var showError = false;

  //The ID of the error's container DIV
  var containerDIV = "#saveTimelineErrorMsg";

  //Delete the last error message
  clearErrorMessages(containerDIV);

  if (jQuery("#timelineName").val() === "") {
    appendErrorMessage(containerDIV, "dialog.createTimeline.error.timelineName");
    showError = true;
  }

  if (showError) {
    showErrorMsg("#errorSaveTimeline",true);
  } else {
    saveTimeline(function(err,createdTimeline){
      if(err){
        appendErrorMessage(containerDIV, err.msg);
        showErrorMsg("#errorSaveTimeline",true);
        return;
      }

      jQuery('#newTimelineDialog').dialog('close');
      // @TODO Create a success message...
    });
  }
}

/**
 * Function that saves the changes made in the timeline when it exists.
 * If the timeline doesn't exists, then it attempts to create it. But, if the
 * user isn't logged, then the function opens the dialog for creating a user, and,
 * after its creation the timeline is saved.
 * 
 */
function guardarTimeline() {
  jQuery(".alert-message").append("Se ha creado la línea de tiempo");
  jQuery(".alert-message-container").show("fade",450);
  var alertContainerWidth = jQuery(".alert-message-container").width();
  var alertContainerHeight = jQuery(".alert-message-container").height();
  var xPos = (mishGA.workAreaWidth / 2) - (alertContainerWidth / 2);
  var yPos = ((mishGA.workAreaHeight / 2) - (alertContainerHeight / 2)) - 50;
  jQuery(".alert-message-container").css({left:xPos,top:yPos});

  /*
  if (user_loggedIn) {
    jQuery("#newTimelineDialog").dialog('open');
  }
  else {
    jQuery("#buttCreateUser").click();
  }
  */
}

function abrirTimelineClic(timelineId) {
  readJSonTimeline(timelineId);
  jQuery("#loaded-timelines-container").hide();
}

function nuevaTimeline() {
  jQuery("#loaded-timelines-container").hide();
}

function closeMenu() {
  jQuery("#canvasContextMenu").hide();
  jQuery("#canvasContextMenu").css('left', 0);
  jQuery("#canvasContextMenu").css('top', 0);
}