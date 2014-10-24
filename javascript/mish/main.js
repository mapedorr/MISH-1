/* * * * * * * * * * 
 * Global attributes
 * * * * * * * * * * */
var mishGA = {
    canvasObject:null,
    workAreaWidth:jQuery(window).width(),
    workAreaHeight:jQuery(window).height(),
    timeRulerGroups:[],
    timeRulerXPos:0
};

//The Zoom levels determines the groups to create and the cells that they will contain.
//For example: If the first zoom level is MONTHS and the second level is WEEKS then the
//time ruler separators will be the first day of the month while the small lines (cells)
//will be each of the four weeks a month has.
var zoomLevels = {
  "millenium":["centurys", "half_century"],
  "century":["decades", "half_century"],
  "half_century":["decades"],
  "decade":["years"], 
  "years":["months"],
  "months":["weeks","days"],
  "days":["hours"]
};

var workAreaWidth;
var workAreaHeight;
var msg;
var assignLeftLimit;//Boolean that determines what time ruler limit will be stored
var timeRulerLeftLimit;
var timeRulerRightLimit;
/*Attributes for styles*/
var centerDateCssClass;
var separatorDateCssClass;
var normalDateCssClass;


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

/**
 * Function that assigns the initial values for all the global variables.
 * 
 * @returns {undefined}
 */
function initAttr(){
    //Set the location of MomentJS
    moment.locale('es');
    
    //Get the size for the work area
    mishGA.workAreaWidth = jQuery(window).width();
    mishGA.workAreaHeight = jQuery(window).height();
    
    //Assign the object with all the application's messages
    msg = messagesObject.msg;//The way to read a message: msg["error.inicioSesion"]
    assignLeftLimit = true;
    timeRulerLeftLimit = 0;
    timeRulerRightLimit = 0;
    
    
    
    
    
     
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
    
    initStyleVars();
}

/**
 * Function that defines the classes and styles to use.
 * 
 * @returns {undefined}
 */
function initStyleVars(){
    centerDateCssClass = "centerDate";
    separatorDateCssClass = "separatorDate";
    normalDateCssClass = "normalDate";
}

/*
 * Main function
 */
jQuery(document).ready(function(){
    initAttr();
    resizeContainers();
    
    //Load all the external pages
    loadExternalPages();
    
    //Assign listeners
    assignButtonsListeners();
    assignMouseEventsListeners();
    
    //Draw the basis time ruler
    drawTimeRuler();
    
    
    
    
    readJSonUser();//This should be done only in the Log in pop up
});

//Assign listener for window resizing
window.addEventListener("resize", resizeContainers);




/**
 * TEMPORAL
bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
 */