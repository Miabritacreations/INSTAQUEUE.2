<?php
require 'config.php';
session_start();
require_json();
$user = $_SESSION['user'] ?? null;
if (!$user) { http_response_code(403); echo json_encode(['error'=>'Login required']); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $dept = $_POST['department_id'] ?? null;
  $rating = intval($_POST['rating'] ?? 5);
  $comment = $_POST['comment'] ?? '';
  $stmt = $pdo->prepare('INSERT INTO feedback (user_id,department_id,rating,comment) VALUES (?,?,?,?)');
  $stmt->execute([$user['id'],$dept,$rating,$comment]);
  echo json_encode(['success'=>true]); exit;
}
http_response_code(400); echo json_encode(['error'=>'Invalid']);
?>