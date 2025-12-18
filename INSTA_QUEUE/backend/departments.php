<?php
require 'config.php';
session_start();
require_json();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  // list departments
  $stmt = $pdo->query('SELECT id,name,description FROM departments ORDER BY name');
  $depts = $stmt->fetchAll();
  echo json_encode($depts);
  exit;
}

// admin-only modifications
$user = $_SESSION['user'] ?? null;
if (!$user || $user['role'] !== 'admin') { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }

if ($method === 'POST') {
  $name = $_POST['name'] ?? '';
  $desc = $_POST['description'] ?? '';
  if (!$name) { echo json_encode(['error'=>'Name required']); exit; }
  $stmt = $pdo->prepare('INSERT INTO departments (name,description) VALUES (?,?)');
  $stmt->execute([$name,$desc]);
  echo json_encode(['success'=>true,'id'=>$pdo->lastInsertId()]); exit;
}

if ($method === 'PUT' || $method === 'DELETE') {
  parse_str(file_get_contents('php://input'), $data);
  $id = $data['id'] ?? 0;
  if (!$id) { echo json_encode(['error'=>'ID required']); exit; }
  if ($method === 'PUT') {
    $name = $data['name'] ?? '';
    $desc = $data['description'] ?? '';
    $stmt = $pdo->prepare('UPDATE departments SET name=?,description=? WHERE id=?');
    $stmt->execute([$name,$desc,$id]);
    echo json_encode(['success'=>true]); exit;
  } else {
    $stmt = $pdo->prepare('DELETE FROM departments WHERE id=?');
    $stmt->execute([$id]);
    echo json_encode(['success'=>true]); exit;
  }
}

http_response_code(400);
echo json_encode(['error'=>'Invalid method']);
?>