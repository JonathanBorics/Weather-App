<?php
namespace WeatherApp\Controllers;

use WeatherApp\Models\User;
use WeatherApp\Models\FavoriteCity;

class AdminController {

    /**
     * Felhasználók listázása.
     */
    public function getUsers() {
        $userModel = new User();
        $users = $userModel->findAll();
        http_response_code(200);
        echo json_encode($users);
    }

    /**
     * Felhasználó státuszának módosítása.
     */
    public function updateUserStatus($userId) {
        $data = json_decode(file_get_contents("php://input"));

        // Validáció: létezik-e az is_active kulcs és boolean-e
        if (!isset($data->is_active) || !is_bool($data->is_active)) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid "is_active" (true/false) field is required.']);
            return;
        }

        $userModel = new User();
        if ($userModel->updateStatus($userId, $data->is_active)) {
            http_response_code(200);
            echo json_encode(['message' => 'User status updated successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user status.']);
        }
    }

    /**
     * Felhasználó törlése.
     */
    public function deleteUser($userId) {
        $userModel = new User();
        if ($userModel->delete($userId)) {
            // A ON DELETE CASCADE miatt a kedvenc városai is törlődnek.
            http_response_code(200);
            echo json_encode(['message' => 'User deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete user.']);
        }
    }

    /**
     * Népszerűségi statisztika.
     */
    public function getPopularityStats() {
        $favoriteCityModel = new FavoriteCity();
        $stats = $favoriteCityModel->getPopularityStats();
        http_response_code(200);
        echo json_encode($stats);
    }
}