<?php
namespace WeatherApp\Controllers;

// EZEK A SOROK A LÉNYEGESEK, HOGY A PHP MEGTALÁLJA A TÖBBI OSZTÁLYT:
use WeatherApp\Core\WeatherService;
use WeatherApp\Models\City;
use WeatherApp\Models\FavoriteCity;

class CitiesController {
    
    /**
     * Lekéri a felhasználó kedvenc városait és azok aktuális időjárását.
     */
    public function getFavorites($userData) {
        $userId = $userData->data->id;
        $favoriteCityModel = new FavoriteCity();
        $weatherService = new WeatherService();
        
        $favoriteCities = $favoriteCityModel->getByUserId($userId);
        $weatherData = [];

        foreach ($favoriteCities as $city) {
            $currentWeather = $weatherService->getCurrentWeather($city['lat'], $city['lon']);
            if ($currentWeather) {
                // Kombináljuk a DB-ből származó adatot az API válasszal
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

    /**
     * Új kedvenc várost ad hozzá a felhasználóhoz.
     */
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

        // Létezik már a város az adatbázisunkban?
        $city = $cityModel->findByCoords($cityCoords['lat'], $cityCoords['lon']);
        if ($city) {
            $cityId = $city['id'];
        } else {
            // Ha nem, hozzuk létre
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

        // Hozzá van már adva a kedvencekhez?
        if ($favoriteCityModel->find($userId, $cityId)) {
            http_response_code(409); // Conflict
            echo json_encode(['error' => 'City is already in favorites.']);
            return;
        }

        // Hozzáadás a kedvencekhez
        if ($favoriteCityModel->create($userId, $cityId)) {
            http_response_code(201);
            echo json_encode([
                'id' => $cityId,
                'cityName' => $cityCoords['name'],
                'message' => 'City added to favorites.'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add city to favorites.']);
        }
    }

    /**
     * Töröl egy várost a felhasználó kedvencei közül.
     */
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