<?php
// Example PHP script to test the API using cURL

$url = 'http://localhost/api_food/api_user_regis.php';

$data = array(
  'name' => 'John Doe',
  'email' => 'john@example.com',
  'password' => 'securepassword'
);

$options = array(
  CURLOPT_URL => $url,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => $data,
  CURLOPT_RETURNTRANSFER => true,
);

$curl = curl_init();
curl_setopt_array($curl, $options);

$response = curl_exec($curl);
curl_close($curl);

echo $response;
