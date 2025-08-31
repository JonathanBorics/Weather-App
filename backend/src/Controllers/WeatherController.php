<?php
namespace WeatherApp\Controllers;

// Namespace-ek importálása. Ezek megmondják, hol keressük az osztályokat.
use WeatherApp\Core\Database;
use WeatherApp\Core\Auth;
// JAVÍTVA: A WeatherService a 'Core' mappában van, nem a 'Services'-ben.
use WeatherApp\Core\WeatherService;
use WeatherApp\Models\WeatherArchive; // Ezt is be kellett importálni
use WeatherApp\Models\FavoriteCity;   // Ezt is be kellett importálni

class WeatherController
{
    private $db;
    private $weatherService;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        // A 'use' utasítás miatt a PHP tudja, hol keresse a WeatherService-t.
        $this->weatherService = new WeatherService();
    }
    
    /**
     * Ezt a funkciót a GuestController-ben valósítottuk meg,
     * a konzisztencia kedvéért érdemes ott hagyni, de ha itt szeretnéd
     * használni, akkor a routert kell majd módosítani.
     */
    public function getGuestWeather()
    {
        try {
            $guestCities = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'];
            $weatherData = [];

            foreach ($guestCities as $cityName) {
                $cityCoords = $this->weatherService->getCoordsByCityName($cityName);
                if ($cityCoords) {
                    $weather = $this->weatherService->getCurrentWeather($cityCoords['lat'], $cityCoords['lon']);
                    if ($weather) {
                        $weatherData[] = [
                            'id' => $weather['name'],
                            'cityName' => $weather['name'],
                            'country' => $weather['sys']['country'],
                            'temperature' => round($weather['main']['temp']),
                            'condition' => $weather['weather'][0]['main'],
                            'description' => $weather['weather'][0]['description'],
                            'icon' => $weather['weather'][0]['icon'],
                            'humidity' => $weather['main']['humidity'],
                            'windSpeed' => $weather['wind']['speed'] ?? 0
                        ];
                    }
                }
            }
            http_response_code(200);
            echo json_encode($weatherData);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch guest weather data: ' . $e->getMessage()]);
        }
    }

    /**
     * Lekéri egy adott város időjárási archívumát.
     * Ez a mi közösen megírt, Model-alapú verziónk, ami biztonságosabb.
     */
    public function getArchiveByCityId($userData, $cityId)
    {
        $userId = $userData->data->id;

        // Biztonsági ellenőrzés: A felhasználó csak a saját kedvenc városainak
        // archívumát nézhesse meg.
        $favoriteCityModel = new FavoriteCity();
        $favorite = $favoriteCityModel->find($userId, $cityId);

        if (!$favorite) {
            http_response_code(403); // Forbidden
            echo json_encode(['error' => 'Access denied. This city is not in your favorites.']);
            return;
        }

        $archiveModel = new WeatherArchive();
        $archiveData = $archiveModel->findByCityId($cityId);

        http_response_code(200);
        echo json_encode($archiveData);
    }
    
    /**
     * Ezt a funkciót az archive_runner.php szkript végzi el,
     * a konzisztencia érdekében nem a kontrollerben van a helye, de itt hagyom referenciaként.
     * A mi logikánk szerint ez a Model-ben van (WeatherArchive->create).
     */
    public function saveWeatherArchive($cityId, $weatherData)
    {
        try {
            // Ez a kód a WeatherArchive Model create() metódusában már meg van valósítva.
            $archiveModel = new WeatherArchive();
            $archiveModel->create($cityId, $weatherData);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            error_log('Failed to save weather archive from controller: ' . $e->getMessage());
        }
    }
}