/**
 * Created by Delly on 5/02/14.
 */
/*
 ------------------------------------------------------------------------
 ----------   CANVAS   --------------------------------------------------
 ------------------------------------------------------------------------
 ------------------------------------------------------------------------
 */
function canvasSupport () {
    return Modernizr.canvas;
}

function canvasApp(x,y) {
    if (!canvasSupport()) {
        return;
    }else{
        var theCanvas = document.getElementById('maincanvas');
        var context = theCanvas.getContext('2d');
        theCanvas.setAttribute("width",jQuery(window).width());
        theCanvas.setAttribute("height",jQuery(window).height());

        setInterval(drawScreen, 1);
    }

    var mouseX;
    var mouseY;

    //Function that draw in the canvas
    function drawScreen () {
        drawEvents();
    }

    function drawEvents(){
        //Clean the canvas for smooth lines
        context.clearRect(0, 0, theCanvas.width, theCanvas.height);

        $.each(eventsJsonElement, function (key, value){
            if(value.date){
                var eventMoment = moment(value.date,"DD-MM-YYYY");
                var eventPosX = jQuery("#mish-"+eventMoment.format("DDMMYYYY")).position().left;
                var posTimelineContainer = jQuery("#timeline-container").position().left;
                eventPosX = (eventPosX + posTimelineContainer);

                //var distanceFromStartDate =  calculateDistance(center_date,eventMoment)*cellWidth;

                drawLineToTimeline(eventPosX,globalPosY);
                drawEvent(eventPosX,globalPosY);
            }
        });
    }

    function drawEvent (event_posX,event_posY) {

        if( event_posX < jQuery(window).width()
            && event_posX >= 0) {
            //Define the properties of the event to draw
            context.lineWidth = 10;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = "" + (timeline_color_scheme) ? timeline_color_scheme[1] : "GRAY";
            context.fillStyle = "" + (timeline_color_scheme) ? timeline_color_scheme[1] : "GRAY";
            context.setLineDash([0]);

            //Draw the event
            context.beginPath();
            //context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            context.arc(event_posX, event_posY, 10, 0, Math.PI * 2, false);
            context.fill();
            context.stroke();
            context.closePath();
        }

    }

    function drawLineToTimeline(event_posX,event_posY){
        if( event_posX < jQuery(window).width()
            && event_posX >= 0) {
            //Define the properties for the line to the timeline
            context.lineWidth = 1;
            context.lineCap = 'square';
            context.lineJoin = 'square';
            context.strokeStyle = "" + (timeline_color_scheme) ? timeline_color_scheme[0] : "GRAY";
            context.setLineDash([5, 10]);

            //Draw the dashed line to de timeline
            context.beginPath();
            context.moveTo(event_posX, event_posY);
            context.lineTo(event_posX, event_posY + 2000);
            context.stroke();
            context.closePath();
        }

    }

    /*
    ----------------------------------------------------
    --------------------------------------------
    -----------------------------------
    --------------------------
    Mouse handle events
     */

    function onMouseMove(e){
        mouseX = e.clientX - theCanvas.offsetLeft;
        mouseY = e.clientY - theCanvas.offsetTop;


    }

    function onMouseClick(e){
        //var imageData = context.getImageData(mouseX,mouseY,10,10);
    }

    theCanvas.addEventListener("mousemove",onMouseMove,false);
    theCanvas.addEventListener("click", onMouseClick,false);
}


function loadMenus() {
    jQuery("#menu").menu();

    //Load newEventForm.html
    $("#dialog-form").load("Forms/newEventForm.html" , function(){
        $("#errorNewEvent").hide();
        jQuery("#newEventCancel").click(function(){closeForm("#dialog-form")});

    });
    $("#dialog-form").dialog({
        autoOpen: false
    });

    //Load newUserForm.html
    $("#dialog-form-user").load("Forms/newUserForm.html", function() {
        $("#errorCreateUser").hide();
        jQuery("#newUserCancel").click(function(){closeForm("#dialog-form-user")});

    });
    $("#dialog-form-user").dialog({
        autoOpen: false
    });


    //Load loginUserform
    $("#dialog-form-logIn").load("Forms/logInForm.html", function() {
        $("#errorLogin").hide();
        jQuery("#loginCancel").click(function(){closeForm("#dialog-form-logIn")});
    });
    $("#dialog-form-logIn").dialog({
        autoOpen: false
    });

    //Load newTimelineForm.html
    $("#dialog-form-newTimeline").load("Forms/newTimelineForm.html", function() {
        $("#errorSaveTimeline").hide();
        jQuery("#saveTimelineCancel").click(function(){closeForm("#dialog-form-newTimeline")});
    });
    $("#dialog-form-newTimeline").dialog({
        autoOpen: false

    });
}