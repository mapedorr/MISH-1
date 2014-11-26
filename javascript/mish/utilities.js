/**
 * Function that calculates the size, width and height of the main containers.
 * 
 * @returns {undefined}
 */
function resizeContainers(){
    mishGA.workAreaWidth = jQuery(window).width();
    mishGA.workAreaHeight = jQuery(window).height() - 75 - 40;
    
    jQuery("#work-area-container").css("width",mishGA.workAreaWidth);
    jQuery("#work-area-container").css("height",mishGA.workAreaHeight);
    
    if(mishGA.canvasObject !== null){
        mishGA.canvasObject.setAttribute("width",mishGA.workAreaWidth);
        mishGA.canvasObject.setAttribute("height",mishGA.workAreaHeight);
    }
}

/**
 * Function for get the specific message in 'id' param.
 * 
 * @param {type} id
 * @returns {msg|messagesObject.msg}
 */
function getMessage(id){
    return msg[""+id];
}

/**
 * Function that clean the error messages in the specified DIV.
 * 
 * @param {type} containerDiv The ID of the DIV
 * @returns {undefined}
 */
function clearErrorMessages(containerDiv){
    jQuery(containerDiv).find("ul").empty();
}

/**
 * Function that appends an error message to the specified DIV.
 * 
 * @param {type} containerDiv The ID of the DIV
 * @param {type} messageId The message to show
 * @returns {undefined}
 */
function appendErrorMessage(containerDiv,messageId){
    jQuery(containerDiv).find("ul").append("<li>" + msg[messageId] + "</li>");
}

/**
 * Function that close the specified Dialog window.
 * 
 * @param {type} id
 * @returns {undefined}
 */
function closeDialog(id) {
    jQuery(id).dialog('close');
}

/**
 * Function that creates a Dialog box for the DIV identified by the first
 * parameter with the title of the second parameter.
 * 
 * @param {type} id
 * @param {type} title
 * @returns {undefined}
 */
function createBasicDialog(id,title){
    jQuery(id).dialog({
        title: msg[title],
        autoOpen: false,
        modal: true,
        minWidth: 500,
        minHeight: 189,
        resizable: false,
        draggable: false,
        show: { 
            effect: "fade",
            duration: 400
        },
        open: function( event, ui ) {
            clearDialogFields(this);
            hideErrorMessages(this);
        }
    });
}

/**
 * Function that clear all the INPUT elements contained in the specified DIV.
 * 
 * @param {type} element
 * @returns {undefined}
 */
function clearDialogFields(element){
    jQuery(element).find(":not(input[type=button])").val("");
}

/**
 * Function that hides all the ERROR elements contained in the specified DIV.
 * 
 * @param {type} element
 * @returns {undefined}
 */
function hideErrorMessages(element){
    jQuery(element).find('div[id^="error"]').hide();
}