<?php
//Hello Unload
echo "Hello Unload";

//Database configuration
require_once 'config.php';

//Set Header for JSON
header('Content-Type: application/json');

//Request User parameters

try {
    $pdo = new PDO("$dsn, db_user, db_pass, $options");
    
    //SQL Query
    $sql = "SELECT * FROM ParkingLots WHERE state = ? ORDER BY created_at DESC";
    
    //Prepare the SQL Query
    $stmt = $pdo->prepare($sql);

    //Execute the SQL Query
    $stmt->execute([$_GET['state']]);

    //Fetch the data
    $results = $stmt->fetchAll();

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

?>