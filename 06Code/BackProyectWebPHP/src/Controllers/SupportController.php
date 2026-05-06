<?php

namespace App\Controllers;

use App\Models\SupportTicket;
use App\Models\User;
use App\Core\Response;

class SupportController
{
    public function create(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $userId = $input['userId'] ?? null;
        $subject = $input['subject'] ?? '';
        $category = $input['category'] ?? '';
        $priority = $input['priority'] ?? 'medium';
        $message = $input['description'] ?? '';

        if (!$subject || !$category || !$message) {
            Response::json(false, null, "Todos los campos son obligatorios", 400);
        }

        $user = null;
        if ($userId) {
            $user = User::find($userId);
        }

        try {
            $id = $this->generateUuid();
            $ticketNumber = '#TKT-' . date('Y') . '-' . substr($id, 0, 4);
            
            $ticket = SupportTicket::create([
                'id' => $id,
                'userId' => $user ? $user->id : null,
                'ruc' => $user ? $user->ruc : null,
                'email' => $user ? $user->email : null,
                'category' => $category,
                'subject' => $subject,
                'message' => $message,
                'priority' => $priority,
            ]);

            Response::json(true, ['ticketNumber' => $ticketNumber], "Ticket enviado exitosamente", 201);
        } catch (\Exception $e) {
            Response::json(false, null, "Error al enviar el ticket: " . $e->getMessage(), 500);
        }
    }

    private function generateUuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
