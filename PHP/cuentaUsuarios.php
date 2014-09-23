<?php

//devuelve la cantidad de usuarios para que al agregar un nuevo usuario lo podamos poner en la última posición
   $users_loaded = file_get_contents("../JSON/userTest.json");
   $users_data = json_decode($users_loaded,true);

    $usersCount = count($users_data["mish_user"]["users"]);

    header('Content-Type: text/plain');
    echo $usersCount;

?>