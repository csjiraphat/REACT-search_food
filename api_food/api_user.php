<?php
header('Content-Type: application/json');

// เชื่อมต่อฐานข้อมูล
require_once 'config.php'; // ไฟล์ config ที่มีการกำหนดค่าต่าง ๆ ของฐานข้อมูล

// ดึงข้อมูลผู้ใช้ทั้งหมด
if (isset($_GET['user_id'])) {
    $userId = $_GET['user_id'];
    $query = "SELECT * FROM `user` WHERE user_id = '$userId'";
} else {
    $query = "SELECT * FROM `user`";
}

$result = $conn->query($query);

if ($result) {
    $users = array();

    // เก็บข้อมูลผู้ใช้ในรูปแบบของ array
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    // ส่งค่าเป็น JSON
    echo json_encode($users);
} else {
    // กรณีเกิดข้อผิดพลาดในการดึงข้อมูล
    echo json_encode(array('error' => 'Failed to fetch user data.'));
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
