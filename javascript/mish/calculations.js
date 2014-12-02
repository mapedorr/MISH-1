/**
 * This file contains methods for calculations
 */

function calculateDistance(date1, date2) {
  var distance = (moment(date2).diff(moment(date1), '' + zoom_local));
  return (distance <= 0) ? distance : distance + 1;
}

/**
 * Function that calculate the center date of all the events in the timeline.
 *
 * @returns {*}
 */
function calcularCenterDate() {

  if (eventsJsonElement.length > 0) {
    var menor = null;
    var mayor = null;
    jQuery.each(eventsJsonElement, function (key, value) {
      var eventDateMoment = moment(value.date, "DD-MM-YYYY");
      if (menor == null) {
        menor = eventDateMoment;
      }
      else {
        if (eventDateMoment.isBefore(menor)) {
          menor = eventDateMoment;
        }
      }

      if (mayor == null) {
        mayor = eventDateMoment;
      }
      else {
        if (mayor.isBefore(eventDateMoment)) {
          mayor = eventDateMoment;
        }
      }

    });

    var mitad = menor.clone().add('' + zoom_local, calculateDistance(menor, mayor) / 2);
    return mitad.format('DD-MM-YYYY');
  }
  else {
    return null;
  }

}

/**
 * Function that search the nearest cell to the screen center and return
 * its X position and ID in an Object.
 *
 * @returns {{posX: *, idText: *}}
 */
function findNearestCellToCenter() {
  //Obtain the center of the window
  var center = jQuery(window).width() / 2;

  //Find the group in which the center is contained
  var timeRulerXPos = mishGA.timeRulerXPos;
  var groupOfCenter = mishGA.timeRulerGroups.filter(function (value) {
    var absoluteXPosOfGroup = value.position().left + timeRulerXPos;
    return absoluteXPosOfGroup <= center && (absoluteXPosOfGroup + value.width()) >= center;
  });

  //Find the cell in the group nearest to the center
  var xPosOfGroup = groupOfCenter[0].position().left + timeRulerXPos;
  var leftNearestValue = -1;
  var rightNearestValue = -1;
  var nearestCellToCenterIndex = -1;
  var cellsInGroup = groupOfCenter[0].children('.date');
  var elementPos = -1;//Posición en X de la celda más cercana al centro de la pantalla
  cellsInGroup.each(function (index, element) {
    //Get the X position of the current cell
    elementPos = jQuery(this).position().left + xPosOfGroup;

    //This is necessary for prevent errors when the center is contained in the last cell of the group
    nearestCellToCenterIndex = index;

    if (elementPos === center) {
      return false;//Break the loop
    } else if (elementPos < center) {
      leftNearestValue = elementPos;
    } else if (elementPos > center) {
      rightNearestValue = elementPos;
      //Calculate the nearest point to the center between 'leftNearestValue' and 'rightNearestValue'
      leftNearestValue = center - leftNearestValue;
      rightNearestValue = Math.abs(center - rightNearestValue);
      nearestCellToCenterIndex = (leftNearestValue <= rightNearestValue) ? (index - 1) : (index);
      return false;//Break the loop
    }
  });

  var nearestCellToCenter = jQuery(cellsInGroup[nearestCellToCenterIndex]);
  return {
    posX: nearestCellToCenter.position().left + xPosOfGroup,//Get the nearest cell to center X position for accurate calculations
    idText: (nearestCellToCenter.attr('id').split('-')[1])//Get the nearest cell to center ID for create a moment()
  };
}


function findGroupOfEvent(eventTime) {
  //1. Verify if the event date is between the first date and the last date of the time ruler groups
  if( eventTime < getTimeOfGroupId(mishGA.timeRulerGroups[0])
      || eventTime > getTimeOfGroupId(mishGA.timeRulerGroups[mishGA.timeRulerGroups.length - 1]) ){
    return;
  }

  //2. Search the group for the event date
  var groupOfDate = null;
  mishGA.timeRulerGroups.forEach(function(groupObj,index){
    if(eventTime >= getTimeOfGroupId(groupObj)){
      groupOfDate = groupObj;
    }
  });

  //3. Return the found group
  return groupOfDate;
}


function calculateXPosOfEvent(eventGroup,event){
  //1. Calculate the X position of the group
  var eventGroupXPos = mishGA.timeRulerXPos + eventGroup.position().left;

  //2. Calculate the X position of the event
  var eventXPos = mishGA.zoomData.calculateXPosOfEvent(getTimeOfGroupId(eventGroup),event.time);

  if(eventXPos !== null && eventGroupXPos !== null
      && eventXPos !== undefined && eventGroupXPos !== undefined){
    return eventXPos + eventGroupXPos;
  }
}
