<?php
header('Content-Type: application/json');

// Read input data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'], $data['mobile_no'], $data['email'], $data['userid'], $data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Path to the JSON file
$file_path = '../data/securities.json';

// Check if the file exists, otherwise create it
if (!file_exists($file_path)) {
    // Initialize an empty user_details array if the file does not exist
    $userData = ['user_details' => []];
    // Create the file with an empty JSON structure
    file_put_contents($file_path, json_encode($userData, JSON_PRETTY_PRINT));
} else {
    // Read existing user data from JSON
    $userData = json_decode(file_get_contents($file_path), true);
    if ($userData === null) {
        echo json_encode(['success' => false, 'message' => 'Failed to read user data']);
        exit;
    }
}

// Check if the user already exists based on email or user ID
foreach ($userData['user_details'] as $user) {
    if ($user['email'] == $data['email'] || $user['userid'] == $data['userid']) {
        echo json_encode(['success' => false, 'message' => 'User already exists']);
        exit;
    }
}

// Encrypt the password using base64 encoding
$encodedPassword = base64_encode($data['password']);

// Prepare user data to be added
$newUser = [
    'id' => count($userData['user_details']) + 1,
    'name' => $data['name'],
    'mobile_no' => $data['mobile_no'],
    'email' => $data['email'],
    'userid' => $data['userid'],
    'password' => $encodedPassword
];

// Add the new user to the array
$userData['user_details'][] = $newUser;

// Save the updated data back to the JSON file
file_put_contents($file_path, json_encode($userData, JSON_PRETTY_PRINT));

// Send success response
echo json_encode(['success' => true, 'message' => 'Registration successful']);
?>