<?php
namespace WeatherApp\Controllers;

// Importáljuk az összes szükséges osztályt
use WeatherApp\Core\WeatherService;
use WeatherApp\Models\City;
use WeatherApp\Models\FavoriteCity;
use WeatherApp\Models\WeatherArchive; // Ezt is hozzáadjuk!

class CitiesController {
    
    public function getFavorites($userData) {
        $userId = $userData->data->id;
        $favoriteCityModel = new FavoriteCity();
        $weatherService = new WeatherService();
        
        $favoriteCities = $favoriteCityModel->getByUserId($userId);
        $weatherData = [];

        foreach ($favoriteCities as $city) {
            $currentWeather = $weatherService->getCurrentWeather($city['lat'], $city['lon']);
            if ($currentWeather) {
                 $weatherData[] = [
                    'id' => $city['id'],
                    'cityName' => $city['name'],
                    'country' => $city['country'],
                    'temperature' => $currentWeather['main']['temp'],
                    'description' => $currentWeather['weather'][0]['description'],
                    'icon' => $currentWeather['weather'][0]['icon']
                 ];
            }
        }

        http_response_code(200);
        echo json_encode($weatherData);
    }

    public function addFavorite($userData) {
        $userId = $userData->data->id;
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->cityName)) {
            http_response_code(400);
            echo json_encode(['error' => 'City name is required.']);
            return;
        }

        $weatherService = new WeatherService();
        $cityCoords = $weatherService->getCoordsByCityName($data->cityName);

        if (!$cityCoords) {
            http_response_code(404);
            echo json_encode(['error' => 'City not found.']);
            return;
        }

        $cityModel = new City();
        $favoriteCityModel = new FavoriteCity();

        $city = $cityModel->findByCoords($cityCoords['lat'], $cityCoords['lon']);
        if ($city) {
            $cityId = $city['id'];
        } else {
            $cityId = $cityModel->create(
                $cityCoords['name'], 
                $cityCoords['country'], 
                $cityCoords['lat'], 
                $cityCoords['lon']
            );
        }

        if (!$cityId) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save city.']);
            return;
        }

        if ($favoriteCityModel->find($userId, $cityId)) {
            http_response_code(409);
            echo json_encode(['error' => 'City is already in favorites.']);
            return;
        }

        if ($favoriteCityModel->create($userId, $cityId)) {
            // --- AZONNALI ARCHIVÁLÁS ---
            $currentWeather = $weatherService->getCurrentWeather($cityCoords['lat'], $cityCoords['lon']);
            if ($currentWeather) {
                $archiveModel = new WeatherArchive();
                $archiveModel->create($cityId, $currentWeather);
            }
            // -----------------------------

            // A TE FRONTENDED a refreshCities()-t hívja, így elég egy egyszerű
            // sikeres üzenetet visszaküldeni, nem kell a teljes objektum.
            http_response_code(201);
            echo json_encode([
                'id' => $cityId,
                'cityName' => $cityCoords['name'],
                'message' => 'City added successfully.'
            ]);

        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add city to favorites.']);
        }
    }

    public function deleteFavorite($userData, $cityId) {
        $userId = $userData->data->id;
        
        if (empty($cityId)) {
            http_response_code(400);
            echo json_encode(['error' => 'City ID is required.']);
            return;
        }

        $favoriteCityModel = new FavoriteCity();
        if ($favoriteCityModel->delete($userId, $cityId)) {
            http_response_code(200);
            echo json_encode(['message' => 'City removed from favorites.']);
        } else {
             http_response_code(404);
             echo json_encode(['error' => 'Favorite city not found or already deleted.']);
        }
    }
}