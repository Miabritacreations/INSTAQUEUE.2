<?php
// auth.php — register/login/logout
require 'config.php';
session_start();
require_json();

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'register') {
  $name = $_POST['name'] ?? '';
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';
  $role = $_POST['role'] ?? 'student';
  if (!$name || !$email || !$password) {
    echo json_encode(['error' => 'Missing fields']); exit;
  }
  // check existing
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
  $stmt->execute([$email]);
  if ($stmt->fetch()) { echo json_encode(['error' => 'Email already in use']); exit; }
  $hash = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
  $stmt->execute([$name,$email,$hash,$role]);
  echo json_encode(['success'=>true]);
  exit;
}

if ($action === 'login') {
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';
  if (!$email || !$password) { echo json_encode(['error'=>'Missing']); exit; }
  $stmt = $pdo->prepare('SELECT id,name,email,password,role FROM users WHERE email = ?');
  $stmt->execute([$email]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password'])) { echo json_encode(['error'=>'Invalid credentials']); exit; }
  $_SESSION['user'] = ['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email'],'role'=>$user['role']];
  echo json_encode(['success'=>true,'user'=>$_SESSION['user']]);
  exit;
}

if ($action === 'logout') {
  session_destroy();
  echo json_encode(['success'=>true]); exit;
}

// default
http_response_code(400);
echo json_encode(['error'=>'Invalid action']);
?>