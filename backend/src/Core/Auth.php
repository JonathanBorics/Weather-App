<?php
namespace WeatherApp\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Auth {

    public static function generateToken($userId, $email, $role) {
        // Ez a rész tökéletesen működik, nem változtatunk rajta.
        $secretKey = $_ENV['JWT_SECRET'];
        $issuer_claim = "YOUR_APP_URL"; 
        $audience_claim = "YOUR_APP_URL";
        $issuedat_claim = time();
        $notbefore_claim = $issuedat_claim;
        $expire_claim = $issuedat_claim + (60 * 60 * 24);

        $payload = [
            'iss' => $issuer_claim,
            'aud' => $audience_claim,
            'iat' => $issuedat_claim,
            'nbf' => $notbefore_claim,
            'exp' => $expire_claim,
            'data' => [
                'id' => $userId,
                'email' => $email,
                'role' => $role
            ]
        ];

        return JWT::encode($payload, $secretKey, 'HS256');
    }

    public static function getDecodedToken() {
        // --- JAVÍTÁS ITT: Használjuk a getallheaders() funkciót ---
        
        // A getallheaders() egy megbízhatóbb módja a fejlécek kiolvasásának,
        // különösen Apache szervereken, mint a $_SERVER.
        $headers = getallheaders();
        
        // A kulcs lehet 'Authorization' vagy 'authorization', ezért kisbetűssé tesszük
        // a kulcsokat, hogy biztosra menjünk.
        $headers = array_change_key_case($headers, CASE_LOWER);
        
        $authHeader = $headers['authorization'] ?? null;

        if (!$authHeader) {
            return null; // Nincs Authorization fejléc
        }

        // A preg_match-es rész változatlan, ez a 'Bearer <token>' formátumot keresi.
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null; // Hibás formátum
        }

        $jwt = $matches[1];
        if (!$jwt) {
            return null;
        }

        try {
            $secretKey = $_ENV['JWT_SECRET'];
            $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
            return $decoded;
        } catch (Exception $e) {
            // Érvénytelen vagy lejárt token
            return null;
        }
    }
}