<?php
// echo '<pre>';
// print_r(gd_info());
// echo '</pre>';

$imageData = $_POST['imageData'];
// $imageData = $_FILES['imageData'];
// $imageDirectory = "../JSON/Timelines/".$userFolder."/mish_tl".$timelineID."/images/";
$imageDirectory = "../JSON";
$image = imagecreatefromjpeg($imageData);
// $image = imagecreatefromjpeg($_FILES['imageData']['tmp-name']);
$ext = ".jpg";
$imagename = "coco" . $ext;
imagejpeg($image, $imageDirectory . '/' . $imagename, 100);
imagedestroy($image);

?>