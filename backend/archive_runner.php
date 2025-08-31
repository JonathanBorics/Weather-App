<?php
// Ez egy manuálisan futtatható szkript az adatok archiválására.

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Szükséges fájlok betöltése
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// --- JAVÍTÁS: A HIÁNYZÓ IMPORTÁLÁSOK, HOGY A PHP MEGTALÁLJA AZ OSZTÁLYOKAT ---
use WeatherApp\Core\Database;
use WeatherApp\Core\WeatherService;
use WeatherApp\Models\WeatherArchive;

echo "<h1>Időjárás Archiváló Szkript</h1>";
echo "<pre>"; // A <pre> tag segít, hogy a szöveg formázott maradjon a böngészőben

$filePath = __DIR__ . '/src/Models/WeatherArchive.php';
echo "Ellenőrzöm a fájlt a következő helyen: " . $filePath . "\n";
if (file_exists($filePath)) {
    echo ">>>> SIKER: A WeatherArchive.php fájl FIZIKAILAG LÉTEZIK.\n\n";
} else {
    echo ">>>> HIBA: A WeatherArchive.php fájl NEM LÉTEZIK a megadott útvonalon! Ellenőrizd a mappaszerkezetet és a fájlnevet!\n\n";
}

try {
    // 1. Csatlakozás az adatbázishoz
    $dbConnection = Database::getInstance()->getConnection();
    echo "Adatbázis-kapcsolat sikeres.\n";

    // 2. Az összes egyedi, kedvencként megjelölt város lekérdezése
    $query = "SELECT DISTINCT c.id, c.lat, c.lon FROM cities c JOIN favorite_cities fc ON c.id = fc.city_id";
    $stmt = $dbConnection->prepare($query);
    $stmt->execute();
    $citiesToArchive = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($citiesToArchive)) {
        echo "Nincsenek kedvencként megjelölt városok az adatbázisban. Nincs mit archiválni.\n";
        exit;
    }

    echo count($citiesToArchive) . " egyedi várost kell archiválni...\n\n";

    // 3. Végigmegyünk a városokon és elmentjük az adataikat
    $weatherService = new WeatherService();
    $archiveModel = new WeatherArchive(); // A PHP most már tudni fogja, mit jelent ez
    $successCount = 0;
    $failCount = 0;

    foreach ($citiesToArchive as $city) {
        echo "Feldolgozás: Város ID #" . $city['id'] . "\n";
        $currentWeather = $weatherService->getCurrentWeather($city['lat'], $city['lon']);

        if ($currentWeather) {
            if ($archiveModel->create($city['id'], $currentWeather)) {
                echo "  -> Sikeresen archiválva.\n";
                $successCount++;
            } else {
                echo "  -> HIBA: Nem sikerült az adatbázisba írás.\n";
                $failCount++;
            }
        } else {
            echo "  -> HIBA: Nem sikerült lekérni az időjárási adatokat az API-ról.\n";
            $failCount++;
        }
    }

    echo "\nArchiválás befejezve. Sikeres: $successCount, Hibás: $failCount\n";

} catch (Exception $e) {
    echo "Végzetes hiba történt: " . $e->getMessage();
}

echo "</pre>";