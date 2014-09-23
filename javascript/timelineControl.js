/**
 * This file controls the drawing and event handle over the <div id="timeline-container">
 */


var eventArray;

function drawTimeline(){
    center_date = moment(timelineJson.center_date,"DD-MM-YYYY");
    clearTimeline();
    loadTimelineBase();
}

function clearTimeline(){
    jQuery("#timeline-container").empty();
}




function fillDateRange(begin,end,timexpos,startDate){
    var daysToAdd = 0;
    for(var i = begin ; i <= end ; i++){
        timexpos = timexpos+cellWidth;
        if( i < 4000 ) {
            createTimelineCell(startDate.clone().add('days',daysToAdd).format('DDMMYYYY'), timexpos, true,i);
            daysToAdd++;
        }
    }
}



function createTimelineCell(id,xPosition,sub,cellText){
    jQuery('<div/>', {
        id: 'mish-label'+id,
        class: 'label'
    }).text(""+cellText).appendTo(
        jQuery('<div/>', {
            id: 'mish-'+id,
            class: 'date'
        }).css({"position":"absolute"
                ,"bottom":"0"
                ,"left":""+( 1000 + parseInt(xPosition))+"px"
                ,"width":cellWidth+"px"
                ,"top":(sub) ? "20px" : "0"}).appendTo('#timeline-container')
    );
}

/*
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
 */


function loadTimelineBase(){


    var center = jQuery(window).width()/2;

    globalPosX = center;
    var negcenter = center - (center_date.date()*cellWidth);
    createTimelineCell(center_date.format("DDMMYYYY"),center,false,center_date.format("DD-MM-YYYY"));
    var eonextmonth = moment().add('months', 1).date(0);
    var dateFcrTheCycleForward = center_date;
    var dateFcrTheCycleBackward = center_date;



    fillDateRange(center_date.clone().add('days',1).date(),eonextmonth.date(),center,center_date.clone().add('days',1));
    fillDateRange(center_date.clone().startOf('month').date(),center_date.clone().subtract('days',1).date(),negcenter,center_date.clone().startOf('month'));
    center += (dateFcrTheCycleForward.clone().endOf('month').date()-(center_date.date()))*cellWidth;


    for (var i= 1; i <= 5 ; i++){

        dateFcrTheCycleBackward = moment(dateFcrTheCycleBackward).subtract('month',1);
        dateFcrTheCycleForward = moment(dateFcrTheCycleForward).add('month',1);

        negcenter -= (dateFcrTheCycleBackward.clone().endOf('month').date() * cellWidth);


        fillDateRange(dateFcrTheCycleBackward.clone().startOf('month').date(),dateFcrTheCycleBackward.clone().endOf('month').date(), negcenter,dateFcrTheCycleBackward.clone().startOf('month'));
        fillDateRange(dateFcrTheCycleForward.clone().startOf('month').date(),dateFcrTheCycleForward.clone().endOf('month').date(), center,dateFcrTheCycleForward.clone().startOf('month'));

        center += (dateFcrTheCycleForward.clone().endOf('month').date()*cellWidth);

    }


    canvasApp(globalPosX,globalPosY);

}



function loadUserTimelines(){

        col_cont = 1;
    
        $.each(user_timelines, function (key, value){
        jQuery('<li/>', {
            id: 'timeline-'+key,
            "data-row":"1",
            "data-col":col_cont,
            "data-sizex":"1",
            "data-sizey":"1",
            "class":"loadedTimelineStyle",
            "onclick":"abrirTimelineClic("+key+")"
        }).text(""+value).appendTo(
                jQuery('#user-timelines-loaded-ul')
            );
        col_cont ++;
        user_timelines_count ++;
    });
   if (col_cont == 1){
        //Crea botón cargar ejemplos
        jQuery('<li/>', {
            id: 'timeline-load-samples',
            "data-row":"1",
            "data-col":"1",
            "data-sizex":"1",
            "data-sizey":"1",
            "class":"loadedTimelineStyle",
            "onclick":"loadSamplesClic()"
        }).text("Cargar Ejemplos").appendTo(
                jQuery('#user-timelines-loaded-ul')
            );

        //Crea botón crear nuevo timeline
        jQuery('<li/>', {
            id: 'timeline-new-timeline',
            "data-row":"1",
            "data-col":"2",
            "data-sizex":"1",
            "data-sizey":"1",
            "class":"loadedTimelineStyle",
            "onclick":"nuevaTimeline()"
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

    jQuery('#dialog-form-logIn').dialog('close');

}

