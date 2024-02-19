<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

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

// Handle HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve comments data
        $query = "SELECT * FROM comments";
        $result = $conn->query($query);

        if ($result && $result->num_rows > 0) {
            $comments = array();
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
            echo json_encode($comments);
        } else {
            echo json_encode(array('message' => 'No comments found'));
        }
        break;

    case 'POST':
        // Retrieve data from request body
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->user_id;
        $comment = $data->comment;

        // Check if comment is related to a food recipe or a shared post
        if (isset($data->id)) {
            $id = $data->id;
            $share_id = ''; // No share_id if comment is related to a food recipe
        } elseif (isset($data->share_id)) {
            $id = ''; // No id if comment is related to a shared post
            $share_id = $data->share_id;
        } else {
            echo json_encode(array('message' => 'Invalid comment data'));
            exit;
        }

        // Insert comment into database
        $query = "INSERT INTO comments (user_id, id, share_id, comment) VALUES ('$user_id', '$id', '$share_id', '$comment')";
        $result = $conn->query($query);

        if ($result) {
            echo json_encode(array('message' => 'Comment added successfully'));
        } else {
            echo json_encode(array('message' => 'Error adding comment'));
        }
        break;

    case 'DELETE':
        // Check if comment_id is set in query parameters
        if (isset($_GET['comment_id'])) {
            $comment_id = $_GET['comment_id'];

            // Delete comment from database
            $query = "DELETE FROM comments WHERE comment_id = '$comment_id'";
            $result = $conn->query($query);

            if ($result) {
                echo json_encode(array('message' => 'Comment deleted successfully'));
            } else {
                echo json_encode(array('message' => 'Error deleting comment'));
            }
        } else {
            echo json_encode(array('message' => 'Missing comment_id parameter for deleting comment'));
        }
        break;
}
