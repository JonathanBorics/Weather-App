<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class FavoriteCity {
    private $conn;
    private $table = 'favorite_cities';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function find($userId, $cityId) {
        $query = "SELECT * FROM " . $this->table . " WHERE user_id = :user_id AND city_id = :city_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':city_id', $cityId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($userId, $cityId) {
        $query = "INSERT INTO " . $this->table . " (user_id, city_id) VALUES (:user_id, :city_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':city_id', $cityId);
        return $stmt->execute();
    }

    public function delete($userId, $cityId) {
        $query = "DELETE FROM " . $this->table . " WHERE user_id = :user_id AND city_id = :city_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':city_id', $cityId);
        return $stmt->execute();
    }

    public function getByUserId($userId) {
        // JOIN-oljuk a cities táblával, hogy a városok adatait is megkapjuk
        $query = "SELECT c.id, c.name, c.country, c.lat, c.lon FROM " . $this->table . " fc
                  JOIN cities c ON fc.city_id = c.id
                  WHERE fc.user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
     /**
     * Lekéri a legnépszerűbb városokat a kedvencek száma alapján. Admin funkció.
     */
    public function getPopularityStats() {
        $query = "SELECT c.id, c.name, c.country, COUNT(fc.city_id) as favorite_count
                  FROM " . $this->table . " fc
                  JOIN cities c ON fc.city_id = c.id
                  GROUP BY fc.city_id
                  ORDER BY favorite_count DESC, c.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}