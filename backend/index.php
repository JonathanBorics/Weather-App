<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache for 1 day
}

// A böngésző "preflight" (OPTIONS) kéréseire válaszolunk és AZONNAL leállunk.
// Ez a legfontosabb rész, ami a hibát javítja.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    // A preflight kérésre egy 200 OK válasszal és üres body-val térünk vissza.
    http_response_code(200);
    exit(0);
}
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
$basePath = '/Weather-App/backend';

$route = str_replace($basePath, '', $requestUri);

// --- 1. LÉPÉS: ADMIN ÚTVONALAK KEZELÉSE ÉS VÉDELME ---

$isAdminRoute = preg_match('/^\/api\/admin\//', $route);

if ($isAdminRoute) {
    $userData = Auth::getDecodedToken();
    if (!$userData) {
        http_response_code(401);
        echo json_encode(['error' => 'Access denied. Token is missing or invalid.']);
        exit;
    }
    if ($userData->data->role !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden. Admin access required.']);
        exit;
    }

    $adminController = new AdminController();
    if ($route === '/api/admin/users' && $requestMethod === 'GET') {
        $adminController->getUsers();
        exit;
    }
    if ($route === '/api/admin/stats/popularity' && $requestMethod === 'GET') {
        $adminController->getPopularityStats();
        exit;
    }
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
    case '/api/guest/weather':
        if ($requestMethod === 'GET') (new GuestController())->getWeatherForGuests();
        break;
    case '/api/test':
        http_response_code(200);
        echo json_encode(['message' => 'API is working!']);
        break;
    default:
        if ($isAdminRoute) {
            http_response_code(404);
            echo json_encode(['error' => 'Admin endpoint not found or method not allowed.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found.']);
        }
        break;
}