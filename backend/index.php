<?php
// Hibajelentés bekapcsolása fejlesztés alatt
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Namespace-ek importálása
use WeatherApp\Controllers\AuthController;
use WeatherApp\Controllers\CitiesController;
use WeatherApp\Controllers\GuestController;
use WeatherApp\Controllers\AdminController;
use WeatherApp\Core\Auth;
 use WeatherApp\Controllers\WeatherController;

// --- Útválasztó (Router) ---

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];
$basePath = '/Weather-App/backend'; // FONTOS: Ennek a te mappaszerkezetednek kell lennie

$route = str_replace($basePath, '', $requestUri);

// --- 1. LÉPÉS: ADMIN ÚTVONALAK KEZELÉSE ÉS VÉDELME ---

// Először megvizsgáljuk, hogy a kért útvonal admin védelmet igényel-e.
$isAdminRoute = preg_match('/^\/api\/admin\//', $route);

if ($isAdminRoute) {
    // Ha admin útvonal, akkor a jogosultság-ellenőrzés kötelező.
    $userData = Auth::getDecodedToken();

    // 1. Van érvényes token?
    if (!$userData) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Access denied. Token is missing or invalid.']);
        exit;
    }

    // 2. A felhasználó szerepköre 'admin'-e?
    if ($userData->data->role !== 'admin') {
        http_response_code(403); // Forbidden
        echo json_encode(['error' => 'Forbidden. Admin access required.']);
        exit;
    }

    // A jogosultság rendben van, jöhet a specifikus admin útvonal kezelése
    $adminController = new AdminController();

    // /api/admin/users
    if ($route === '/api/admin/users' && $requestMethod === 'GET') {
        $adminController->getUsers();
        exit;
    }

    // /api/admin/stats/popularity
    if ($route === '/api/admin/stats/popularity' && $requestMethod === 'GET') {
        $adminController->getPopularityStats();
        exit;
    }

    // /api/admin/users/{id} típusú útvonalak (PUT, DELETE)
    if (preg_match('/^\/api\/admin\/users\/(\d+)$/', $route, $matches)) {
        $userId = $matches[1];
        if ($requestMethod === 'PUT') {
            $adminController->updateUserStatus($userId);
        } elseif ($requestMethod === 'DELETE') {
            $adminController->deleteUser($userId);
        }
        exit;
    }
}


// --- 2. LÉPÉS: PUBLIKUS ÉS NORMÁL FELHASZNÁLÓI ÚTVONALAK KEZELÉSE ---

switch ($route) {
    // --- AUTH VÉGPONTOK ---
    case '/api/auth/register':
        if ($requestMethod === 'POST') (new AuthController())->register();
        break;

    case '/api/auth/login':
        if ($requestMethod === 'POST') (new AuthController())->login();
        break;

    case '/api/auth/forgot-password':
        if ($requestMethod === 'POST') (new AuthController())->forgotPassword();
        break;

    case '/api/auth/reset-password':
        if ($requestMethod === 'POST') (new AuthController())->resetPassword();
        break;
        
    // --- VÉDETT VÁROS VÉGPONTOK (NORMÁL FELHASZNÁLÓ) ---
    case '/api/cities/favorites':
        $userData = Auth::getDecodedToken();
        if (!$userData) { http_response_code(401); echo json_encode(['error' => 'Access denied.']); exit; }
        
        if ($requestMethod === 'GET') (new CitiesController())->getFavorites($userData);
        elseif ($requestMethod === 'POST') (new CitiesController())->addFavorite($userData);
        break;

    case (preg_match('/\/api\/cities\/favorites\/(\d+)/', $route, $matches) ? true : false):
        $userData = Auth::getDecodedToken();
        if (!$userData) { http_response_code(401); echo json_encode(['error' => 'Access denied.']); exit; }
        
        if ($requestMethod === 'DELETE') (new CitiesController())->deleteFavorite($userData, $matches[1]);
        break;

         case (preg_match('/\/api\/weather\/archive\/(\d+)/', $route, $matches) ? true : false):
        $userData = Auth::getDecodedToken();
        if (!$userData) { http_response_code(401); echo json_encode(['error' => 'Access denied.']); exit; }

        if ($requestMethod === 'GET') {
            $cityId = $matches[1];
            (new WeatherController())->getArchiveByCityId($userData, $cityId);
        }
        break;

    // --- GUEST VÉGPONT ---
    case '/api/guest/weather':
        if ($requestMethod === 'GET') (new GuestController())->getWeatherForGuests();
        break;

    // --- TESZT VÉGPONT ---
    case '/api/test':
        http_response_code(200);
        echo json_encode(['message' => 'API is working!']);
        break;
        
    // --- HA NINCS EGYEZŐ ÚTVONAL ---
    default:
        // Mielőtt 404-et dobnánk, ellenőrizzük, hogy nem egy admin útvonal volt-e,
        // amit fentebb nem kezeltünk le. Ez segít a hibakeresésben.
        if ($isAdminRoute) {
            http_response_code(404);
            echo json_encode(['error' => 'Admin endpoint not found or method not allowed.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found.']);
        }
        break;
}