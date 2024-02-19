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

// เรียกใช้งาน API ด้วยเมทอด HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // คำสั่ง SQL สำหรับดึงข้อมูลการแชร์ทั้งหมดโดยกรองเฉพาะโพสท์ที่ผู้ใช้เป็นคนแชร์เท่านั้น

        if (isset($_GET['user_id'])) {
            $userId = $_GET['user_id'];
            $queryGetSharedLogs = "SELECT * FROM shared_log WHERE user_id = '$userId'";
        } else {
            $queryGetSharedLogs = "SELECT * FROM shared_log";
        }

        $resultGetSharedLogs = $conn->query($queryGetSharedLogs);

        if ($resultGetSharedLogs && $resultGetSharedLogs->num_rows > 0) {
            $sharedLogs = array();
            while ($row = $resultGetSharedLogs->fetch_assoc()) {
                // ดึงข้อมูลผู้ใช้จาก user_id ที่เป็นคนแชร์
                $sharedUserId = $row['user_id'];
                $queryGetUser = "SELECT * FROM `user` WHERE `user_id` = '$sharedUserId'";
                $resultGetUser = $conn->query($queryGetUser);
                $sharedUserData = $resultGetUser->fetch_assoc();

                // ดึงข้อมูลอาหารที่ถูกแชร์โดยผู้ใช้เดียวกัน
                $foodRecipeId = $row['food_recipe_id'];
                $queryGetFoodRecipe = "SELECT * FROM `food_recipes` WHERE `id` = '$foodRecipeId'";
                $resultGetFoodRecipe = $conn->query($queryGetFoodRecipe);
                $sharedFoodRecipeData = $resultGetFoodRecipe->fetch_assoc();

                // สร้างข้อมูลการแชร์ใหม่โดยรวมข้อมูลของผู้ใช้และข้อมูลการแชร์
                $sharedLog = array(
                    "share_id" => $row["share_id"],
                    "user" => $sharedUserData,
                    "food_recipe" => $sharedFoodRecipeData
                );

                $sharedLogs[] = $sharedLog;
            }
            echo json_encode($sharedLogs);
        } else {
            echo json_encode(array('message' => 'No shared logs found'));
        }
        break;

    case 'POST':
        // รับข้อมูลที่ส่งมา
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->user_id;
        $food_recipe_id = $data->food_recipe_id;

        // คำสั่ง SQL สำหรับดึงข้อมูลผู้ใช้จากตาราง user
        $queryGetUser = "SELECT * FROM `user` WHERE `user_id` = '$user_id'";
        $resultUser = $conn->query($queryGetUser);

        if ($resultUser && $resultUser->num_rows > 0) {
            // ดึงข้อมูลผู้ใช้
            $userData = $resultUser->fetch_assoc();
            // ดึงชื่อผู้ใช้เพื่อเก็บในตาราง shared_log
            $username = $userData['name'];
        } else {
            echo json_encode(array('message' => 'User not found'));
            exit;
        }

        // คำสั่ง SQL สำหรับดึงข้อมูลอาหารจากตาราง food_recipes
        $queryGetFoodRecipe = "SELECT * FROM `food_recipes` WHERE `id` = '$food_recipe_id'";
        $resultFoodRecipe = $conn->query($queryGetFoodRecipe);

        if ($resultFoodRecipe && $resultFoodRecipe->num_rows > 0) {
            // ดึงข้อมูลอาหาร
            $foodRecipeData = $resultFoodRecipe->fetch_assoc();
            // ดึงชื่ออาหารเพื่อเก็บในตาราง shared_log
            $foodName = $foodRecipeData['name'];
        } else {
            echo json_encode(array('message' => 'Food recipe not found'));
            exit;
        }

        // คำนวณค่าให้กับ share_id โดยดึงค่า share_id ล่าสุดจากฐานข้อมูลและเพิ่ม 1
        $queryGetMaxShareId = "SELECT MAX(share_id) AS max_share_id FROM shared_log";
        $resultMaxShareId = $conn->query($queryGetMaxShareId);

        if ($resultMaxShareId && $resultMaxShareId->num_rows > 0) {
            $row = $resultMaxShareId->fetch_assoc();
            $maxShareId = $row['max_share_id'];
            $nextShareId = $maxShareId + 1;
        } else {
            // กรณีไม่มีข้อมูลในตารางหรือเกิดข้อผิดพลาด
            $nextShareId = 1; // กำหนดให้เริ่มที่ 1
        }

        // เตรียมคำสั่ง SQL สำหรับการเพิ่มข้อมูลการแชร์
        $query = "INSERT INTO shared_log (share_id, user_id, food_recipe_id) VALUES ('$nextShareId', '$user_id', '$food_recipe_id')";
        $result = $conn->query($query);

        if ($result) {
            echo json_encode(array('message' => 'Log added successfully'));
        } else {
            echo json_encode(array('message' => 'Error adding log'));
        }
        break;

    case 'DELETE':
        // Check if the 'id' is set in the query parameters
        if (isset($_GET['share_id'])) {
            $id = $_GET['share_id'];

            // Use prepared statement to prevent SQL injection
            $query = "DELETE FROM shared_log WHERE share_id=?";
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
}
