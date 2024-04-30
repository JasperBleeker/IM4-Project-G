<?php

echo "Hello, Load!";

include 'transform.php';
require_once 'config.php';

//test output
echo "<pre>";
print_r($parkingLot);
echo "</pre>";

try {
    // Connect to the database
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    
    // Define the SQL statement
    $sql = "INSERT INTO ParkingLots (address, name, state, lot_type, free, total, location) VALUES (:address, :name, :state, :lot_type, :free, :total, :location)";
$stmt = $pdo->prepare($sql);
foreach ($parkingLot as $lot) {
    $stmt->execute([
        ':address' => $lot['address'],
        ':name' => $lot['name'],
        ':state' => $lot['state'],
        ':lot_type' => $lot['lot_type'],
        ':free' => $lot['free'],
        ':total' => $lot['total'],
        ':location' => $lot['location']
    ]);
}

echo "Data loaded successfully!";
    
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}


?>

