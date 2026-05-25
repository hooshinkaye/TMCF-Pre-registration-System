<?php
// ── Database Initialization ──
// Creates the pre_registrations table if it doesn't exist
// Run this once on deployment

require_once __DIR__ . '/db.php';

try {
    $sql = <<<SQL
        CREATE TABLE IF NOT EXISTS pre_registrations (
            id SERIAL PRIMARY KEY,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100),
            ext_name VARCHAR(50),
            gender VARCHAR(20),
            birthdate DATE,
            age INTEGER,
            religion VARCHAR(100),
            address TEXT,
            program VARCHAR(200) NOT NULL,
            shsg VARCHAR(50),
            shss VARCHAR(50),
            jhsg VARCHAR(50),
            elemg VARCHAR(50),
            latitude VARCHAR(50),
            longitude VARCHAR(50),
            quiz_answer TEXT,
            photo_filename VARCHAR(255),
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_submitted_at ON pre_registrations(submitted_at DESC);
        CREATE INDEX IF NOT EXISTS idx_program ON pre_registrations(program);
        CREATE INDEX IF NOT EXISTS idx_last_name ON pre_registrations(last_name);
    SQL;

    $pdo->exec($sql);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Database initialized successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database initialization failed: ' . $e->getMessage()]);
}
?>
