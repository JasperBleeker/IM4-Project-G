<?php
//Hello Unload
// echo "Hello Unload";

//Database configuration
require_once 'config.php';

//Set Header for JSON
header('Content-Type: application/json');

//Request User parameters
if (isset($_GET['name'])) {

    //replace the %20 with space
    $parkhaus = $_GET['name'];
    $parkhaus = str_replace("%20", " ", $parkhaus);

} else {
    $parkhaus = '';
}

if(isset($_GET['start'])){
    $start = $_GET['start'];
    $start = str_replace("%20", " ", $start);
} else {
    $start = 0;
}

if(isset($_GET['end'])){
    $end = $_GET['end'];
    $end = str_replace("%20", " ", $end);
} else {
    $end = 0;
}

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    if($parkhaus != ''){

        //SQL Query
        $sql = "SELECT * FROM ParkingLots WHERE name = :name ORDER BY created DESC";
        
        //Prepare the SQL Query
        $stmt = $pdo->prepare($sql);

        //Execute the SQL Query
        $stmt->execute(['name' => $parkhaus]);

        //Fetch the data
        $results = $stmt->fetchAll();
   
    } else {
        if($start != 0 && $end != 0){
            //SQL Query
            $sql = "SELECT * FROM ParkingLots WHERE created BETWEEN :start AND :end ORDER BY created DESC";

            //Prepare the SQL Query
            $stmt = $pdo->prepare($sql);

            //Execute the SQL Query
            $stmt->execute(['start' => $start, 'end' => $end]);

            //Fetch the data
            $results = $stmt->fetchAll();

        } else {
        //SQL Query
        $sql = "SELECT * FROM ParkingLots ORDER BY created DESC";
        
        //Prepare the SQL Query
        $stmt = $pdo->prepare($sql);

        //Execute the SQL Query
        $stmt->execute();

        //Fetch the data
        $results = $stmt->fetchAll();
        }
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

//Check if the data is empty
if ($results && $stmt->rowCount() > 0) {
    //Output the data
    echo json_encode($results);
} else {
    //Output error message
    echo json_encode(['message' => 'No data found']);
}

?>