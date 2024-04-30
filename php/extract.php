<?php
// The API endpoint
$url = 'https://api.parkendd.de/Zuerich';

// Use cURL to fetch data from the API
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($ch);
curl_close($ch);

// echo $output;

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
    
    // Test output
    // echo "Address: $address, Latitude: $lat, Longitude: $lng, Free spaces: $free, Total spaces: $total, Name: $name, State: $state, ID: $id, Lot type: $lot_type\n";
    // echo "<br>";

    // Create new array for each parking lot
    $parkingLots[] = [
        'address' => $address,
        'lat' => $lat,
        'lng' => $lng,
        'free' => $free,
        'total' => $total,
        'name' => $name,
        'state' => $state,
        'id' => $id,
        'lot_type' => $lot_type
    ];
}
echo "<pre>";
print_r($parkingLots);
echo "</pre>";
?>
