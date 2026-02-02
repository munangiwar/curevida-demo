<?php
header('Content-Type: application/json');

/* Basic validation */
if (
  empty($_POST['first_name']) ||
  empty($_POST['last_name']) ||
  empty($_POST['mobile']) ||
  empty($_POST['email']) ||
  empty($_POST['appointment_date']) ||
  empty($_POST['appointment_time'])
) {
  echo json_encode([
    "success" => false,
    "message" => "Please fill in all required fields."
  ]);
  exit;
}

/* Sanitize input */
$firstName = htmlspecialchars(trim($_POST['first_name']));
$lastName  = htmlspecialchars(trim($_POST['last_name']));
$mobile    = htmlspecialchars(trim($_POST['mobile']));
$email     = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$date      = $_POST['appointment_date'];
$time      = $_POST['appointment_time'];
$message   = htmlspecialchars(trim($_POST['message'] ?? ''));

/* Email settings */
$to = "munangiwa.chosen1@icloud.com"; // change if needed
$subject = "New Appointment Request - Cure-Vida";

$body = "
New Appointment Request

Name: $firstName $lastName
Mobile: $mobile
Email: $email
Date: $date
Time: $time

Message:
$message
";

$headers = "From: Cure-Vida Website <no-reply@curevida.co.za>\r\n";
$headers .= "Reply-To: $email\r\n";

/* Send email */
if (mail($to, $subject, $body, $headers)) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Unable to send request. Please try again."
  ]);
}
