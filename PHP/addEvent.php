<?php
//eventNew es el objeto que contiene el nuevo evento
    $dataNewEvent = $_POST['eventNew'];
    $eventJsonTransfer = json_decode($dataNewEvent);

    $timeline_loaded = file_get_contents("../JSON/timeline.json");
    $timeline_data = json_decode($timeline_loaded,true);

    $timeline_data["timeline"]["events"][count($timeline_data["timeline"]["events"])] = $eventJsonTransfer;

    $fh = fopen("../JSON/timeline.json", 'w')
          or die("Error al abrir fichero de salida");
    fwrite($fh, json_encode($timeline_data));
    fclose($fh);
?>