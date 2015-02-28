/**
 * This file controls the drawing and event handle over the <div id="timeline-container">
 */

/**
 * Function called when a timeline is loaded. It assigns all the information needed for the draw of
 * the time ruler and the events to the respective objects of mishJsonObjs.
 *
 * @param jsonObj
 */
function timeLineJsonLoaded(jsonObj) {
  //1. Get the timeline information and assign it to the mishJsonObjs.timelineJson object
  mishJsonObjs.timelineJson = jsonObj.timeline;

  //2. Get the events of the loaded timeline
  mishJsonObjs.eventsJsonElement = mishJsonObjs.timelineJson.events;

  //2.1 Set some required information (if it's necessary) to the timeline events
  mishJsonObjs.eventsJsonElement.forEach(function (eventObj) {
    if (eventObj.date) {
      //0. If the event hasn't time information, calculate it
      if (!eventObj.time) {
        eventObj.time = moment(eventObj.date, 'DD-MM-YYYY').valueOf();
      }
    }
  });

  //3. Draw the time ruler and all the events
  drawTimeRuler();
}

/**
 * Function that draws the basic time ruler whether a saved timeline is loaded or is a new timeline.
 *
 * @returns {undefined}
 */
function drawTimeRuler() {
  //Get the center date of the timeline loaded by the user
  if (mishJsonObjs.timelineJson
    && mishJsonObjs.timelineJson.center_date) {
    center_date = moment(mishJsonObjs.timelineJson.center_date, "DD-MM-YYYY");
  }
  clearTimeline();
  mishGA.zoomData.fillTimeRuler(center_date, null);
}

/**
 * Function thar erase all the content in the timeline ruler.
 *
 * @returns {undefined}
 */
function clearTimeline() {
  jQuery("#timeline-container").empty();
  mishGA.timeRulerGroups = [];
}

/**
 * Function that creates a new group for containing cell of the time ruler.
 *
 * @param date
 * @param widthAmount
 * @param xPositionOfGroup
 * @param push
 * @returns {string}
 */
function createRulerGroup(date, widthAmount, xPositionOfGroup, push) {
  var groupID = 'mish-cellsGroup-' + date + '-' + (mishGA.timeRulerGroups.length + 1);
  var divObject = jQuery('<div/>', {
    id: groupID
    , class: 'rulerGroup'
    , width: widthAmount
  }).css("left", xPositionOfGroup);

  if (push) {
    mishGA.timeRulerGroups.push(divObject);
    divObject.appendTo("#timeline-container");
  } else {
    mishGA.timeRulerGroups.unshift(divObject);
    divObject.prependTo("#timeline-container");
  }

  return groupID;
}

/**
 * Function that draws the DIVs that represents a cell in the time ruler.
 *
 * @param id
 * @param xPosition
 * @param cellClass
 * @param cellText
 * @param groupID
 * @param dateWidth
 */
function createTimelineCell(id, xPosition, cellClass, cellText, groupID, dateWidth) {
  jQuery('<div/>', {
    id: 'mish-label-' + id,
    class: 'label'
  }).text("" + cellText).appendTo(jQuery('<div/>', {
      id: 'mish-cell-' + id,
      class: cellClass
    }
  ).appendTo(jQuery('<div/>', {
      id: 'mish-' + id,
      class: 'date',
      groupedCells: (dateWidth / cellWidth)
    }).css({
      "left": "" + parseInt(xPosition) + "px",
      "width": dateWidth + "px"
    }).appendTo('#' + groupID)));
}


/**
 * Function that creates the DIVs for the grid of saved timelines for the
 * user logged in
 *
 */
function loadUserTimelines() {
  var col_cont = 1;

  jQuery.each(user_timelines, function (key, value) {
    jQuery('<li/>', {
      "id": 'timeline-' + key,
      "data-row": "1",
      "data-col": col_cont,
      "data-sizex": "1",
      "data-sizey": "1",
      "class": "loadedTimelineStyle",
      "onclick": "abrirTimelineClic(" + key + ")"
    }).appendTo(
      jQuery('#user-timelines-loaded-ul')
    );

    jQuery('<span/>',{}).text(value.toUpperCase()).appendTo(
      jQuery('#timeline-' + key)
    );

    /*
    jQuery('<li/>', {
      "id": 'timeline-' + key,
      "data-row": "1",
      "data-col": col_cont,
      "data-sizex": "1",
      "data-sizey": "1",
      "class": "loadedTimelineStyle",
      "onclick": "abrirTimelineClic(" + key + ")"
    }).text( value.toUpperCase() ).appendTo(
      jQuery('#user-timelines-loaded-ul')
    );
    */


    col_cont++;
    user_timelines_count++;
  });

  if (col_cont == 1) {
    //Crea botón cargar ejemplos
    jQuery('<li/>', {
      id: 'timeline-load-samples',
      "data-row": "1",
      "data-col": "1",
      "data-sizex": "1",
      "data-sizey": "1",
      "class": "loadedTimelineStyle",
      "onclick": "loadSamplesClic()"
    }).text("Cargar Ejemplos").appendTo(
      jQuery('#user-timelines-loaded-ul')
    );
  }

  //Crea botón crear nuevo timeline
  jQuery('<li/>', {
    id: 'timeline-new-timeline',
    "data-row": "1",
    "data-col": col_cont,
    "data-sizex": "1",
    "data-sizey": "1",
    "class": "loadedTimelineStyle",
    "onclick": "nuevaTimeline()"
  }).text( "Crear un nuevo timeline".toUpperCase() ).appendTo(
    jQuery('#user-timelines-loaded-ul')
  );

  jQuery(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140]
  });

  //Con esto estamos habilitando el overlay que oculta la pantalla cuando se cargan los timeline del usuario
  jQuery("#loaded-timelines-container").show();

  jQuery('#logInDialog').dialog('close');

}