/**
 * Function that determines if Canvas is supported by the Web browser.
 * 
 * @returns {Modernizr.canvas|Function.canvas}
 */
function canvasSupport () {
    return Modernizr.canvas;
}

/**
 * Function that creates the Canvas.
 * 
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
function canvasApp(x,y) {
    if (!canvasSupport()) {
        return null;
    }else{
        
        //http://css-tricks.com/using-requestanimationframe/
        //http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    window.oRequestAnimationFrame      ||
                    window.msRequestAnimationFrame     ||
                    function(/* function */ callback, /* DOMElement */ element){
                        window.setTimeout(callback, 1000 / 60);
                    };
        })();
        
        var theCanvas = document.getElementById('maincanvas');
        var context = theCanvas.getContext('2d');
        
        theCanvas.setAttribute("width",mishGA.workAreaWidth);
        theCanvas.setAttribute("height",mishGA.workAreaHeight);
        
        //setInterval(drawScreen, 1000 / 60);//60 FPS
        drawFrame();
        
        return theCanvas;
    }

    var mouseX;
    var mouseY;
    
    /**
     * Function that call the draw functions
     * 
     * @returns {undefined}
     */
    function drawFrame() {
        requestAnimFrame(drawFrame);
        drawScreen();
    }

    /**
     * Function that call all the draw functions
     * 
     * @returns {undefined}
     */
    function drawScreen () {
        drawEvents();
        //Draw a dashed line in the center of the screen for nothing...
        drawLineToTimeline(jQuery(window).width() / 2,globalPosY);
    }
    
    /**
     * Function that draw the events in the canvas
     * 
     * @returns {undefined}
     */
    function drawEvents(){
        //Clean the canvas for smooth lines
        context.clearRect(0, 0, theCanvas.width, theCanvas.height);

        $.each(eventsJsonElement, function (key, value){
            if(value.date){
                var eventMoment = moment(value.date,"DD-MM-YYYY");
                var eventPosX = jQuery("#mish-"+eventMoment.format("DDMMYYYY")).position().left;
                var posTimelineContainer = mishGA.timeRulerXPos;
                var posGroupContainer = jQuery("#mish-"+eventMoment.format("DDMMYYYY")).parent().position().left;
                eventPosX = (eventPosX + posTimelineContainer + posGroupContainer);
                drawLineToTimeline(eventPosX,globalPosY);
                drawEvent(eventPosX,globalPosY,value.title);
            }
        });
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

    function drawEvent (event_posX,event_posY,event_text) {
        if( event_posX < jQuery(window).width()
            && event_posX >= 0) {
            //Define the properties of the event to draw
            context.font = "14px sans-serif";
            context.fillStyle = "" + (timeline_color_scheme) ? timeline_color_scheme[1] : "GRAY";
            context.fillText(event_text,event_posX,event_posY - 5);
            
            /* CIRCLE DRAW
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
            
            */
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
    theCanvas.addEventListener("click",onMouseClick,false);
}