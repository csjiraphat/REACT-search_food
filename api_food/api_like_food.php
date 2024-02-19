<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

// Handle HTTP method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch likes data
        $query = "
            SELECT r.id, r.name, COUNT(l.user_id) AS like_count
            FROM food_recipes r
            LEFT JOIN recipe_likes l ON r.id = l.recipe_id
            GROUP BY r.id, r.name
        ";
        $result = $conn->query($query);

        if ($result && $result->num_rows > 0) {
            $likes = array();
            while ($row = $result->fetch_assoc()) {
                $likes[] = $row;
            }
            echo json_encode($likes);
        } else {
            echo json_encode(array('message' => 'No likes found'));
        }
        break;

    case 'POST':
        // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->user_id) || empty($data->user_id) || !isset($data->recipe_id)) {
            echo json_encode(array('message' => 'Invalid data, user_id or recipe_id is missing'));
            http_response_code(400); // Bad request
            exit;
        }

        // Receive data from Axios POST request
        $user_id = $data->user_id;
        $recipe_id = $data->recipe_id;

        // ตรวจสอบว่าผู้ใช้ได้กดไลค์อาหารชนิดเดิมแล้วหรือไม่
        $query = "SELECT COUNT(*) AS like_count FROM recipe_likes WHERE user_id = '$user_id' AND recipe_id = '$recipe_id'";
        $result = $conn->query($query);
        $row = $result->fetch_assoc();
        $like_count = $row['like_count'];

        // ถ้าผู้ใช้ได้กดไลค์อาหารชนิดเดิมแล้วให้ส่งข้อความกลับไป
        if ($like_count > 0) {
            echo json_encode(array('message' => 'You have already liked this recipe'));
            http_response_code(400); // Bad request
            exit;
        }

        // Generate like_id
        $query = "SELECT MAX(CAST(SUBSTRING(like_id, 2) AS UNSIGNED)) AS max_id FROM recipe_likes";
        $result = $conn->query($query);
        $row = $result->fetch_assoc();
        $max_id = $row['max_id'] ? $row['max_id'] : 0;
        $like_id = 'L' . str_pad($max_id + 1, 4, '0', STR_PAD_LEFT);

        // Insert new like into database
        $query = "INSERT INTO recipe_likes (like_id, user_id, recipe_id) VALUES ('$like_id', '$user_id', '$recipe_id')";
        $result = $conn->query($query);

        if ($result) {
            echo json_encode(array('message' => 'Like added successfully'));
        } else {
            echo json_encode(array('message' => 'Error adding like: ' . $conn->error));
        }
        break;
    case 'DELETE':
        // ตรวจสอบว่าโดเมนของร้องขอถูกต้องหรือไม่
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }

        // ตรวจสอบว่าการร้องขอนี้มาจาก preflight request หรือไม่
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header("Access-Control-Allow-Methods: DELETE");
            header("Access-Control-Max-Age: 3600"); // Cache preflight request for 1 hour
            header("Content-Length: 0");
            header("Content-Type: text/plain");
            exit;
        }

        // รับพารามิเตอร์ที่ส่งมา
        parse_str(file_get_contents("php://input"), $data);
        $share_id = $data['id'];

        // ตรวจสอบว่ามีข้อมูลการแชร์นี้อยู่หรือไม่ก่อนทำการลบ
        $queryCheckExistence = "SELECT * FROM shared_log WHERE share_id = '$share_id'";
        $resultCheckExistence = $conn->query($queryCheckExistence);

        if ($resultCheckExistence && $resultCheckExistence->num_rows > 0) {
            // ลบข้อมูลการแชร์
            $queryDelete = "DELETE FROM shared_log WHERE share_id = '$share_id'";
            $resultDelete = $conn->query($queryDelete);

            if ($resultDelete) {
                echo json_encode(array('message' => 'Log deleted successfully'));
            } else {
                echo json_encode(array('message' => 'Error deleting log'));
            }
        } else {
            echo json_encode(array('message' => 'Log not found'));
        }
        break;
}
