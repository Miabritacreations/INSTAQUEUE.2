<?php
require 'config.php';
session_start();
require_json();

$method = $_SERVER['REQUEST_METHOD'];
$user = $_SESSION['user'] ?? null;

// utility: ensure logged in
if (!$user) { http_response_code(403); echo json_encode(['error'=>'Login required']); exit; }

if ($method === 'POST') {
  $department_id = $_POST['department_id'] ?? 0;
  $date = $_POST['date'] ?? '';
  $time = $_POST['time'] ?? '';
  $reason = $_POST['reason'] ?? '';
  if (!$department_id || !$date || !$time) { echo json_encode(['error'=>'Missing fields']); exit; }
  // support walk-in ticket (no existing user) by creating a temporary user
  if (isset($_POST['walkin']) && $_POST['walkin']) {
    // create a walk-in pseudo-user
    $wname = 'Walk-in '.date('YmdHis');
    $wemail = 'walkin+'.time().'@local';
    $wpass = password_hash(bin2hex(random_bytes(6)), PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
    $stmt->execute([$wname,$wemail,$wpass,'student']);
    $user_id = $pdo->lastInsertId();
  } else {
    $user_id = $user['id'];
  }
  // compute queue_number for department & date
  $stmt = $pdo->prepare('SELECT MAX(queue_number) AS maxq FROM appointments WHERE department_id=? AND date=?');
  $stmt->execute([$department_id,$date]);
  $row = $stmt->fetch();
  $next = ($row['maxq'] ?? 0) + 1;
  // insert
  $stmt = $pdo->prepare('INSERT INTO appointments (user_id,department_id,date,time,reason,queue_number,status) VALUES (?,?,?,?,?,?,?)');
  $stmt->execute([$user_id,$department_id,$date,$time,$reason,$next,'pending']);
  $id = $pdo->lastInsertId();
  // notify user
  $stmt = $pdo->prepare('INSERT INTO notifications (user_id,message) VALUES (?,?)');
  $stmt->execute([$user['id'],"You have been assigned queue #$next for department $department_id on $date at $time"]);
  echo json_encode(['success'=>true,'appointment_id'=>$id,'queue_number'=>$next]); exit;
}

// Get next pending appointment for a department (admin or caller)
if ($method === 'GET' && isset($_GET['next']) && isset($_GET['department_id'])) {
  $dept = intval($_GET['department_id']);
  $today = date('Y-m-d');
  $stmt = $pdo->prepare('SELECT a.*,u.name as student_name,d.name as department FROM appointments a LEFT JOIN users u ON u.id=a.user_id JOIN departments d ON d.id=a.department_id WHERE a.department_id=? AND a.date=? AND a.status=? ORDER BY a.queue_number ASC LIMIT 1');
  $stmt->execute([$dept,$today,'pending']);
  $next = $stmt->fetch();
  echo json_encode($next ?: null); exit;
}

// GET appointments for user
if ($method === 'GET') {
  if (isset($_GET['mine'])) {
    $stmt = $pdo->prepare('SELECT a.*,d.name as department FROM appointments a JOIN departments d ON d.id=a.department_id WHERE a.user_id=? ORDER BY a.date DESC, a.time DESC');
    $stmt->execute([$user['id']]);
    echo json_encode($stmt->fetchAll()); exit;
  }
  // admin: today's queue per department
  if ($user['role'] === 'admin' && isset($_GET['today'])) {
    $today = date('Y-m-d');
    $stmt = $pdo->prepare('SELECT a.*,u.name as student_name,d.name as department FROM appointments a JOIN users u ON u.id=a.user_id JOIN departments d ON d.id=a.department_id WHERE a.date=? ORDER BY d.id, a.queue_number');
    $stmt->execute([$today]);
    echo json_encode($stmt->fetchAll()); exit;
  }
}

// PUT to update status or cancel/reschedule
if ($method === 'PUT') {
  parse_str(file_get_contents('php://input'), $data);
  $id = $data['id'] ?? 0;
  $action = $data['action'] ?? '';
  if (!$id) { echo json_encode(['error'=>'ID required']); exit; }
  if ($action === 'cancel') {
    $stmt = $pdo->prepare('UPDATE appointments SET status=? WHERE id=?');
    $stmt->execute(['cancelled',$id]);
    echo json_encode(['success'=>true]); exit;
  }
  if ($action === 'serve' && $user['role']==='admin') {
    $stmt = $pdo->prepare('UPDATE appointments SET status=? WHERE id=?');
    $stmt->execute(['in_service',$id]);
    echo json_encode(['success'=>true]); exit;
  }
  // serve the next pending appointment for a department
  if ($action === 'serve-next' && $user['role']==='admin') {
    $dept = $data['department_id'] ?? 0;
    if (!$dept) { echo json_encode(['error'=>'department_id required']); exit; }
    $today = date('Y-m-d');
    $stmt = $pdo->prepare('SELECT id FROM appointments WHERE department_id=? AND date=? AND status=? ORDER BY queue_number ASC LIMIT 1');
    $stmt->execute([$dept,$today,'pending']);
    $row = $stmt->fetch();
    if (!$row) { echo json_encode(['error'=>'No pending']); exit; }
    $stmt = $pdo->prepare('UPDATE appointments SET status=? WHERE id=?');
    $stmt->execute(['in_service',$row['id']]);
    // return the served appointment
    $stmt = $pdo->prepare('SELECT a.*,u.name as student_name,d.name as department FROM appointments a LEFT JOIN users u ON u.id=a.user_id JOIN departments d ON d.id=a.department_id WHERE a.id=?');
    $stmt->execute([$row['id']]);
    $appt = $stmt->fetch();
    echo json_encode(['success'=>true,'appointment'=>$appt]); exit;
  }
  if ($action === 'complete' && $user['role']==='admin') {
    $stmt = $pdo->prepare('UPDATE appointments SET status=? WHERE id=?');
    $stmt->execute(['completed',$id]);
    echo json_encode(['success'=>true]); exit;
  }
  // reschedule
  if ($action === 'reschedule') {
    $newdate = $data['date'] ?? '';
    $newtime = $data['time'] ?? '';
    if (!$newdate || !$newtime) { echo json_encode(['error'=>'Missing']); exit; }
    // compute new queue number
    $stmt = $pdo->prepare('SELECT MAX(queue_number) AS maxq FROM appointments WHERE department_id=(SELECT department_id FROM appointments WHERE id=?) AND date=?');
    $stmt->execute([$id,$newdate]);
    $row = $stmt->fetch();
    $next = ($row['maxq'] ?? 0) + 1;
    $stmt = $pdo->prepare('UPDATE appointments SET date=?,time=?,queue_number=?,status=? WHERE id=?');
    $stmt->execute([$newdate,$newtime,$next,'pending',$id]);
    echo json_encode(['success'=>true,'queue_number'=>$next]); exit;
  }
}

http_response_code(400);
echo json_encode(['error'=>'Invalid request']);
?>