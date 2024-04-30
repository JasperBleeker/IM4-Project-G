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
if ($data === false) {
    echo "Failed to fetch data.";
    exit;
}

// // Decode JSON data
// $parkingLots = json_decode($data, true);

// // Check if decoding was successful
// if ($parkingLots === null) {
//     echo "Failed to decode JSON.";
//     exit;
// }

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
