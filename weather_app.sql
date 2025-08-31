-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Aug 31. 11:45
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `weather_app`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `country` varchar(10) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lon` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `cities`
--

INSERT INTO `cities` (`id`, `name`, `country`, `lat`, `lon`) VALUES
(1, 'Budapest', 'HU', 47.49799370, 19.04035940),
(2, 'London', 'GB', 51.50732190, -0.12764740),
(3, 'City of Subotica', 'RS', 46.10020580, 19.66532730),
(4, 'Belgrade', 'RS', 44.81781310, 20.45689740),
(5, 'Szeged', 'HU', 46.25463120, 20.14860160);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorite_cities`
--

CREATE TABLE `favorite_cities` (
  `user_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `favorite_cities`
--

INSERT INTO `favorite_cities` (`user_id`, `city_id`) VALUES
(6, 1),
(6, 2),
(6, 3),
(6, 5),
(7, 1),
(7, 3),
(7, 4),
(9, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `expires_at`) VALUES
('admiin@admin.com', '61ffd020c61c8b16e3127000d04c1ae218188df36eaab188467c6bb4f2d9bea2', '2025-08-31 08:42:31'),
('teszt.felhasznalo@gmail.com', '8a3e5882bebf36ba7b1d5b4065edf71d2c5893e421d315444ae455051e34d10e', '2025-08-29 17:02:30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `is_active`, `created_at`) VALUES
(1, 'teszt.felhasznalo@gmail.com', '$2y$10$bZpfEWeejLBjjDxi1ltXEOXVV6LH2yZ8I8ySOEmETFfVCefat6naG', 'user', 1, '2025-08-29 14:21:53'),
(3, 'teszt.3felhasznalo@gmail.com', '$2y$10$sb.5TS0lmFRYksNNQ8/5sutcvKzce0Z62Kwl56K6cQDetrHngd8Zm', 'user', 0, '2025-08-29 15:53:06'),
(4, 'tesztiii.3felhasznalo@gmail.com', '$2y$10$Y5nDwyklFb./YQnHyLnNYuFxwFrYgv1naMT3tfkI2AyJ3jdHlXBcC', 'user', 0, '2025-08-29 15:53:34'),
(5, 'admin@weatherapp.com', '$2y$10$XbOH/EoOZDLH/ggUks9ElOPatT9sK./EGN058QjHKESA3hwXiFze6', 'admin', 0, '2025-08-29 15:56:03'),
(6, 'teszte.felhasznalo@gmail.com', '$2y$10$29ctnczMIB8KsYrSLz7j1e7Bf5MiDXafqXHzJt4Fjc6ARPLtVjRoa', 'user', 0, '2025-08-29 16:03:32'),
(7, 'admiin@admin.com', '$2y$10$FUOY8OMYChShE8u3oDxTBu2PnpSMzKLuIqgNq7kqnpgvXimGNxC8K', 'admin', 0, '2025-08-31 06:04:59'),
(8, 'postman-test@email.com', '$2y$10$uLzMe2mtxu8/f1wG7OXKtO5GiLhQO5o1pWy8R4zRgPYCRZS99oqDa', 'user', 0, '2025-08-31 09:27:49'),
(9, 'jonathanborics97@gmail.com', '$2y$10$5Zo/YoSwEcYnK4tfMZATK.TpPilV.9mFB6P3D9aKkG.cSaI91Tlp.', 'user', 0, '2025-08-31 09:35:59');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weather_archives`
--

CREATE TABLE `weather_archives` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `temperature` float NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(10) NOT NULL,
  `humidity` int(3) NOT NULL,
  `wind_speed` float NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `weather_archives`
--

INSERT INTO `weather_archives` (`id`, `city_id`, `date`, `temperature`, `description`, `icon`, `humidity`, `wind_speed`, `created_at`) VALUES
(1, 1, '2025-08-30', 20.21, 'tiszta égbolt', '01d', 84, 3.09, '2025-08-30 05:45:28'),
(2, 2, '2025-08-30', 12.6, 'kevés felhő', '02d', 91, 2.24, '2025-08-30 05:45:28'),
(3, 3, '2025-08-31', 20.35, 'borús égbolt', '04d', 79, 2.22, '2025-08-31 08:23:27'),
(4, 1, '2025-08-31', 24.48, 'erős felhőzet', '04d', 70, 2.68, '2025-08-31 09:43:03');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lat_lon` (`lat`,`lon`);

--
-- A tábla indexei `favorite_cities`
--
ALTER TABLE `favorite_cities`
  ADD PRIMARY KEY (`user_id`,`city_id`),
  ADD KEY `fk_user_id` (`user_id`),
  ADD KEY `fk_city_id` (`city_id`);

--
-- A tábla indexei `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `weather_archives`
--
ALTER TABLE `weather_archives`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `city_date_unique` (`city_id`,`date`),
  ADD KEY `fk_archive_city_id` (`city_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `weather_archives`
--
ALTER TABLE `weather_archives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `favorite_cities`
--
ALTER TABLE `favorite_cities`
  ADD CONSTRAINT `fk_city_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `weather_archives`
--
ALTER TABLE `weather_archives`
  ADD CONSTRAINT `fk_archive_city_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
