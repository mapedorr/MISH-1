/**
 * This file contains methods for calculations
 */

function calculateDistance(date1,date2){
    var distance = (moment(date2).diff(moment(date1), '' + zoom_local));
    return (distance <= 0) ? distance : distance + 1 ;
}

function getZoomDesc(level){
    for(var i = 0; i < zoomCorelat.length; i++){
        if (zoomCorelat[i][0] <= level && zoomCorelat[i][1] >= level ){
            zoom_local = zoomCorelat [i][2];
            break;
        }

    }
    return zoom_local;
}

function calcularCenterDate(){

    if(eventsJsonElement.length > 0)
    {
        var menor = null;
        var mayor = null;
        $.each(eventsJsonElement, function (key, value){
            var eventDateMoment = moment(value.date,"DD-MM-YYYY");
            if(menor == null){
                menor = eventDateMoment;
            }
            else
            {
                if(eventDateMoment.isBefore(menor))
                {
                    menor = eventDateMoment;
                }
            }

            if(mayor == null){
                mayor = eventDateMoment;
            }
            else
            {
                if(mayor.isBefore(eventDateMoment))
                {
                    mayor = eventDateMoment;
                }
            }

        });

        var mitad = menor.clone().add(''+zoom_local,calculateDistance(menor, mayor)/2);
        return  mitad.format('DD-MM-YYYY');
    }
    else{
        return null;
    }

}
