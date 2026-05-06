<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    public function addRoute(string $method, string $path, callable|array $handler): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);
        $path = str_replace('/api/', '/', $path);
        
        if (strpos($path, '/api/') === 0) {
            $path = substr($path, 4);
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method) {
                $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([a-zA-Z0-9_-]+)', $route['path']);
                $pattern = "@^" . $pattern . "$@D";
                
                if (preg_match($pattern, $path, $matches)) {
                    array_shift($matches);
                    
                    if (is_array($route['handler'])) {
                        $controllerName = $route['handler'][0];
                        $action = $route['handler'][1];
                        
                        $controller = new $controllerName();
                        call_user_func_array([$controller, $action], $matches);
                    } else {
                        call_user_func_array($route['handler'], $matches);
                    }
                    return;
                }
            }
        }

        Response::json(false, null, "Route not found", 404);
    }
}
