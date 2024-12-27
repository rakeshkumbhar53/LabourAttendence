<?php
// Set the content type to application/json
header('Content-Type: application/json');

// Get the ID from the query parameters
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Specify the JSON file path
$jsonFile = 'data.json';

// Check if the file exists
if (!file_exists($jsonFile)) {
    echo json_encode(['status' => 'error', 'message' => 'Data file not found.']);
    exit;
}

// Read the existing data
$currentData = json_decode(file_get_contents($jsonFile), true);

// Search for the record with the specified ID and remove it
$recordFound = false;
foreach ($currentData['records'] as $key => $item) {
    if ($item['id'] === $id) {
        unset($currentData['records'][$key]);
        $recordFound = true;
        break;
    }
}

// If the record was found, update the JSON file
if ($recordFound) {
    // Reindex the array to maintain sequential keys
    $currentData['records'] = array_values($currentData['records']);
    
    if (file_put_contents($jsonFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
        echo json_encode(['status' => 'success', 'message' => 'Record deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to write data.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Record not found.']);
}
?>
