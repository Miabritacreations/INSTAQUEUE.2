<?php
// config.php
// Read DB settings from environment variables (works with Docker Compose)
// You can override these by creating a `config.local.php` in the same folder
// with definitions for $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS (NOT committed).
// Example `config.local.php` content:
// <?php
// $DB_HOST = '127.0.0.1';
// $DB_NAME = 'instaqueue';
// $DB_USER = 'root';
// $DB_PASS = 'mypassword';
// ?>

// Load local overrides if present (keeps credentials out of git)
if (file_exists(__DIR__ . '/config.local.php')) {
  include __DIR__ . '/config.local.php';
}

$DB_HOST = isset($DB_HOST) ? $DB_HOST : (getenv('DB_HOST') ?: '127.0.0.1');
$DB_NAME = isset($DB_NAME) ? $DB_NAME : (getenv('DB_NAME') ?: 'instaqueue');
$DB_USER = isset($DB_USER) ? $DB_USER : (getenv('DB_USER') ?: 'root');
$DB_PASS = isset($DB_PASS) ? $DB_PASS : (getenv('DB_PASS') ?: '');

try {
  $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed: '.$e->getMessage()]);
  exit;
}

function require_json() {
  header('Content-Type: application/json');
}

?>