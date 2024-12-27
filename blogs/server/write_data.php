<?php
// Set the content type to application/json
header('Content-Type: application/json');

// Get the incoming data from the AJAX call
$data = json_decode(file_get_contents('php://input'), true);

// Specify the JSON file path
$jsonFile = '../data/data.json';

// Check if the file exists, if not create it
if (!file_exists($jsonFile)) {
    // Create an empty JSON array and set the last ID to 0
    $initialData = ['lastId' => 0, 'records' => []];
    file_put_contents($jsonFile, json_encode($initialData, JSON_PRETTY_PRINT));
}

// Read the existing data
$currentData = json_decode(file_get_contents($jsonFile), true);

// Generate a new ID
$newId = ++$currentData['lastId'];

// Add the new data with the ID to the existing data
$data['id'] = $newId; // Add ID to the data object
$currentData['records'][] = $data;

// Write the updated data back to the file
if (file_put_contents($jsonFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'Data written successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to write data.']);
}
?>
