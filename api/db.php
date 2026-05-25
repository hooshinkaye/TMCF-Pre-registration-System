<?php
// ── Database Connection ──
// Connects to PostgreSQL on Render

$db_host = getenv('DATABASE_URL') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'tmcf_enrollment';
$db_user = getenv('DB_USER') ?: 'postgres';
$db_pass = getenv('DB_PASS') ?: '';
$db_port = getenv('DB_PORT') ?: '5432';

// Parse DATABASE_URL if provided (Render format)
if (strpos($db_host, 'postgres://') === 0 || strpos($db_host, 'postgresql://') === 0) {
    $url = parse_url($db_host);
    $db_host = $url['host'];
    $db_user = $url['user'];
    $db_pass = $url['pass'];
    $db_name = ltrim($url['path'], '/');
    $db_port = $url['port'] ?? 5432;
}

try {
    $pdo = new PDO(
        "pgsql:host=$db_host;port=$db_port;dbname=$db_name",
        $db_user,
        $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}
?>
