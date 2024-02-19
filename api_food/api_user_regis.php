<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Replace with your client's origin
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'config.php';
$allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}


// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

// เรียกใช้งาน API ด้วยเมทอด HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Get user data from the request
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

// Store the password in plain text (not recommended for production)
//$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$plain_password = $password;

// Get the latest user_id from the database
$result = $conn->query("SELECT MAX(user_id) AS max_id FROM user");
$row = $result->fetch_assoc();
$latest_user_id = $row['max_id'];

// Increment the user_id and pad zeros
$new_user_id = str_pad($latest_user_id + 1, 5, '0', STR_PAD_LEFT);

// Insert user data into the database
$sql = "INSERT INTO `user` (`user_id`, `name`, `email`, `password`) VALUES ('$new_user_id', '$name', '$email', '$plain_password')";

if ($conn->query($sql) === TRUE) {
    $response = array('status' => 'success', 'message' => 'User registered successfully');
    echo json_encode($response);
} else {
    $response = array('status' => 'error', 'message' => 'Error: ' . $sql . '<br>' . $conn->error);
    echo json_encode($response);
}

// Close the database connection
$conn->close();
