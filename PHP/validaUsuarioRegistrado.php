<?php

$dataUser = $_POST['regUserObj'];
$eventJsonTransfer = json_decode($dataUser);


$users_saved = file_get_contents("../JSON/userTest.json");
$users_data = json_decode($users_saved, true);

$parametros = [
    "error" => "",
    "user_id" => "",
    "timelines" => []
];

 foreach ($users_data["mish_user"]["users"] as $user) {
    if ($user["user_name"] == $eventJsonTransfer->user_name) {
        if ($user["user_password"] == $eventJsonTransfer->user_password) {
            
            $parametros["user_id"] = $user["user_id"];
            header('Content-Type: application/json');
            
            
            if(file_exists ("../JSON/Timelines/".$user["user_id"])){
                listarArchivos("../JSON/Timelines/".$user["user_id"]);
            }
            echo json_encode($parametros);
            
            break;
        }
        else{
            $parametros["error"] = "El usuario y la contraseña no coinciden";
            header('Content-Type: application/json');
            echo json_encode($parametros);
        }
    }

}



function listarArchivos( $path ){
    global $parametros;

    // Abrimos la carpeta que nos pasan como parámetro
    $contador = 0;

    // Leo todos los ficheros de la carpeta

        $dir = opendir($path);
        while ($elemento = readdir($dir)){
            if( $elemento != "." && $elemento != ".."){
                $timelines_loaded = file_get_contents($path."/".$elemento);
                $timelines_data = json_decode($timelines_loaded,true);
                //En la siguiente línea ponemos en el arreglo $parametros, en "timelines" el ID y en ese ID ponemos la CreationDate, ambos del archivo.
                $parametros["timelines"][$timelines_data["timeline"]["timeline_id"]] = $timelines_data["timeline"]["creation_date"];
            }
        }


}

?>