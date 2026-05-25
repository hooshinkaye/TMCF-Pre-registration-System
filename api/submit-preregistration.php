<?php
// ── Submit Pre-Registration Form ──
// Handles form submissions and stores in database

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

require_once __DIR__ . '/db.php';

// Honeypot check
if (!empty($_POST['website_url'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid submission']));
}

try {
    // Prepare data
    $last_name = trim($_POST['ln'] ?? '');
    $first_name = trim($_POST['fn'] ?? '');
    $middle_name = trim($_POST['mn'] ?? '');
    $ext_name = trim($_POST['ext'] ?? '');
    $gender = trim($_POST['gen'] ?? '');
    $birthdate = trim($_POST['bday'] ?? '');
    $age = (int)($_POST['age'] ?? 0);
    $religion = trim($_POST['rel'] ?? '');
    $address = trim($_POST['addr'] ?? '');
    $program = trim($_POST['prog'] ?? '');
    $shsg = trim($_POST['shsg'] ?? '');
    $shss = trim($_POST['shss'] ?? '');
    $jhsg = trim($_POST['jhsg'] ?? '');
    $elemg = trim($_POST['elemg'] ?? '');
    $latitude = trim($_POST['lat'] ?? '');
    $longitude = trim($_POST['lng'] ?? '');
    $quiz_answer = trim($_POST['quiz'] ?? '');

    // Validate required fields
    if (empty($last_name) || empty($first_name) || empty($program)) {
        http_response_code(400);
        die(json_encode(['error' => 'Missing required fields']));
    }

    // Handle photo upload
    $photo_filename = null;
    if (!empty($_FILES['profile_pic'])) {
        $file = $_FILES['profile_pic'];
        $upload_dir = __DIR__ . '/../uploads/profile_pics/';
        
        // Create directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Validate file
        $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowed_types)) {
            http_response_code(400);
            die(json_encode(['error' => 'Invalid photo format']));
        }

        if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
            http_response_code(400);
            die(json_encode(['error' => 'Photo too large']));
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $photo_filename = uniqid('reg_', true) . '.' . $ext;
        $upload_path = $upload_dir . $photo_filename;

        if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
            http_response_code(500);
            die(json_encode(['error' => 'Failed to upload photo']));
        }
    }

    // Insert into database
    $sql = <<<SQL
        INSERT INTO pre_registrations (
            last_name, first_name, middle_name, ext_name, gender, birthdate, age, religion, address,
            program, shsg, shss, jhsg, elemg, latitude, longitude, quiz_answer, photo_filename, submitted_at
        ) VALUES (
            :last_name, :first_name, :middle_name, :ext_name, :gender, :birthdate, :age, :religion, :address,
            :program, :shsg, :shss, :jhsg, :elemg, :latitude, :longitude, :quiz_answer, :photo_filename, NOW()
        )
    SQL;

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':last_name' => $last_name,
        ':first_name' => $first_name,
        ':middle_name' => $middle_name,
        ':ext_name' => $ext_name,
        ':gender' => $gender,
        ':birthdate' => $birthdate,
        ':age' => $age,
        ':religion' => $religion,
        ':address' => $address,
        ':program' => $program,
        ':shsg' => $shsg,
        ':shss' => $shss,
        ':jhsg' => $jhsg,
        ':elemg' => $elemg,
        ':latitude' => $latitude,
        ':longitude' => $longitude,
        ':quiz_answer' => $quiz_answer,
        ':photo_filename' => $photo_filename,
    ]);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Pre-registration submitted successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Submission failed: ' . $e->getMessage()]);
}
?>
