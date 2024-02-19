<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000, http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

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

function getCreatorData($userId)
{
    global $conn;

    $query = "SELECT * FROM `user` WHERE user_id = '$userId'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return array(
            "user_id" => $row['user_id'],
            "name" => $row['name'],
            "email" => $row['email'],
            "password" => $row['password'],
        );
    } else {
        return array(); // Return an empty array if no creator found
    }
}

switch ($method) {
    case 'GET':
        // ตรวจสอบว่ามีพารามิเตอร์ search ถูกส่งมาหรือไม่
        if (isset($_GET['search'])) {
            $searchQuery = $_GET['search'];
            $query = "SELECT * FROM food_recipes WHERE name LIKE '%$searchQuery%' OR type LIKE '%$searchQuery%' OR EXISTS (SELECT * FROM user WHERE user.user_id = food_recipes.user_id AND user.name LIKE '%$searchQuery%')";
        } else {
            // ถ้าไม่มีการส่งพารามิเตอร์ search ให้ดึงข้อมูลทั้งหมด
            $query = "SELECT * FROM food_recipes";
        }

        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $meals = array();

            while ($row = mysqli_fetch_assoc($result)) {
                $meal = array(
                    "id" => $row['id'],
                    "user_id" => $row['user_id'],
                    "name" => $row['name'],
                    "Ingredient" => $row['Ingredient'],
                    "img" => $row['img'],
                    "type" => $row['type'],
                    "cuisine" => $row['cuisine'],
                );

                // เพิ่ม creator information
                $creatorData = getCreatorData($row['user_id']);
                $meal['creator'] = $creatorData;

                $meals[] = $meal;
            }

            echo json_encode($meals);
        } else {
            echo json_encode(array('message' => 'No records found'));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->user_id;
        $name = $data->name;
        $Ingredient = isset($data->Ingredient) ? $data->Ingredient : '';
        $img = $data->img;
        $type = $data->type;
        $cuisine = $data->cuisine;

        // ดึง ID ล่าสุด
        $getLastIdQuery = "SELECT id FROM food_recipes ORDER BY id DESC LIMIT 1";
        $getLastIdResult = $conn->query($getLastIdQuery);

        if ($getLastIdResult->num_rows > 0) {
            $lastIdRow = $getLastIdResult->fetch_assoc();
            $lastId = $lastIdRow['id'];

            // เพิ่มค่า ID ให้กับข้อมูลใหม่
            $nextId = str_pad((string)($lastId + 1), 10, "0", STR_PAD_LEFT);
        } else {
            // ถ้าไม่มี ID ในฐานข้อมูลให้เริ่มที่ 0000000001
            $nextId = str_pad("1", 10, "0", STR_PAD_LEFT);
        }

        $query = "INSERT INTO food_recipes (id, user_id, name, Ingredient, img, type, cuisine) VALUES ('$nextId', '$user_id', '$name', '$Ingredient', '$img', '$type', '$cuisine')";
        $result = $conn->query($query);

        if ($result) {
            echo json_encode(array('message' => 'Ingredient added successfully'));
        } else {
            echo json_encode(array('message' => 'Error adding Ingredient'));
        }
        break;

    case 'PUT':
        // Decode JSON data from request body
        $data = json_decode(file_get_contents("php://input"), true);

        // Check if required fields are present
        if (isset($data['id'], $data['name'], $data['Ingredient'], $data['img'], $data['type'], $data['cuisine'])) {
            // Use prepared statement to prevent SQL injection
            $query = "UPDATE food_recipes SET name=?, Ingredient=?, img=?, type=?, cuisine=? WHERE id=?";
            $stmt = $conn->prepare($query);

            // Bind parameters
            $stmt->bind_param("ssssss", $data['name'], $data['Ingredient'], $data['img'], $data['type'], $data['cuisine'], $data['id']);

            // Execute the statement
            if ($stmt->execute()) {
                echo json_encode(array('message' => 'Ingredient updated successfully'));
            } else {
                echo json_encode(array('message' => 'Error updating Ingredient', 'error' => $stmt->error));
            }

            // Close the statement
            $stmt->close();
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(array('message' => 'Incomplete data for updating Ingredient'));
        }
        break;

    case 'DELETE':
        // Check if the 'id' is set in the query parameters
        if (isset($_GET['id'])) {
            $id = $_GET['id'];

            // Use prepared statement to prevent SQL injection
            $query = "DELETE FROM food_recipes WHERE id=?";
            $stmt = $conn->prepare($query);

            // Bind parameters
            $stmt->bind_param("s", $id);

            // Execute the statement
            if ($stmt->execute()) {
                http_response_code(200); // OK
                echo json_encode(array('message' => 'Ingredient deleted successfully'));
            } else {
                http_response_code(500); // Internal Server Error
                echo json_encode(array('message' => 'Error deleting Ingredient', 'error' => $stmt->error));
            }

            // Close the statement
            $stmt->close();
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(array('message' => 'Missing id parameter for deleting Ingredient'));
        }
        break;


    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(array('message' => 'Method Not Allowed'));
        break;
}
