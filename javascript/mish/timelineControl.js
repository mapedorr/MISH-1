/**
 * This file controls the drawing and event handle over the <div id="timeline-container">
 */

/**
 * Function that draws the basic time ruler whether a saved timeline is loaded or is a new timeline.
 *
 * @returns {undefined}
 */
function drawTimeRuler() {
  //Get the center date of the timeline loaded by the user
  if (timelineJson
    && timelineJson.center_date) {
    center_date = moment(timelineJson.center_date, "DD-MM-YYYY");
  }
  clearTimeline();
  mishGA.zoomData.fillTimeRuler(center_date,null);
}

/**
 * Function thar erase all the content in the timeline ruler.
 *
 * @returns {undefined}
 */
function clearTimeline() {
  jQuery("#timeline-container").empty();
  //TODO: Maybe here it's necessary to also clear the array of groups in 'timeRulerGroups'
}

/*
 * 
 * @param {type} date
 * @param {type} widthAmount
 * @param {type} xPositionOfGroup
 * @returns {String}
 */
function createRulerGroup(date, widthAmount, xPositionOfGroup, push) {
  var groupID = 'mish-cellsGroup-' + date + '-' + (mishGA.timeRulerGroups.length + 1);
  var divObject = jQuery('<div/>', {
    id: groupID
    ,class: 'rulerGroup'
    ,width: widthAmount}).css("left", xPositionOfGroup);

  if (push) {
    mishGA.timeRulerGroups.push(divObject);
    divObject.appendTo("#timeline-container");
  } else {
    mishGA.timeRulerGroups.unshift(divObject);
    divObject.prependTo("#timeline-container");
  }

  return groupID;
}

/*
 * Function that draws the DIVs that represents a cell in the time ruler.
 * 
 * @param {type} id
 * @param {type} xPosition
 * @param {type} cellClass
 * @param {type} cellText
 * @param {type} groupID
 * @returns {undefined}
 */
function createTimelineCell(id, xPosition, cellClass, cellText, groupID, dateWidth) {
  jQuery('<div/>', {
    id: 'mish-label-' + id,
    class: 'label'
  }).text("" + cellText).appendTo(jQuery('<div/>', {
      id: 'mish-cell-' + id,
      class: cellClass}
  ).appendTo(jQuery('<div/>', {
      id: 'mish-' + id,
      class: 'date',
      groupedCells: (dateWidth / cellWidth)}).css({
      "left": "" + parseInt(xPosition) + "px",
      "width": dateWidth + "px"
  }).appendTo('#' + groupID)));
}


/**
 * Function that creates the DIVs for the grid of saved timelines for the
 * user logged in
 *
 * @returns {undefined}
 */
function loadUserTimelines() {

  col_cont = 1;

  $.each(user_timelines, function (key, value) {
    jQuery('<li/>', {
      id: 'timeline-' + key,
      "data-row": "1",
      "data-col": col_cont,
      "data-sizex": "1",
      "data-sizey": "1",
      "class": "loadedTimelineStyle",
      "onclick": "abrirTimelineClic(" + key + ")"
    }).text("" + value).appendTo(
      jQuery('#user-timelines-loaded-ul')
    );
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

    //Crea botón crear nuevo timeline
    jQuery('<li/>', {
      id: 'timeline-new-timeline',
      "data-row": "1",
      "data-col": "2",
      "data-sizex": "1",
      "data-sizey": "1",
      "class": "loadedTimelineStyle",
      "onclick": "nuevaTimeline()"
    }).text("Crear un nuevo timeline").appendTo(
      jQuery('#user-timelines-loaded-ul')
    );
  }

  jQuery(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140],
    autogenerate_stylesheet: true
  });
  //con esto estamos habilitando el overlay que oculta la pantalla cuando se cargan los timeline del usuario
  jQuery("#loaded-timelines-container").show();

  jQuery('#logInDialog').dialog('close');

}