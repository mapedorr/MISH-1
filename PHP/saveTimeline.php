<?php
//dataNewTimeline es el objeto que contiene el nuevo timeline
$dataNewTimeline = $_POST['userNewTimeline'];
$timelineJsonTransfer = json_decode($dataNewTimeline);

$userFolder = $timelineJsonTransfer -> timeline -> user_id;
$timelineID = $timelineJsonTransfer -> timeline -> timeline_id;
mkdir("../JSON/Timelines/".$userFolder, 0777);
$fh = fopen("../JSON/Timelines/".$userFolder."/mish_tl".$timelineID.".json", 'w')
or die("Error al abrir fichero de salida");
fwrite($fh, json_encode($timelineJsonTransfer));
fclose($fh);
?>