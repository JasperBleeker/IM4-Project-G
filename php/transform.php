<?php
echo "Hello, Transform!";

include 'extract.php';

// test output
// echo "<pre>";
// print_r($parkingLots);
// echo "</pre>";

// Transform data
foreach ($parkingLot as $index => $lot) {
    if (!isset($lot['lat']) || !isset($lot['lng']) || $lot['lat'] === '' || $lot['lng'] === '') {
        $parkingLot[$index]['location'] = NULL;
    } else {
        $parkingLot[$index]['location'] = $lot['lat'] . ',' . $lot['lng'];
    }

    // Remove the 'lat' and 'lng' keys from the array
    unset($parkingLot[$index]['lat'], $parkingLot[$index]['lng']);

    
}

echo "<pre>";
print_r($parkingLot);
echo "</pre>";
 

?>