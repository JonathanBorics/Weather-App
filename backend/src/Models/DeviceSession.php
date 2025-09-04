<?php
namespace WeatherApp\Models;

use PDO;
use WeatherApp\Core\Database;

class DeviceSession {
    private $conn;
    private $table = 'device_sessions';

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    /**
     * Új device session létrehozása vagy meglévő frissítése
     */
    public function createOrUpdate($sessionData) {
        // Először ellenőrizzük, hogy létezik-e már session ugyanezzel az IP-vel és user agent-tel
        $existing = $this->findByIpAndUserAgent($sessionData['ip_address'], $sessionData['user_agent']);
        
        if ($existing) {
            return $this->updateSession($existing['id'], $sessionData);
        } else {
            return $this->createSession($sessionData);
        }
    }

    /**
     * Új session létrehozása
     */
    private function createSession($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (user_id, session_id, ip_address, user_agent, is_mobile, is_tablet, is_desktop,
                   device_type, device_brand, device_model, browser_name, browser_version, platform,
                   country, country_code, region, city, latitude, longitude, timezone, isp, organization,
                   page_views, actions_count) 
                  VALUES 
                  (:user_id, :session_id, :ip_address, :user_agent, :is_mobile, :is_tablet, :is_desktop,
                   :device_type, :device_brand, :device_model, :browser_name, :browser_version, :platform,
                   :country, :country_code, :region, :city, :latitude, :longitude, :timezone, :isp, :organization,
                   1, 1)";
        
        $stmt = $this->conn->prepare($query);
        
        // Paraméterek bindolása
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':session_id', $data['session_id']);
        $stmt->bindParam(':ip_address', $data['ip_address']);
        $stmt->bindParam(':user_agent', $data['user_agent']);
        $stmt->bindParam(':is_mobile', $data['is_mobile'], PDO::PARAM_BOOL);
        $stmt->bindParam(':is_tablet', $data['is_tablet'], PDO::PARAM_BOOL);
        $stmt->bindParam(':is_desktop', $data['is_desktop'], PDO::PARAM_BOOL);
        $stmt->bindParam(':device_type', $data['device_type']);
        $stmt->bindParam(':device_brand', $data['device_brand']);
        $stmt->bindParam(':device_model', $data['device_model']);
        $stmt->bindParam(':browser_name', $data['browser_name']);
        $stmt->bindParam(':browser_version', $data['browser_version']);
        $stmt->bindParam(':platform', $data['platform']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':country_code', $data['country_code']);
        $stmt->bindParam(':region', $data['region']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':latitude', $data['latitude']);
        $stmt->bindParam(':longitude', $data['longitude']);
        $stmt->bindParam(':timezone', $data['timezone']);
        $stmt->bindParam(':isp', $data['isp']);
        $stmt->bindParam(':organization', $data['organization']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Meglévő session frissítése
     */
    private function updateSession($sessionId, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET last_activity = CURRENT_TIMESTAMP,
                      page_views = page_views + 1,
                      actions_count = actions_count + 1,
                      session_duration = TIMESTAMPDIFF(SECOND, first_seen, CURRENT_TIMESTAMP)
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $sessionId, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    /**
     * Session keresése IP és User Agent alapján (utolsó 24 órában)
     */
    private function findByIpAndUserAgent($ipAddress, $userAgent) {
        $query = "SELECT id, user_id, session_id FROM " . $this->table . " 
                  WHERE ip_address = :ip_address 
                  AND user_agent = :user_agent 
                  AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                  ORDER BY last_activity DESC 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Admin statisztikákhoz - összes session lekérése
     */
    public function getAllSessions($limit = 100, $offset = 0) {
        $query = "SELECT ds.*, u.email as user_email 
                  FROM " . $this->table . " ds
                  LEFT JOIN users u ON ds.user_id = u.id 
                  ORDER BY ds.last_activity DESC 
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Device típus statisztikák
     */
    public function getDeviceStats() {
        $query = "SELECT 
                    device_type,
                    COUNT(*) as count,
                    COUNT(DISTINCT ip_address) as unique_ips,
                    SUM(page_views) as total_page_views,
                    AVG(session_duration) as avg_duration
                  FROM " . $this->table . " 
                  GROUP BY device_type 
                  ORDER BY count DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Országok szerinti statisztikák
     */
    public function getCountryStats() {
        $query = "SELECT 
                    country,
                    country_code,
                    COUNT(*) as sessions,
                    COUNT(DISTINCT ip_address) as unique_visitors,
                    COUNT(DISTINCT user_id) as registered_users
                  FROM " . $this->table . " 
                  WHERE country IS NOT NULL
                  GROUP BY country, country_code 
                  ORDER BY sessions DESC 
                  LIMIT 20";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Böngésző statisztikák
     */
    public function getBrowserStats() {
        $query = "SELECT 
                    browser_name,
                    browser_version,
                    COUNT(*) as count,
                    AVG(session_duration) as avg_duration
                  FROM " . $this->table . " 
                  WHERE browser_name IS NOT NULL
                  GROUP BY browser_name, browser_version 
                  ORDER BY count DESC 
                  LIMIT 15";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Napi aktivitás statisztikák (utolsó 30 nap)
     */
    public function getDailyActivity() {
        $query = "SELECT 
                    DATE(last_activity) as activity_date,
                    COUNT(*) as sessions,
                    COUNT(DISTINCT ip_address) as unique_visitors,
                    COUNT(DISTINCT user_id) as active_users,
                    SUM(page_views) as total_page_views
                  FROM " . $this->table . " 
                  WHERE last_activity >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                  GROUP BY DATE(last_activity) 
                  ORDER BY activity_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Session törlése (régi sessionök takarítása)
     */
    public function cleanOldSessions($daysOld = 90) {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE last_activity < DATE_SUB(NOW(), INTERVAL :days DAY)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':days', $daysOld, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    /**
     * Session action logolása
     */
    public function logAction($sessionId, $deviceSessionId, $actionType, $actionDetails = [], $url = null, $method = 'GET', $responseCode = 200) {
        $query = "INSERT INTO session_actions 
                  (session_id, device_session_id, action_type, action_details, url, method, response_code) 
                  VALUES (:session_id, :device_session_id, :action_type, :action_details, :url, :method, :response_code)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $sessionId);
        $stmt->bindParam(':device_session_id', $deviceSessionId, PDO::PARAM_INT);
        $stmt->bindParam(':action_type', $actionType);
        $stmt->bindParam(':action_details', json_encode($actionDetails));
        $stmt->bindParam(':url', $url);
        $stmt->bindParam(':method', $method);
        $stmt->bindParam(':response_code', $responseCode, PDO::PARAM_INT);
        
        return $stmt->execute();
    }
}