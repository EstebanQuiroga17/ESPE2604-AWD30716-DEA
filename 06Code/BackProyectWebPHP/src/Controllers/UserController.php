<?php

namespace App\Controllers;

use App\Repositories\UserRepository;
use App\Core\Response;

class UserController
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        $user = $this->userRepository->findByEmail($email);

        if ($user && password_verify($password, $user->password)) {
            Response::json(true, $user, "Login successful");
        }

        Response::json(false, null, "Invalid credentials", 401);
    }

    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $ruc = $input['ruc'] ?? '';
        $firstName = $input['firstName'] ?? '';
        $lastName = $input['lastName'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (!$ruc || !$firstName || !$lastName || !$email || !$password) {
            Response::json(false, null, "All fields are required", 400);
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        $data = [
            'ruc' => $ruc,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $email,
            'password' => $hashedPassword
        ];

        try {
            $newUser = $this->userRepository->create($data);
            if ($newUser) {
                Response::json(true, $newUser, "User registered successfully", 201);
            }
        } catch (\Exception $e) {
            Response::json(false, null, "Registration failed", 500);
        }

        Response::json(false, null, "Registration failed", 500);
    }

    public function index(): void
    {
        $users = $this->userRepository->findAll();
        Response::json(true, $users);
    }

    public function resetPassword(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $newPassword = $input['newPassword'] ?? '';

        if (!$email || !$newPassword) {
            Response::json(false, null, "Todos los campos son obligatorios", 400);
        }

        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            Response::json(false, null, "No existe un usuario con ese correo", 404);
        }

        try {
            $user->password = password_hash($newPassword, PASSWORD_BCRYPT);
            $user->save();
            Response::json(true, null, "Contraseña actualizada exitosamente");
        } catch (\Exception $e) {
            Response::json(false, null, "Error al actualizar la contraseña: " . $e->getMessage(), 500);
        }
    }
}
