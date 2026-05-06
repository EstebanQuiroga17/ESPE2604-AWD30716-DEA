<?php

namespace App\Core;

class Response
{
    public static function json(bool $success, mixed $data = null, string $message = "", int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        $response = [
            "success" => $success
        ];

        if ($data !== null) {
            $response["data"] = $data;
        }

        if ($message !== "") {
            $response["message"] = $message;
        }

        echo json_encode($response);
        exit();
    }
}
