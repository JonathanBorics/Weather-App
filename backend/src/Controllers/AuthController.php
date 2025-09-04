<?php
namespace WeatherApp\Controllers;

use WeatherApp\Models\User;
use WeatherApp\Core\Auth; // Importáljuk az új Auth osztályt
use WeatherApp\Models\PasswordReset; // <-- ÚJ SOR
use WeatherApp\Core\EmailService;   // <-- ÚJ SOR

class AuthController {
    
  public function register() {
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->email) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required.']);
            return;
        }

        $userModel = new User();

        if ($userModel->findByEmail($data->email)) {
            http_response_code(409);
            echo json_encode(['error' => 'User with this email already exists.']);
            return;
        }

        $userId = $userModel->create($data->email, $data->password);

        if ($userId) {
            // Aktiválási token generálása
            $activationToken = bin2hex(random_bytes(32));
            
            // Token mentése az adatbázisba
            if ($userModel->saveActivationToken($userId, $activationToken)) {
                // Aktiválási email küldése
                $emailService = new EmailService();
                $emailService->sendActivationEmail($data->email, $activationToken);
            }
            
            http_response_code(201);
            echo json_encode([
                'message' => 'User registered successfully. Please check your email for activation link.',
                'email' => $data->email
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to register user.']);
        }
    }
    
    public function login() {
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->email) || empty($data->password)) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Email and password are required.']);
            return;
        }

        $userModel = new User();
        $user = $userModel->findByEmail($data->email);

        // 1. Létezik a felhasználó? 2. Helyes a jelszó?
        if (!$user || !password_verify($data->password, $user['password'])) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid credentials.']);
            return;
        }
        
        
//        if ($user['is_active'] != 1) {
//     http_response_code(403);
//     echo json_encode(['error' => 'Account is not activated. Please check your email for activation link.']);
//     return;
// }

        // Sikeres bejelentkezés, generálunk egy tokent
        $token = Auth::generateToken($user['id'], $user['email'], $user['role']);

        http_response_code(200);
        echo json_encode([
            'token' => $token,
            'role' => $user['role']
        ]);
    }
     public function forgotPassword() {
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email is required.']);
            return;
        }

        $userModel = new User();
        $user = $userModel->findByEmail($data->email);

        // Biztonsági okokból akkor is sikert jelzünk, ha nincs ilyen felhasználó,
        // hogy ne lehessen kitalálni, mely email címek léteznek a rendszerben.
        if ($user) {
            $passwordResetModel = new PasswordReset();
            $token = bin2hex(random_bytes(32));

            if ($passwordResetModel->create($data->email, $token)) {
                $emailService = new EmailService();
                $emailService->sendPasswordResetEmail($data->email, $token);
            }
        }

        http_response_code(200);
        echo json_encode(['message' => 'If an account with that email exists, a password reset link has been sent.']);
    }

    public function resetPassword() {
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->token) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Token and new password are required.']);
            return;
        }

        $passwordResetModel = new PasswordReset();
        $resetRequest = $passwordResetModel->findByToken($data->token);

        if (!$resetRequest) {
            http_response_code(404);
            echo json_encode(['error' => 'Invalid token.']);
            return;
        }

        // Ellenőrizzük, hogy a token nem járt-e le
        if (strtotime($resetRequest['expires_at']) < time()) {
            $passwordResetModel->deleteByEmail($resetRequest['email']);
            http_response_code(410); // Gone
            echo json_encode(['error' => 'Token has expired.']);
            return;
        }

        $userModel = new User();
        if ($userModel->updatePassword($resetRequest['email'], $data->password)) {
            // Sikeres jelszóváltoztatás után töröljük a tokent
            $passwordResetModel->deleteByEmail($resetRequest['email']);
            http_response_code(200);
            echo json_encode(['message' => 'Password has been reset successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to reset password.']);
        }
    }


public function activateAccount() {
    // GET paraméter lekérése
    $token = $_GET['token'] ?? null;
    
    if (empty($token)) {
        http_response_code(400);
        echo json_encode(['error' => 'Activation token is required.']);
        return;
    }

    $userModel = new User();
    $user = $userModel->findByActivationToken($token);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Invalid or expired activation token.']);
        return;
    }

    // Ellenőrizzük, hogy a token nem járt-e le (24 óra)
    $tokenAge = time() - strtotime($user['activation_token_created']);
    if ($tokenAge > 86400) { // 24 óra másodpercben
        http_response_code(410);
        echo json_encode(['error' => 'Activation token has expired. Please register again.']);
        return;
    }

    // Fiók aktiválása
    if ($userModel->activateUser($user['id'])) {
        http_response_code(200);
        echo json_encode([
            'message' => 'Account successfully activated. You can now log in.',
            'email' => $user['email']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to activate account.']);
    }
}

public function resendActivation() {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is required.']);
        return;
    }

    $userModel = new User();
    $user = $userModel->findByEmail($data->email);
    
    if (!$user) {
        // Biztonsági okokból ne mondjuk el, hogy nincs ilyen user
        http_response_code(200);
        echo json_encode(['message' => 'If the account exists and is not activated, a new activation email has been sent.']);
        return;
    }

    // Ha már aktív a fiók
    if ($user['is_active']) {
        http_response_code(400);
        echo json_encode(['error' => 'Account is already activated.']);
        return;
    }

    // Új aktiválási token generálása
    $activationToken = bin2hex(random_bytes(32));
    
    if ($userModel->saveActivationToken($user['id'], $activationToken)) {
        $emailService = new EmailService();
        $emailService->sendActivationEmail($data->email, $activationToken);
        
        http_response_code(200);
        echo json_encode(['message' => 'New activation email has been sent.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send activation email.']);
    }
}

public function checkActivationStatus() {
    $email = $_GET['email'] ?? null;
    
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email parameter is required.']);
        return;
    }

    $userModel = new User();
    $user = $userModel->findByEmail($email);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found.']);
        return;
    }

    http_response_code(200);
    echo json_encode([
        'email' => $user['email'],
        'is_active' => (bool)$user['is_active'],
        'needs_activation' => !$user['is_active']
    ]);
}
}