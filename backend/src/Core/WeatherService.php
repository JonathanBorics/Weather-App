<?php
namespace WeatherApp\Core;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class WeatherService {
    private $client;
    private $apiKey;
    private $geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct";
    private $weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

    public function __construct() {
        $this->client = new Client();
        $this->apiKey = $_ENV['OPENWEATHER_API_KEY'];
    }

    /**
     * Lekéri egy város koordinátáit a neve alapján.
     * @return array|null Visszaadja az első találat adatait, vagy null-t ha nincs találat.
     */
    public function getCoordsByCityName($cityName) {
        try {
            $response = $this->client->get($this->geoApiUrl, [
                'query' => [
                    'q' => $cityName,
                    'limit' => 1,
                    'appid' => $this->apiKey
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            if (!empty($data)) {
                return [
                    'name' => $data[0]['name'],
                    'country' => $data[0]['country'],
                    'lat' => $data[0]['lat'],
                    'lon' => $data[0]['lon']
                ];
            }
            return null;

        } catch (RequestException $e) {
            // Itt lehetne naplózni a hibát
            return null;
        }
    }
    
    /**
     * Lekéri az aktuális időjárási adatokat koordináták alapján.
     * @return array|null
     */
    public function getCurrentWeather($lat, $lon) {
        try {
            $response = $this->client->get($this->weatherApiUrl, [
                'query' => [
                    'lat' => $lat,
                    'lon' => $lon,
                    'appid' => $this->apiKey,
                    'units' => 'metric', // Hogy Celsiust kapjunk
                    'lang' => 'hu'      // Magyar nyelvű leírás
                ]
            ]);

            return json_decode($response->getBody(), true);

        } catch (RequestException $e) {
            return null;
        }
    }
}