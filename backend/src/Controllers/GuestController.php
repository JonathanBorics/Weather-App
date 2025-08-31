<?php
namespace WeatherApp\Controllers;

use WeatherApp\Core\WeatherService;

class GuestController {
    public function getWeatherForGuests() {
        // Előre definiált lista a városokról
        $guestCities = ['London', 'Paris', 'New York', 'Tokyo', 'Sydney'];
        $weatherService = new WeatherService();
        $weatherData = [];

        foreach ($guestCities as $cityName) {
            // A koordináták alapján kérjük le az időjárást, hogy több adatot kapjunk
            $cityCoords = $weatherService->getCoordsByCityName($cityName);
            if ($cityCoords) {
                $currentWeather = $weatherService->getCurrentWeather($cityCoords['lat'], $cityCoords['lon']);
                if ($currentWeather) {
                    $weatherData[] = [
                        'cityName' => $cityCoords['name'],
                        'country' => $cityCoords['country'],
                        'temperature' => $currentWeather['main']['temp'],
                        'description' => $currentWeather['weather'][0]['description'],
                        'icon' => $currentWeather['weather'][0]['icon']
                    ];
                }
            }
        }
        
        http_response_code(200);
        echo json_encode($weatherData);
    }
}