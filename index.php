<?php

	header('Content-Type: application/json');	//returns JSON data
	
	$servername = "localhost";
	$username = "movilesbluetooth";
	$password = "3mFh5qNR";
	$db_name = "movilesbluetooth";

	$mysqli = new mysqli($servername, $username, $password, $db_name);

	if ($mysqli->connect_errno) { // La conexión falló. 
		echo "Error: Fallo al conectarse a MySQL debido a: \n";
		echo "Errno: " . $mysqli->connect_errno . "\n";
		echo "Error: " . $mysqli->connect_error . "\n";	
		exit;
	}

	$sql = "SELECT * FROM codes";
	
	if (!$result = $mysqli->query($sql)) { // La consulta falló. 
		echo "Error: La ejecución de la consulta falló debido a: \n";
		echo "Query: " . $sql . "\n";
		echo "Errno: " . $mysqli->errno . "\n";
		echo "Error: " . $mysqli->error . "\n";
		exit;
	}

	if ($result->num_rows === 0) { // La consulta volvió vacía. 
		echo "No hay filas en la base de datos.";
		exit;
	}
	
	$return_codes = array();

	while ($code = $result->fetch_assoc()) {
		$return_codes[] = array('id'=> $code['id'],
							 'hash'=> $code['hash'],
							 'title'=>$code['title'],
							 'description'=>$code['description'],
							 'imagetitle'=>$code['image-title'],
					);
	}
	
	echo( json_encode($return_codes) );
	
	$result->free();
	$mysqli->close();
					  
?>