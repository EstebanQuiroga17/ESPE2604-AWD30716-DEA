<?php

namespace App\Controllers;

use App\Core\Response;

class DashboardController
{
    public function getSummary(string $userId): void
    {
        $data = [
            "invoicesDownloaded" => 120,
            "invoicesDownloadedChange" => 15,
            "errorsDetected" => 3,
            "lastSync" => date('Y-m-d H:i:s'),
            "notifications" => [
                [
                    "id" => 1,
                    "type" => "warning",
                    "title" => "Notice",
                    "message" => "Review invoices with errors",
                    "timestamp" => date('Y-m-d H:i:s'),
                    "read" => false
                ]
            ]
        ];

        Response::json(true, $data);
    }
}
