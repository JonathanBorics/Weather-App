<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class User {
    private $conn;
    private $table = 'users';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function findByEmail($email) {
        $query = "SELECT id, email, password, role, is_active FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($email, $password) {
        $query = "INSERT INTO " . $this->table . " (email, password, role, is_active) VALUES (:email, :password, 'user', 0)"; // is_active=0 alapból, email validációig
        $stmt = $this->conn->prepare($query);

        // Adatok tisztítása
        $email = htmlspecialchars(strip_tags($email));
        
        // Jelszó hashelése
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

     public function updatePassword($email, $newPassword) {
        $query = "UPDATE " . $this->table . " SET password = :password WHERE email = :email";
        $stmt = $this->conn->prepare($query);

        $hashed_password = password_hash($newPassword, PASSWORD_BCRYPT);

        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':email', $email);

        return $stmt->execute();
    }

     /**
     * Lekéri az összes felhasználót (jelszó nélkül). Admin funkció.
     */
    public function findAll() {
        $query = "SELECT id, email, role, is_active, created_at FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Frissíti egy felhasználó státuszát (is_active). Admin funkció.
     * @param int $userId A módosítandó felhasználó ID-ja
     * @param bool $isActive Az új státusz (1 = aktív, 0 = inaktív)
     */
    public function updateStatus($userId, $isActive) {
        $query = "UPDATE " . $this->table . " SET is_active = :is_active WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Biztosítjuk, hogy 0 vagy 1 legyen az érték
        $status = $isActive ? 1 : 0;

        $stmt->bindParam(':is_active', $status, PDO::PARAM_INT);
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Töröl egy felhasználót ID alapján. Admin funkció.
     */
    public function delete($userId) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

}