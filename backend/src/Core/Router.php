<?php

namespace WeatherApp\Core;

use WeatherApp\Controllers\AuthController;
use WeatherApp\Controllers\WeatherController;
use WeatherApp\Controllers\CityController;
use WeatherApp\Controllers\AdminController;

class Router
{
    private $routes = [];

    public function __construct()
    {
        $this->setupRoutes();
    }

    private function setupRoutes()
    {
        // Auth routes
        $this->routes['POST']['/api/auth/register'] = [AuthController::class, 'register'];
        $this->routes['POST']['/api/auth/login'] = [AuthController::class, 'login'];
        $this->routes['GET']['/api/auth/activate'] = [AuthController::class, 'activateAccount'];
        $this->routes['POST']['/api/auth/forgot-password'] = [AuthController::class, 'forgotPassword'];
        $this->routes['POST']['/api/auth/reset-password'] = [AuthController::class, 'resetPassword'];

        // Weather routes
        $this->routes['GET']['/api/weather/archive'] = [WeatherController::class, 'getArchive'];
        
        // City routes
        $this->routes['GET']['/api/cities/favorites'] = [CityController::class, 'getFavorites'];
        $this->routes['POST']['/api/cities/favorites'] = [CityController::class, 'addFavorite'];
        $this->routes['DELETE']['/api/cities/favorites/{id}'] = [CityController::class, 'removeFavorite'];
        
        // Guest route
        $this->routes['GET']['/api/guest/weather'] = [WeatherController::class, 'getGuestWeather'];
        
        // Admin routes
        $this->routes['GET']['/api/admin/users'] = [AdminController::class, 'getUsers'];
        $this->routes['PUT']['/api/admin/users/{id}/status'] = [AdminController::class, 'updateUserStatus'];
        $this->routes['DELETE']['/api/admin/users/{id}'] = [AdminController::class, 'deleteUser'];
        $this->routes['GET']['/api/admin/stats/popularity'] = [AdminController::class, 'getPopularityStats'];
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove trailing slash
        $path = rtrim($path, '/');
        if (empty($path)) {
            $path = '/';
        }

        // Check for exact match first
        if (isset($this->routes[$method][$path])) {
            $this->executeRoute($this->routes[$method][$path], []);
            return;
        }

        // Check for dynamic routes
        foreach ($this->routes[$method] ?? [] as $route => $handler) {
            if ($params = $this->matchRoute($route, $path)) {
                $this->executeRoute($handler, $params);
                return;
            }
        }

        // Route not found
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }

    private function matchRoute($route, $path)
    {
        $routePattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $route);
        $routePattern = '#^' . $routePattern . '$#';
        
        if (preg_match($routePattern, $path, $matches)) {
            array_shift($matches); // Remove full match
            return $matches;
        }
        
        return false;
    }

    private function executeRoute($handler, $params)
    {
        [$controllerClass, $method] = $handler;
        
        if (!class_exists($controllerClass)) {
            http_response_code(500);
            echo json_encode(['error' => 'Controller not found']);
            return;
        }

        $controller = new $controllerClass();
        
        if (!method_exists($controller, $method)) {
            http_response_code(500);
            echo json_encode(['error' => 'Method not found']);
            return;
        }

        call_user_func_array([$controller, $method], $params);
    }
}