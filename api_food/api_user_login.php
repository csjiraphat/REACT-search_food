<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Replace with your client's origin
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
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
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Sanitize and validate input (you may need to improve this based on your requirements)
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

if (empty($email) || empty($password)) {
    $response = array('status' => 'error', 'message' => 'Invalid input data');
    echo json_encode($response);
    die();
}

// Retrieve user data from the database based on the email
$sql = "SELECT * FROM `user` WHERE `email` = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // User found, check the password
    $row = $result->fetch_assoc();
    $storedPassword = $row['password'];

    // Compare the plain password with the stored password
    if ($password == $storedPassword) {
        $userData = array(
            'user_id' => $row['user_id'],
            'name' => $row['name'],
            'email' => $row['email'],
        );

        $response = array('status' => 'success', 'message' => 'Login successful', 'user' => $userData);
        echo json_encode($response);
    } else {
        $response = array('status' => 'error', 'message' => 'Incorrect password');
        echo json_encode($response);
    }
} else {
    $response = array('status' => 'error', 'message' => 'User not found');
    echo json_encode($response);
}

// Close the database connection
$conn->close();
