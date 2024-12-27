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

// Search for the record with the specified ID
$record = null;
foreach ($currentData['records'] as $item) {
    if ($item['id'] === $id) {
        $record = $item;
        break;
    }
}

// Return the record or an error message if not found
if ($record) {
    echo json_encode(['status' => 'success', 'record' => $record]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Record not found.']);
}
?>
