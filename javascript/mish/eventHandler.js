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
}

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
        jQuery("#canvasContextMenu").hide("fade",200);
        return false;
    });
    jQuery("#work-area-handler-sq").bind("contextmenu", function (e) {
        jQuery("#canvasContextMenu").hide();
        jQuery("#canvasContextMenu").css('left', e.clientX);
        jQuery("#canvasContextMenu").css('top', e.clientY);
        jQuery("#canvasContextMenu").show("fade",200);
        return false;
    });
    
    //Assign behavior of dragging the work area
    jQuery('#work-area-handler').draggable({
        axis:'x',
        scroll: false,
        drag: function(event,ui){
            mishGA.timeRulerXPos = parseInt(jQuery(this).position().left);
            jQuery('#timeline-container').css({left:(mishGA.timeRulerXPos) + "px"});
            
            //Determine if it is necessary to add a block of cells to the time ruler.
            //To do this, we take the X position of the first date in the first group
            //and subtract to that value 60 cells. With this, we ensure that a new group 
            //will be added only when the time ruler reach 60 cells of distance to the first date.            
            //A similar process is done for the last date of the last group.
            
            //0. Get the first group and it's X position
            var firstDateOfTimeRuler = mishGA.timeRulerGroups[0];
            var xPosFirstDate = firstDateOfTimeRuler.position().left;
            
            //If the time ruler X position is 60 cells to the right of the first date X position, then is time to add a group to the left
            if( ((xPosFirstDate + (cellWidth * 60)) * -1) <= mishGA.timeRulerXPos ){
                //It is necessary to add a group of cells to the left of the ruler >>>

                //1. Get the date for the new group
                var newGroupDate = moment(jQuery(firstDateOfTimeRuler.children('.date')[0]).attr('id').split('-')[1],"DDMMYYYY").subtract(1,'month');

                //2. Get the X position for the first date of the new group
                var widthOfNewGroup = newGroupDate.clone().endOf('month').date() * cellWidth;
                var xPosNewFirstDate = xPosFirstDate - widthOfNewGroup;

                //3. Create the new group of cells)
                fillDateRange(1,//begin: All months start with 1
                    widthOfNewGroup / cellWidth,//end
                    0,//Initial xPos of the inner cells
                    newGroupDate.clone().startOf('month'),//startDate
                    true,//drawSeparator
                    createRulerGroup(newGroupDate.format('MMYYYY'),//groupID
                        widthOfNewGroup,
                        xPosNewFirstDate,
                        false)//UNSHIFT the group in the groups array
                );

                //4. Remove the last right block of cells in the time ruler and remove the group in 'timeRulerGroups'
                mishGA.timeRulerGroups[mishGA.timeRulerGroups.length - 1].remove();
                mishGA.timeRulerGroups.pop();

                //5. Reassign the IDs for the groups in 'mishGA.timeRulerGroups'
                var counter = 1;
                mishGA.timeRulerGroups.forEach(function(value){
                    var idParts = value.attr('id').split('-');
                    idParts[3] = counter;
                    value.attr('id',idParts.join('-'));
                    counter++;
                });
                
            }

            //0. Get the last group and it's X position
            var lastDateOfTimeRuler = mishGA.timeRulerGroups[mishGA.timeRulerGroups.length - 1];
            var xPosLastDate = lastDateOfTimeRuler.position().left;

            //If the time ruler X position is 30 cells to the left of the last date X position, then is time to add a group to the right
            if( (xPosLastDate - (cellWidth * 90)) <= (mishGA.timeRulerXPos * -1) ){
                //It is necessary to add a group of cells to the right of the ruler >>>

                //1. Get the date for the new group
                var newGroupDate = moment(jQuery(lastDateOfTimeRuler.children('.date')[0]).attr('id').split('-')[1],"DDMMYYYY").add(1,'month');

                //2. Get the X position for the first date of the new group
                var widthOfNewGroup = newGroupDate.clone().endOf('month').date() * cellWidth;
                var xPosNewLastDate = xPosLastDate + lastDateOfTimeRuler.width();

                //3. Create the new group of cells)
                fillDateRange(1,//begin: All months start with 1
                    widthOfNewGroup / cellWidth,//end
                    0,//Initial xPos of the inner cells
                    newGroupDate.clone().startOf('month'),//startDate
                    true,//drawSeparator
                    createRulerGroup(newGroupDate.format('MMYYYY'),//groupID
                        widthOfNewGroup,
                        xPosNewLastDate,
                        true)//PUSH the group in the groups array
                );

                //4. Remove the first left block of cells in the time ruler and remove the group in 'timeRulerGroups'
                mishGA.timeRulerGroups[0].remove();
                mishGA.timeRulerGroups.shift();

                //5. Reassign the IDs for the groups in 'mishGA.timeRulerGroups'
                var counter = 1;
                mishGA.timeRulerGroups.forEach(function(value){
                    var idParts = value.attr('id').split('-');
                    idParts[3] = counter;
                    value.attr('id',idParts.join('-'));
                    counter++;
                });
            }
        },
        stop: function(event, ui){
            var leftAmount = 0 - parseInt(jQuery(this).position().left);
            jQuery('#work-area-handler-sq').css({left:leftAmount});
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
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    zoom_level += delta / Math.abs(delta);

    if (zoom_level <= 12 && zoom_level >= -10) {
        var as = getZoomDesc(zoom_level);
        jQuery("#zoom").text(zoom_level + as);
        cellWidth = cellWidth + delta;
        
        
        
        //Obtain the center of the window
        var center = jQuery(window).width()/2;
        
        //Find the group in which the center is contained
        var timeRulerXPos = mishGA.timeRulerXPos;
        var groupOfCenter = mishGA.timeRulerGroups.filter(function (value){
            var absoluteXPosOfGroup = value.position().left + timeRulerXPos;
            return absoluteXPosOfGroup <= center && (absoluteXPosOfGroup + value.width()) >= center;
        });
        
        //Find the cell in the group nearest to the center
        var xPosOfGroup = groupOfCenter[0].position().left + timeRulerXPos;
        var leftNearestValue = -1;
        var rightNearestValue = -1;
        var nearestCellToCenterIndex = -1;
        var cellsInGroup = groupOfCenter[0].children('.date');
        cellsInGroup.each(function(index,element){
            //Get the X position of the current cell
            var elementPos = jQuery(this).position().left + xPosOfGroup;
            
            //This is necessary for prevent errors when the center is contained in the last cell of the group
            nearestCellToCenterIndex = index;
            
            if(elementPos === center){
                return false;//Break the loop
            }else if(elementPos < center){
                leftNearestValue = elementPos;
            }else if(elementPos > center){
                rightNearestValue = elementPos;
                //Calculate the nearest point to the center between 'leftNearestValue' and 'rightNearestValue'
                leftNearestValue = center - leftNearestValue;
                rightNearestValue = Math.abs(center - rightNearestValue);
                nearestCellToCenterIndex = (leftNearestValue <= rightNearestValue) ? (index - 1) : (index) ;
                return false;//Break the loop
            }
        });
        
        //Create a moment with the date of the nearest cell to the center
        var nearestCellToCenterDate = moment(''+(jQuery(cellsInGroup[nearestCellToCenterIndex]).attr('id').split('-')[1]),"DDMMYYYY");
        
        //Call the function that fill the time ruler
        fillTimeRuler(nearestCellToCenterDate);
    }
    else {
        zoom_level -= delta / Math.abs(delta);
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
 * 
 * @returns {undefined}
 */
function createUserBtnAction() {
    //Boolean that show xor hide the error message
    var showError = false;
    //The ID of the error's container DIV
    var containerDIV = "#createUserErrorMsg";
    
    //Delete the last error message
    clearErrorMessages(containerDIV);

    //Validate the user name
    if (jQuery("#userName").val() !== "") {
        //TODO: Validate format
    } else {
        appendErrorMessage(containerDIV, "dialog.createUser.error.username.empty");
        showError = true;
    }

    //Validate the password
    if (jQuery("#userPassword").val() !== "") {
        //Validate format
        
        //Verify if password matches
        if (jQuery("#userPassword").val() !== jQuery("#userPasswordDos").val()) {
            appendErrorMessage(containerDIV, "dialog.createUser.error.password.matches");
            showError = true;   
        }
    } else {
        appendErrorMessage(containerDIV, "dialog.createUser.error.password.empty");
        showError = true;
    }

    if (showError) {
        jQuery("#errorCreateUser").show("blind",300);
    } else {
        createMISHUser();
        jQuery("#errorCreateUser").hide();
        closeDialog('#newUserDialog');
    }
}

/**
 * Function that validates the Log In form and call the database operation that
 * log the user.
 * 
 * @returns {undefined}
 */
function logInBtnAction() {
    //Boolean that show xor hide the error message
    var showError = false;
    //The ID of the error's container DIV
    var containerDIV = "#logInErrorMsg";
    
    //Delete the last error message
    clearErrorMessages(containerDIV);

    if (jQuery("#registeredUserName").val() === ""
            || jQuery("#registeredUserPassword").val() === "") {
        appendErrorMessage(containerDIV, "dialog.logIn.error.empty.fields");
        showError = true;
    }
    
    if (showError) {
        jQuery("#errorLogin").show("fade",200);
        user_loggedIn = false;
    } else {
        lookForUserLogIn();
        jQuery("#errorLogin").hide();
        closeDialog('#logInDialog');
    }
}

/**
 * Function that validates the fields for Creating a New Event and then 
 * proceeds to send the data to the database.
 * 
 * @returns {undefined}
 */
function createMISHEventBtnAction(){
    //Boolean that show xor hide the error message
    var showError = false;
    //The ID of the error's container DIV
    var containerDIV = "#newEventErrorMsg";
    
    //Delete the last error message
    clearErrorMessages(containerDIV);
    
    if ($("#eventName").val() === "") {
        appendErrorMessage(containerDIV, "dialog.createEvent.error.eventName.empty");
        showError = true;
    } else {
        //Validate format
    }
    
    if ($("#eventDate").val() === "") {
        appendErrorMessage(containerDIV, "dialog.createEvent.error.eventDate.empty");
        showError = true;
    } else {
        //Validate format
    }
    
    if (showError) {
        jQuery("#errorNewEvent").show("blind",300);
        user_loggedIn = false;
    } else {
        createMISHEvent()
        jQuery("#errorNewEvent").hide();
        closeDialog('#newEventDialog');
    }
}

/**
 * Function that validates the fields for Creating a New Timeline and then 
 * proceeds to send the data to the database.
 * 
 * @returns {undefined}
 */
function createTimelineBtnAction() {
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
        jQuery("#errorSaveTimeline").show("blind",300);
        user_loggedIn = false;
    } else {
        guardarTimelineOnJson();
        jQuery("#errorSaveTimeline").hide();
        closeDialog('#newTimelineDialog');
    }
}














function guardarTimeline() {
    if (user_loggedIn) {
        jQuery("#newTimelineDialog").dialog('open');
    }
    else {
        jQuery("#buttCreateUser").click();
    }
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