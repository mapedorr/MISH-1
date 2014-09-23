<?php

$dataUser = $_POST['objTimelineToLoad'];
$eventJsonTransfer = json_decode($dataUser);


$timeline_loaded = file_get_contents("../JSON/Timelines/".$eventJsonTransfer->user_id."/mish_tl".$eventJsonTransfer->timeline_id.".json");
$timeline_data = json_decode($timeline_loaded, true);


header('Content-Type: application/json');
echo json_encode($timeline_data);

?>