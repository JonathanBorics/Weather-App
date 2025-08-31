<?php
namespace WeatherApp\Core;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);
        
        // Szerver beállítások (Mailtrap adatok az .env-ből)
        $this->mailer->isSMTP();
        $this->mailer->Host       = $_ENV['MAIL_HOST'];
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = $_ENV['MAIL_USERNAME'];
        $this->mailer->Password   = $_ENV['MAIL_PASSWORD'];
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port       = $_ENV['MAIL_PORT'];
        $this->mailer->CharSet    = 'UTF-8';
    }

    public function sendPasswordResetEmail($recipientEmail, $token) {
        try {
            // Címzettek
            $this->mailer->setFrom($_ENV['MAIL_FROM'], 'Időjárás App');
            $this->mailer->addAddress($recipientEmail);

            // Tartalom
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Jelszó visszaállítási kérelem';
            
            // A frontend URL-jét érdemes lenne szintén .env-be tenni
            $resetLink = "http://localhost:3000/reset-password?token=" . $token; 

            $this->mailer->Body = "Kedves Felhasználó!<br><br>Kérés érkezett a jelszavad visszaállítására. A jelszavad megváltoztatásához kattints az alábbi linkre:<br><br><a href='{$resetLink}'>Jelszó visszaállítása</a><br><br>Ha nem te kérted ezt, hagyd figyelmen kívül ezt az emailt.<br><br>Üdvözlettel,<br>Az Időjárás App csapata";
            $this->mailer->AltBody = "A jelszavad visszaállításához keresd fel a következő linket: " . $resetLink;

            $this->mailer->send();
            return true;
        } catch (Exception $e) {
              // ------ IDEIGLENES HIBAKERESÉSI KÓD ------
    // Állítsuk le a program futását és írjuk ki a pontos hibát.
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'error' => 'PHPMailer hiba történt az e-mail küldésekor.',
        'details' => $this->mailer->ErrorInfo, // Ez a PHPMailer saját, részletes hibaüzenete
        'exception_message' => $e->getMessage()
    ]);
    exit;
        }
    }
}