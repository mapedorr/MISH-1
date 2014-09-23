/*
ATRIBUTOS GLOBALES
*/
var timelineJson;
var eventsJsonElement;
var event_date;
var startdate_tl;
var enddate_tl;
var timeline_color_scheme;
var colorsch_id ;
var globalPosX;
var globalPosY;
var zoom_level;
var cellWidth;
var zoomCorelat;
var zoom_local;
var center_date;
var next_user_id;
var user_timelines;
var user_loggedIn;
var logged_user_id;
var user_timelines_count;
var login_error;
var newuser_error;
var newevent_error;
var newtimeline_error;


function initAttr(){
    timelineJson = null;
    eventsJsonElement = new Array();
    timeline_color_scheme = new Array();
    cellWidth = 20;
    zoomCorelat = new Array();
    zoomCorelat[0] = [7,12, "hours"];
    zoomCorelat[1] = [0,6, "days"];
    zoomCorelat[2] = [-5,-1, "months"];
    zoomCorelat[3] = [-10,-5, "years"];
    zoom_level = 0;
    getZoomDesc(zoom_level);
    center_date = moment();
    next_user_id = 0;
    user_timelines = null;
    user_loggedIn = false;
    globalPosX = 0;
    globalPosY = 80;
    logged_user_id = 0;
    user_timelines_count = 0;
    login_error = "";
    newuser_error = "";
    newevent_error = "";
    newtimeline_error = "";
}





function canvasEventAssignment(){

    jQuery(".work-area-handler-sq").bind("click", function (e) {
        jQuery("#canvasContextMenu").hide();
        jQuery("#canvasContextMenu").css('left', 0);
        jQuery("#canvasContextMenu").css('top', 0);
        return false;
    });

    jQuery(".work-area-handler-sq").bind("contextmenu", function (e) {
        jQuery("#canvasContextMenu").hide();
        jQuery("#canvasContextMenu").show(200);
        jQuery("#canvasContextMenu").css('left', e.clientX);
        jQuery("#canvasContextMenu").css('top', e.clientY);
        return false;
    });

    mouseWheelHnd();

    jQuery('#work-area-handler').css({width:jQuery('#timeline-container').css('width')});
    jQuery('#work-area-handler').draggable({
        drag: function( event, ui ) {
            var pixels = parseInt(jQuery('#work-area-handler').css('left'));
            jQuery('#timeline-container').css({left:(-1000 + pixels) + "px"});
        },
        axis:'x',
        scroll: false,
        start: function(event, ui){
            coco = parseInt(jQuery('#work-area-handler').css('left'));
        },
        stop: function(event, ui){
            newCoco = 0 - parseInt(jQuery('#work-area-handler').css('left'));
            jQuery('.work-area-handler-sq').css({left:newCoco});
            //jQuery('#canvas-container').css({left:newCoco});
        }

    });
}

function closeMenu() {


    jQuery("#canvasContextMenu").hide();
    jQuery("#canvasContextMenu").css('left', 0);
    jQuery("#canvasContextMenu").css('top', 0);
    
}



//Main function
jQuery(document).ready(function(){
    initAttr();
    loadMenus();
    loadButtonsListeners();
    canvasEventAssignment();
    loadTimelineBase();
    readJSonUser();
    //readJSonTimeline();
});
