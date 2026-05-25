<?php
// ── Get Pre-Registrations ──
// Retrieves all pre-registrations or filtered by program
// Optional query params: program, limit, offset

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

try {
    $program = $_GET['program'] ?? null;
    $limit = (int)($_GET['limit'] ?? 100);
    $offset = (int)($_GET['offset'] ?? 0);

    $where = '';
    $params = [];

    if ($program) {
        $where = 'WHERE program = :program';
        $params[':program'] = $program;
    }

    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM pre_registrations $where";
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute($params);
    $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get records
    $sql = "SELECT * FROM pre_registrations $where ORDER BY submitted_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'total' => $total,
        'count' => count($registrations),
        'limit' => $limit,
        'offset' => $offset,
        'data' => $registrations
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to retrieve registrations: ' . $e->getMessage()]);
}
?>
