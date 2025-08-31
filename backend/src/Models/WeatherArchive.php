<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class WeatherArchive {
    private $conn;
    private $table = 'weather_archives';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function create($cityId, $weatherData) {
        $query = "INSERT INTO " . $this->table . 
                 " (city_id, `date`, temperature, description, icon, humidity, wind_speed) 
                   VALUES (:city_id, CURDATE(), :temperature, :description, :icon, :humidity, :wind_speed)
                   ON DUPLICATE KEY UPDATE 
                   temperature = VALUES(temperature), 
                   description = VALUES(description),
                   icon = VALUES(icon),
                   humidity = VALUES(humidity),
                   wind_speed = VALUES(wind_speed)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':city_id', $cityId, PDO::PARAM_INT);
        $stmt->bindParam(':temperature', $weatherData['main']['temp']);
        $stmt->bindParam(':description', $weatherData['weather'][0]['description']);
        $stmt->bindParam(':icon', $weatherData['weather'][0]['icon']);
        $stmt->bindParam(':humidity', $weatherData['main']['humidity']);
        $stmt->bindParam(':wind_speed', $weatherData['wind']['speed']);

        return $stmt->execute();
    }

    public function findByCityId($cityId) {
        $query = "SELECT `date`, temperature, description, icon, humidity, wind_speed 
                  FROM " . $this->table . " 
                  WHERE city_id = :city_id 
                  ORDER BY `date` DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':city_id', $cityId, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}