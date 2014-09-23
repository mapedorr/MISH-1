<?php
    $dataNewUser = $_POST['newUserObject'];
    $userJsonTransfer = json_decode($dataNewUser);

    $users_loaded = file_get_contents("../JSON/userTest.json");
    $users_data = json_decode($users_loaded,true);

    $users_data["mish_user"]["users"][count($users_data["mish_user"]["users"])] = $userJsonTransfer;

    $fh = fopen("../JSON/userTest.json", 'w')
          or die("Error al abrir fichero de salida");
    fwrite($fh, json_encode($users_data));
    fclose($fh);
?>