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
    if(timelineJson
            && timelineJson.center_date){
        center_date = moment(timelineJson.center_date, "DD-MM-YYYY");
    }
    clearTimeline();
    fillTimeRuler(center_date);
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

/**
 * Function that fill the time ruler
 * 
 * @param {momnet} dateOfReference
 * @returns {undefined}
 */
function fillTimeRuler(dateOfReference){
    
    //Calculate the center of the window
    var center = jQuery(window).width() / 2;
    
    //Draw all the groups of the time ruler:
    //1. Calculate the x position for the first group ('center' will be used in this operation)
    //2. Loop from 10 months before the center date till 10 months after the center date
    
    //TODO: The second parameter have to be related to the zoom
    var firstGroupDate = dateOfReference.clone().subtract(10,'months');
    
    //TODO: The second parameter have to be related to the zoom
    var daysFromFirstGroup = dateOfReference.diff(firstGroupDate,'days');
    var initialXPos = (((daysFromFirstGroup * cellWidth) - cellWidth) * -1) + (center - (dateOfReference.date() * cellWidth));
    
    var groupToDraw = firstGroupDate.clone().startOf('month');
    var xPositionOfGroup = initialXPos - mishGA.timeRulerXPos;
    
    if(mishGA.timeRulerGroups.length === 0){
        for (var i = 0; i <= 20; i++){
            var widthOfGroup = groupToDraw.clone().endOf('month').date() * cellWidth;

            fillDateRange(1,//begin: All months start with 1
              widthOfGroup / cellWidth,//end
              0,//Initial xPos of the inner cells
              groupToDraw,//startDate
              true,//drawSeparator
              createRulerGroup(groupToDraw.format('MMYYYY'),//groupID
                  widthOfGroup,
                  xPositionOfGroup,
                  true)//PUSH the group in the groups array
            );
            xPositionOfGroup += widthOfGroup;
            groupToDraw.add(1,'month');
        }
    }else{
        mishGA.timeRulerGroups.forEach(function(value){
            //Remove the cells in the group
            value.children('.date').remove();
            
            var groupID = groupToDraw.format('MMYYYY');
            var widthOfGroup = groupToDraw.clone().endOf('month').date() * cellWidth;
            
            value.attr('id',groupID);
            value.width(widthOfGroup);
            value.css('left',xPositionOfGroup);
            
            fillDateRange(1,//begin: All months start with 1
              widthOfGroup / cellWidth,//end
              0,//xPos
              groupToDraw,//startDate
              true,//drawSeparator
              groupID//groupID
              );
            
            xPositionOfGroup += widthOfGroup;
            groupToDraw.add(1,'month');
        });
    }
    
    //Put a special style in the center date of the timeline
    var centerDateCellID = center_date.format('DDMMYYYY');
    jQuery("#mish-cell-" + centerDateCellID).attr("class",centerDateCssClass);
    jQuery("#mish-label-" + centerDateCellID).text(center_date.format('DD-MMMM-YYYY'));
    
    //Create the canvas if necessary
    if(mishGA.canvasObject === null){
        //Set the global X position in the window's center
        globalPosX = center;
        
        mishGA.canvasObject = canvasApp(globalPosX, globalPosY);
    }
}

/**
 * Function that creates a DIV to contain time ruler cells of a determined period of time
 * and save it in the array of groups 'timeRulerGroups'.
 * 
 * [note] The content of the DIV will depend of the Zoom level.
 * 
 * @returns {String} The created group's ID
 */
function createTimeRulerGroup(){
    var groupID = 'mish-cellsGroup-' + (mishGA.timeRulerGroups.length + 1);
    var divObject = jQuery('<div/>',{id: groupID,class: 'rulerGroup'});
    mishGA.timeRulerGroups[mishGA.timeRulerGroups.length] = divObject;
    divObject.appendTo("#timeline-container");
    return groupID;
}

/*
 * 
 * @param {type} date
 * @param {type} widthAmount
 * @param {type} xPositionOfGroup
 * @returns {String}
 */
function createRulerGroup(date,widthAmount,xPositionOfGroup,push){
    var groupID = 'mish-cellsGroup-' + date + '-' + (mishGA.timeRulerGroups.length + 1);
    var divObject = jQuery('<div/>',{id: groupID,class: 'rulerGroup',width: widthAmount}).css("left",xPositionOfGroup);

    if(push){
        mishGA.timeRulerGroups.push(divObject);
        divObject.appendTo("#timeline-container");
    }else{
        mishGA.timeRulerGroups.unshift(divObject);
        divObject.prependTo("#timeline-container");
    }
    
    return groupID;
}

/*
 * Function that create time ruler cells for an amount of days
 * 
 * @param {int} begin
 * @param {int end
 * @param {int} xPos
 * @param {Moment} startDate The first day of the month to draw (this depends of the ZOOM level)
 * @param {boolean} drawSeparator Indicates if the first cell to draw will be a separator cell
 * @param {String} groupID
 * @returns {undefined}
 */
function fillDateRange(begin, end, xPos, startDate, drawSeparator, groupID) {
    var daysToAdd = 0;
    for (var i = begin; i <= end; i++) {
        var theDay = startDate.clone().add('days', daysToAdd);
        var cellID = theDay.format('DDMMYYYY');
        if (i === begin && drawSeparator === true) {
            createTimelineCell(cellID, xPos, separatorDateCssClass, theDay.format('DD-MMMM-YYYY'), groupID);
            if(assignLeftLimit){
                //Asign the left limit of the time ruler
                timeRulerLeftLimit = cellID;
            }else{
                timeRulerRightLimit = cellID;
            }
        } else {
            createTimelineCell(cellID, xPos, normalDateCssClass, i, groupID);
        }
        daysToAdd++;
        xPos = xPos + cellWidth;
    }
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
function createTimelineCell(id, xPosition, cellClass, cellText, groupID) {
    jQuery('<div/>', {
        id: 'mish-label-' + id,
        class: 'label'
    }).text("" + cellText).appendTo(jQuery('<div/>', {
        id: 'mish-cell-' + id,
        class: cellClass}
    ).appendTo(jQuery('<div/>', {
        id: 'mish-' + id,
        class: 'date'}).css({
        "left": "" + parseInt(xPosition) + "px",
        "width": cellWidth + "px"}).appendTo('#' + groupID)));
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