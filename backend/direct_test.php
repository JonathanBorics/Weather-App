<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['MAIL_USERNAME'];
    $mail->Password   = $_ENV['MAIL_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $_ENV['MAIL_PORT'];
    $mail->SMTPDebug  = 2; // Részletes debug

    $mail->setFrom($_ENV['MAIL_FROM'], 'Test App');
    $mail->addAddress('test@example.com');

    $mail->isHTML(true);
    $mail->Subject = 'Test email';
    $mail->Body    = 'Ez egy teszt email.';

    $mail->send();
    echo 'Teszt email elküldve!';
} catch (Exception $e) {
    echo "Hiba: {$mail->ErrorInfo}";
}
?>