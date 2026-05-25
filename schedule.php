<?php
// ── TMCF Enrollment Hub — Always Available ──
// Maintenance page only shows on system crashes
 
// Always allow the health endpoint through (for UptimeRobot monitoring)
if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] === '/health') {
    http_response_code(200);
    echo 'OK';
    exit;
}
 
// System is always available — continue loading the app
?>

