<?php
// The API endpoint
$url = 'https://api.parkendd.de/Zuerich';

// Use cURL to fetch data from the API
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($ch);
curl_close($ch);

echo $output;

// Check if the fetch was successful
if ($output === false) {
    echo "Failed to fetch data.";
    exit;
}

// Decode JSON data
$data = json_decode($output, true);

// Check if decoding was successful
if ($data === null) {
    echo "Failed to decode JSON.";
    exit;
}

// Loop over data to extract parking lot details for each lot
// foreach ($parkingLots as $lot) {
//     $adress = $lot['lots'];
    

//     echo "Adress: $adress";
// }

foreach ($data['lots'] as $lot) {
    $address = $lot['address'] ?? 'No address provided';
    $lat = $lot['coords']['lat'] ?? 'No latitude provided';
    $lng = $lot['coords']['lng'] ?? 'No longitude provided';
    $free = $lot['free'] ?? 'No free spaces';
    $total = $lot['total'] ?? 'No total spaces';
    $name = $lot['name'] ?? 'No name provided';
    $state = $lot['state'] ?? 'No state provided';
    $id = $lot['id'] ?? 'No id provided';
    $lot_type = $lot['lot_type'] ?? 'No lot type provided';
    
    echo "Address: $address, Latitude: $lat, Longitude: $lng, Free spaces: $free, Total spaces: $total, Name: $name, State: $state, ID: $id, Lot type: $lot_type\n";
    echo "<br>";
}

// // Transform data: collect transformed parking lot details
// $transformedData = [];
// foreach ($parkingLots as $lot) {
//     $transformedData[] = [
//         'name' => $lot['name'],
//         'total' => $lot['total'],
//         'free' => $lot['free'],
//         'state' => $lot['state']
//     ];
// }

// // Output the transformed data
// echo "Transformed Data:\n";
// print_r($transformedData);

// // Placeholder for loading into the database
// // This would involve creating a database connection and inserting the data
// echo "Data is ready to be loaded into the database.\n";

// // Example for loading would be similar to the previous ETL script example
// ?>
