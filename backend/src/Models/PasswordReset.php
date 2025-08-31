<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class PasswordReset {
    private $conn;
    private $table = 'password_resets';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    /**
     * Létrehoz egy új jelszó-visszaállító kérést.
     * Ha már létezik kérés ehhez az emailhez, felülírja.
     */
    public function create($email, $token) {
        // Töröljük a korábbi kérést, ha volt
        $this->deleteByEmail($email);

        $query = "INSERT INTO " . $this->table . " (email, token, expires_at) VALUES (:email, :token, :expires_at)";
        $stmt = $this->conn->prepare($query);

        // A lejárati idő 1 óra múlva
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires_at', $expires_at);

        return $stmt->execute();
    }

    /**
     * Megkeres egy kérést a token alapján.
     */
    public function findByToken($token) {
        $query = "SELECT * FROM " . $this->table . " WHERE token = :token LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Töröl egy kérést email alapján.
     */
    public function deleteByEmail($email) {
        $query = "DELETE FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        return $stmt->execute();
    }
}