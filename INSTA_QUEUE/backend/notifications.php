<?php
require 'config.php';
session_start();
require_json();
$user = $_SESSION['user'] ?? null;
if (!$user) { http_response_code(403); echo json_encode(['error'=>'Login required']); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC');
  $stmt->execute([$user['id']]);
  echo json_encode($stmt->fetchAll()); exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // mark read or create (admin)
  if ($user['role'] === 'admin' && isset($_POST['user_id']) && isset($_POST['message'])) {
    $stmt = $pdo->prepare('INSERT INTO notifications (user_id,message) VALUES (?,?)');
    $stmt->execute([$_POST['user_id'],$_POST['message']]);
    echo json_encode(['success'=>true]); exit;
  }
  // mark read
  if (isset($_POST['id'])) {
    $stmt = $pdo->prepare('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?');
    $stmt->execute([$_POST['id'],$user['id']]);
    echo json_encode(['success'=>true]); exit;
  }
}

http_response_code(400);
echo json_encode(['error'=>'Invalid']);
?>