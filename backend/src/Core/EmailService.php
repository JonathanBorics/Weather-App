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

    public function sendActivationEmail($recipientEmail, $token) {
    try {
        // Debug log
        error_log("=== EMAIL KÜLDÉS KEZDÉS ===");
        error_log("Címzett: " . $recipientEmail);
        error_log("Token: " . $token);
        
        // Mailer reset
        $this->mailer->clearAddresses();
        $this->mailer->clearAttachments();
        
        // Címzettek
        $this->mailer->setFrom($_ENV['MAIL_FROM'], 'Időjárás App');
        $this->mailer->addAddress($recipientEmail);

        // Tartalom
        $this->mailer->isHTML(true);
        $this->mailer->Subject = 'Fiók aktiválás - Időjárás App';
        
        $activationLink = "http://localhost:3000/activate?token=" . $token;
        error_log("Aktiválási link: " . $activationLink);

        $this->mailer->Body = "
            <h2>Üdvözöljük az Időjárás App-ban!</h2>
            <p>Kedves Felhasználó!</p>
            <p>Köszönjük a regisztrációt! A fiókja aktiválásához kattintson az alábbi linkre:</p>
            <p><a href='{$activationLink}' style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;'>Fiók aktiválása</a></p>
            <p>Vagy másolja be ezt a linket a böngészőjébe:<br><a href='{$activationLink}'>{$activationLink}</a></p>
            <p><strong>Fontos:</strong> Ez a link 24 órán belül lejár.</p>
            <p>Ha nem ön regisztrált, kérjük hagyja figyelmen kívül ezt az emailt.</p>
            <br>
            <p>Üdvözlettel,<br>Az Időjárás App csapata</p>
        ";
        
        $this->mailer->AltBody = "
            Üdvözöljük az Időjárás App-ban!
            
            A fiókja aktiválásához látogasson el erre a linkre: {$activationLink}
            
            Ez a link 24 órán belül lejár.
            
            Üdvözlettel,
            Az Időjárás App csapata
        ";

        error_log("Email küldés megkezdése...");
        $result = $this->mailer->send();
        error_log("Email küldés eredménye: " . ($result ? 'SIKERES' : 'SIKERTELEN'));
        
        return $result;
        
    } catch (Exception $e) {
        error_log('=== EMAIL HIBA ===');
        error_log('Exception: ' . $e->getMessage());
        error_log('SMTP Error: ' . $this->mailer->ErrorInfo);
        error_log('==================');
        return false;
    }
}
}