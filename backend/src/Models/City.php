<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class City {
    private $conn;
    private $table = 'cities';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function findByCoords($lat, $lon) {
        $query = "SELECT id FROM " . $this->table . " WHERE lat = :lat AND lon = :lon LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':lat', $lat);
        $stmt->bindParam(':lon', $lon);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($name, $country, $lat, $lon) {
        $query = "INSERT INTO " . $this->table . " (name, country, lat, lon) VALUES (:name, :country, :lat, :lon)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':country', $country);
        $stmt->bindParam(':lat', $lat);
        $stmt->bindParam(':lon', $lon);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}