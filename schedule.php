<?php
// ── TMCF Enrollment Hub — Scheduled Availability Middleware ──
// Enforces Mon–Sat, 8:00–11:00 AM and 1:00–4:00 PM (Philippine Standard Time)
 
date_default_timezone_set('Asia/Manila');  // UTC+8
 
$now     = new DateTime();
$dayNum  = (int)$now->format('N');   // 1=Monday … 7=Sunday
$hour    = (int)$now->format('G');   // 0–23, no leading zero
$minute  = (int)$now->format('i');
$time    = $hour * 60 + $minute;     // Convert to minutes since midnight
 
// Operating windows (in minutes since midnight)
$amOpen  = 8  * 60;   // 8:00 AM  = 480 min
$amClose = 11 * 60;   // 11:00 AM = 660 min
$pmOpen  = 13 * 60;   // 1:00 PM  = 780 min
$pmClose = 16 * 60;   // 4:00 PM  = 960 min
 
// Always allow the health endpoint through (for UptimeRobot monitoring)
if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] === '/health') {
    http_response_code(200);
    echo 'OK';
    exit;

}
 
// Check if we're within an operating window
$isWeekday     = ($dayNum >= 1 && $dayNum <= 6);  // Mon–Sat
$isMorningSlot = ($time >= $amOpen && $time < $amClose);
$isAfternoonSlot = ($time >= $pmOpen && $time < $pmClose);
 
if (!$isWeekday || (!$isMorningSlot && !$isAfternoonSlot)) {
    // Outside operating hours — show maintenance page
    http_response_code(503);
    include __DIR__ . '/maintenance.html';
    exit;
}
// If we reach here, we're within operating hours — continue loading the app
?>

