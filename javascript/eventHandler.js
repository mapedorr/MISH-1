/**
 * Created by Usuario on 6/03/14.
 */


function mouseWheelHnd(){


    var wah = document.getElementById("valorid");
    if (wah.addEventListener) {
        // IE9, Chrome, Safari, Opera
        wah.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        wah.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    else {
        wah.attachEvent("onmousewheel", MouseWheelHandler);
    }
}

function MouseWheelHandler(e) {

    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    zoom_level = zoom_level + (delta/Math.abs(delta));

    if (zoom_level <= 12 && zoom_level >= -10){

        var as = getZoomDesc(zoom_level);
        jQuery("#zoom").text(zoom_level + as);
        clearTimeline();
        cellWidth = cellWidth + delta;
        loadTimelineBase();

    }
    else{
        zoom_level = zoom_level - (delta/Math.abs(delta));
    }



}

function loadButtonsListeners(){
    //crear Evento
    jQuery("#linkCreateEvent").click(function() {
        $("#eventDate").datepicker({ dateFormat: "dd-mm-yy" });
        $('#dialog-form').dialog('open');
        closeMenu();
    });

    //crear Usuario
    jQuery("#buttCreateUser").click(function() {
        $('#errorNombreVacio').hide();
        $('#errorPasswordVacio').hide();
        $('#dialog-form-user').dialog('open');
        closeMenu();
    });

    //LogIn Usuario
    jQuery("#buttLogIn").click(function() {
        $('#errorLogin').hide();
        $('#errorLoginVacio').hide();
        $('#dialog-form-logIn').dialog('open');
        closeMenu();
    });


}


function createUserButtAction(){
   
    
    if($("#userName").val() != ""){
        $("#errorCreateUser").hide();
        if($("#userPassword").val() != ""){
            $("#errorCreateUser").hide();
            if($("#userPassword").val() === $("#userPasswordDos").val() )
            {
                $("#errorCreateUser").hide();
                createMISHUser();
                $('#dialog-form-user').dialog('close');
                $("#userName").val("");
                $("#userPassword").val("");
                $("#userPasswordDos").val("");
            }
            else
            {   
                $("#createUserErrorMsg").empty();
                newuser_error = "Las contraseñas no coinciden";
                $("#createUserErrorMsg").append(""+newuser_error);
                $("#errorCreateUser").show();
            }       
        }
        else
        {
            $("#createUserErrorMsg").empty();
            newuser_error = "Debe ingresar la contraseña para su usuario";
            $("#createUserErrorMsg").append(""+newuser_error);
            $("#errorCreateUser").show();
        }
    }
    else
    {
        $("#createUserErrorMsg").empty();
        newuser_error = "Debe ingresar un nombre de usuario";
        $("#createUserErrorMsg").append("" + newuser_error);
        $("#errorCreateUser").show();
    }
}

function usuarioLogIn(){

    if ($("#registeredUserName").val() != ""){
        $('#errorLogin').hide();
       lookForUserLogIn();
    }
    else{
        $('#logInErrorMsg').empty();
        user_loggedIn = false;
        login_error = "Debe llenar todos los campos"
        $('#logInErrorMsg').append(""+ login_error);
        $('#errorLogin').show();
    }
}

function closeForm(id){
    jQuery(""+id).dialog('close');
}

function guardarTimeline(){
    if(user_loggedIn){
        jQuery("#dialog-form-newTimeline").dialog('open');
    }
    else{
        jQuery("#buttCreateUser").click();
    }
}


function guardarTimelineClic(){
    if(jQuery("#timelineName").val() != ""){
        guardarTimelineOnJson();
    }
    else{
        
        $('#saveTimelineErrorMsg').empty();
        newTimeline_error = "Debe darle un nombre al timeline";
        $('#saveTimelineErrorMsg').append(""+ newTimeline_error);
        $('#errorSaveTimeline').show();
        
    }
}

function abrirTimelineClic(timelineId){
    readJSonTimeline(timelineId);
    jQuery("#loaded-timelines-container").hide();
}

function nuevaTimeline(){
        jQuery("#loaded-timelines-container").hide();
}