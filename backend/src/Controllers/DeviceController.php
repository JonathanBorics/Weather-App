<?php
namespace WeatherApp\Controllers;

use WeatherApp\Models\DeviceSession;

class DeviceController {

    /**
     * Eszköz session adatok mentése
     */
    public function createSession() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validáció
        if (empty($data['sessionId']) || empty($data['userAgent'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID and User Agent are required.']);
            return;
        }

        // IP cím lekérése
        $ipAddress = $this->getClientIP();
        
        // Session adatok összeállítása
        $sessionData = [
            'user_id' => $data['userId'] ?? null,
            'session_id' => $data['sessionId'],
            'ip_address' => $ipAddress,
            'user_agent' => $data['userAgent'],
            'is_mobile' => $data['isMobile'] ?? false,
            'is_tablet' => $data['isTablet'] ?? false,
            'is_desktop' => $data['isDesktop'] ?? true,
            'device_type' => $data['deviceType'] ?? 'desktop',
            'device_brand' => $data['deviceBrand'] ?? null,
            'device_model' => $data['deviceModel'] ?? null,
            'browser_name' => $data['browserInfo']['name'] ?? 'Unknown',
            'browser_version' => $data['browserInfo']['version'] ?? 'Unknown',
            'platform' => $data['browserInfo']['platform'] ?? 'Unknown',
            'country' => $data['country'] ?? null,
            'country_code' => $data['countryCode'] ?? null,
            'region' => $data['region'] ?? null,
            'city' => $data['city'] ?? null,
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'timezone' => $data['timezone'] ?? null,
            'isp' => $data['isp'] ?? null,
            'organization' => $data['organization'] ?? null
        ];

        $deviceSessionModel = new DeviceSession();
        $sessionId = $deviceSessionModel->createOrUpdate($sessionData);

        if ($sessionId) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Device session created successfully.',
                'sessionId' => $sessionId
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create device session.']);
        }
    }

    /**
     * Admin számára - eszköz session statisztikák
     */
    public function getDeviceStats() {
        $deviceSessionModel = new DeviceSession();
        
        try {
            $stats = [
                'deviceTypes' => $deviceSessionModel->getDeviceStats(),
                'countries' => $deviceSessionModel->getCountryStats(),
                'browsers' => $deviceSessionModel->getBrowserStats(),
                'dailyActivity' => $deviceSessionModel->getDailyActivity()
            ];

            http_response_code(200);
            echo json_encode($stats);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch device statistics.']);
        }
    }

    /**
     * Admin számára - összes session listája
     */
    public function getAllSessions($limit = 100, $offset = 0) {
        $deviceSessionModel = new DeviceSession();
        
        try {
            $sessions = $deviceSessionModel->getAllSessions($limit, $offset);
            
            http_response_code(200);
            echo json_encode($sessions);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch sessions.']);
        }
    }

    /**
     * Action logging
     */
    public function logAction() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['sessionId']) || empty($data['actionType'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Session ID and action type are required.']);
            return;
        }

        $deviceSessionModel = new DeviceSession();
        
        $success = $deviceSessionModel->logAction(
            $data['sessionId'],
            $data['deviceSessionId'] ?? null,
            $data['actionType'],
            $data['actionDetails'] ?? [],
            $data['url'] ?? $_SERVER['REQUEST_URI'] ?? null,
            $data['method'] ?? $_SERVER['REQUEST_METHOD'] ?? 'GET',
            $data['responseCode'] ?? 200
        );

        if ($success) {
            http_response_code(200);
            echo json_encode(['message' => 'Action logged successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to log action.']);
        }
    }

    /**
     * Kliens IP cím meghatározása
     */
    private function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                // Ha több IP van (proxy esetén), az első a valós kliens IP
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                // Validáció
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}