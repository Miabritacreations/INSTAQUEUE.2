<?php
require 'config.php';
session_start();
require_json();
$user = $_SESSION['user'] ?? null;
if (!$user || $user['role'] !== 'admin') { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }

// basic analytics
// total appointments today
$today = date('Y-m-d');
$stmt = $pdo->prepare('SELECT COUNT(*) as total FROM appointments WHERE date=?');
$stmt->execute([$today]);
$total = $stmt->fetch();

// most requested service (department)
$stmt = $pdo->prepare('SELECT d.name, COUNT(*) as cnt FROM appointments a JOIN departments d ON d.id=a.department_id WHERE a.date=? GROUP BY a.department_id ORDER BY cnt DESC LIMIT 1');
$stmt->execute([$today]);
$top = $stmt->fetch();

// average waiting time (approx: assume 15 min per served appointment)
$stmt = $pdo->prepare('SELECT AVG(queue_number) as avgq FROM appointments WHERE date=?');
$stmt->execute([$today]);
$avgq = $stmt->fetch();
$avg_wait = round(($avgq['avgq'] ?? 0) * 15);

echo json_encode(['total_today'=>$total['total'] ?? 0,'top_service'=>$top ?? null,'avg_wait_minutes'=>$avg_wait]);
?>