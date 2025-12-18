<?php
// seed.php — run from CLI to seed admin and sample data
require 'config.php';

// create admin user if not exists
$email = 'admin@example.com';
$pwd = 'admin123';
$stmt = $pdo->prepare('SELECT id FROM users WHERE email=?');
$stmt->execute([$email]);
if (!$stmt->fetch()) {
  $hash = password_hash($pwd, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
  $stmt->execute(['Admin User',$email,$hash,'admin']);
  echo "Admin user created: $email / $pwd\n";
} else { echo "Admin already exists\n"; }

// ensure departments present (idempotent)
$depts = [
  ['Registrar','Academic records, transcripts, registration'],
  ['Finance / Fees Office','Payments and financial enquiries'],
  ['ICT / Technical Support','IT help desk'],
  ['Library Services','Library and borrowing']
];
foreach ($depts as $d) {
  $stmt = $pdo->prepare('SELECT id FROM departments WHERE name=?');
  $stmt->execute([$d[0]]);
  if (!$stmt->fetch()) {
    $stmt = $pdo->prepare('INSERT INTO departments (name,description) VALUES (?,?)');
    $stmt->execute([$d[0],$d[1]]);
    echo "Inserted department: {$d[0]}\n";
  }
}

echo "Seeding done.\n";
?>