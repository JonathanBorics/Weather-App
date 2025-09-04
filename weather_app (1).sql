-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Sze 04. 12:28
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
-- Tábla szerkezet ehhez a táblához `device_sessions`
--

CREATE TABLE `device_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `is_mobile` tinyint(1) DEFAULT 0,
  `is_tablet` tinyint(1) DEFAULT 0,
  `is_desktop` tinyint(1) DEFAULT 1,
  `device_type` varchar(50) DEFAULT NULL,
  `device_brand` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `browser_name` varchar(100) DEFAULT NULL,
  `browser_version` varchar(50) DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `isp` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `first_seen` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `session_duration` int(11) DEFAULT 0,
  `page_views` int(11) DEFAULT 1,
  `actions_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `device_sessions`
--

INSERT INTO `device_sessions` (`id`, `user_id`, `session_id`, `ip_address`, `user_agent`, `is_mobile`, `is_tablet`, `is_desktop`, `device_type`, `device_brand`, `device_model`, `browser_name`, `browser_version`, `platform`, `country`, `country_code`, `region`, `city`, `latitude`, `longitude`, `timezone`, `isp`, `organization`, `first_seen`, `last_activity`, `session_duration`, `page_views`, `actions_count`) VALUES
(1, NULL, 'mf48agxnuq69cojy1n', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 0, 0, 1, 'desktop', NULL, NULL, 'Chrome', '139.0.0.0', 'Win32', 'Serbia', 'RS', 'Belgrade', 'Belgrade', 44.80460000, 20.46370000, 'Europe/Belgrade', 'CETIN Ltd. Belgrade', 'Cetindoo APN', '2025-09-03 18:00:39', '2025-09-04 09:55:20', 57281, 16, 16),
(2, NULL, 'mf48agxnuq69cojy1n', '::1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 1, 0, 0, 'mobile', NULL, NULL, 'Chrome', '128.0.0.0', 'Linux armv81', 'Serbia', 'RS', 'Belgrade', 'Belgrade', 44.80460000, 20.46370000, 'Europe/Belgrade', 'CETIN Ltd. Belgrade', 'Cetindoo APN', '2025-09-03 18:01:43', '2025-09-03 18:01:53', 10, 4, 4),
(3, NULL, 'mf48agxnuq69cojy1n', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 EdgiOS/46.3.7 Mobile/15E148 Safari/605.1.15', 1, 0, 0, 'mobile', NULL, NULL, 'Safari', '14.0', 'iPhone', 'Serbia', 'RS', 'Belgrade', 'Belgrade', 44.80460000, 20.46370000, 'Europe/Belgrade', 'CETIN Ltd. Belgrade', 'Cetindoo APN', '2025-09-03 18:02:24', '2025-09-03 18:02:31', 7, 4, 4);

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
(7, 5),
(9, 1),
(11, 3);

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
-- Tábla szerkezet ehhez a táblához `session_actions`
--

CREATE TABLE `session_actions` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `device_session_id` int(11) NOT NULL,
  `action_type` varchar(100) NOT NULL,
  `action_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`action_details`)),
  `url` varchar(500) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `response_code` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `activation_token` varchar(255) DEFAULT NULL,
  `activation_token_created` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `is_active`, `created_at`, `activation_token`, `activation_token_created`) VALUES
(1, 'teszt.felhasznalo@gmail.com', '$2y$10$bZpfEWeejLBjjDxi1ltXEOXVV6LH2yZ8I8ySOEmETFfVCefat6naG', 'user', 1, '2025-08-29 14:21:53', NULL, NULL),
(3, 'teszt.3felhasznalo@gmail.com', '$2y$10$sb.5TS0lmFRYksNNQ8/5sutcvKzce0Z62Kwl56K6cQDetrHngd8Zm', 'user', 0, '2025-08-29 15:53:06', NULL, NULL),
(4, 'tesztiii.3felhasznalo@gmail.com', '$2y$10$Y5nDwyklFb./YQnHyLnNYuFxwFrYgv1naMT3tfkI2AyJ3jdHlXBcC', 'user', 0, '2025-08-29 15:53:34', NULL, NULL),
(5, 'admin@weatherapp.com', '$2y$10$XbOH/EoOZDLH/ggUks9ElOPatT9sK./EGN058QjHKESA3hwXiFze6', 'admin', 0, '2025-08-29 15:56:03', NULL, NULL),
(6, 'teszte.felhasznalo@gmail.com', '$2y$10$29ctnczMIB8KsYrSLz7j1e7Bf5MiDXafqXHzJt4Fjc6ARPLtVjRoa', 'user', 0, '2025-08-29 16:03:32', NULL, NULL),
(7, 'admiin@admin.com', '$2y$10$FUOY8OMYChShE8u3oDxTBu2PnpSMzKLuIqgNq7kqnpgvXimGNxC8K', 'admin', 0, '2025-08-31 06:04:59', NULL, NULL),
(8, 'postman-test@email.com', '$2y$10$uLzMe2mtxu8/f1wG7OXKtO5GiLhQO5o1pWy8R4zRgPYCRZS99oqDa', 'user', 0, '2025-08-31 09:27:49', NULL, NULL),
(9, 'jonathanborics97@gmail.com', '$2y$10$5Zo/YoSwEcYnK4tfMZATK.TpPilV.9mFB6P3D9aKkG.cSaI91Tlp.', 'user', 0, '2025-08-31 09:35:59', NULL, NULL),
(10, 'roli.konc@gmail.com', '$2y$10$aASNUy5y8YjAiuOdGEfnXuUyj.7N8w56gB4dUxPoDGdw66gt0NG.m', 'user', 0, '2025-09-02 09:48:47', NULL, NULL),
(11, 'joniboricsem32@gmail.com', '$2y$10$qjq6RLygdE4WnucSZuXQee8iZUb.q3GtLBp6ceTFrH1ZbCbkKs9t2', 'user', 0, '2025-09-03 16:34:53', NULL, NULL),
(12, 'joniboricsem@gmail.com', '$2y$10$JO84zK0jkPSSQPSDwYNMh.IAL6JMjK7TCeVOqvGkhMDGsNWfg9EFG', 'user', 0, '2025-09-03 17:15:38', '4d976817bc3d7dea79bad0478ad3b5d4dfc62bf0e3c538dadb821bc900bdc189', '2025-09-03 17:15:38'),
(13, 'vasarlo@example.com', '$2y$10$3aORgF5MYLVl3QL6mFkUa.mi1r77n6Rihq8wJqMk0w4JFT1cKFHtC', 'admin', 0, '2025-09-03 17:29:16', '04748b0b7474402a734d3e6ed2d28ea1600144b961b76242863dcccc458edbc7', '2025-09-03 17:29:16'),
(14, 'boltadmin@example.com', '$2y$10$jz9aOoQeEuEOkzwAyB4icOPM6IVljBPZlnG/ve9mlH.uE1d4Esvk.', 'user', 0, '2025-09-03 18:44:33', '1e5f247e0ccf1e60bccb948c5f198ec4cd0661e7c8c5c6ac5f662ccd35081af0', '2025-09-03 18:44:33');

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
(4, 1, '2025-08-31', 24.48, 'erős felhőzet', '04d', 70, 2.68, '2025-08-31 09:43:03'),
(5, 5, '2025-09-02', 29.38, 'szórványos felhőzet', '03d', 32, 3.12, '2025-09-02 09:40:46'),
(6, 3, '2025-09-03', 26.47, 'borús égbolt', '04d', 43, 4.52, '2025-09-03 16:47:13');

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
-- A tábla indexei `device_sessions`
--
ALTER TABLE `device_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_first_seen` (`first_seen`),
  ADD KEY `idx_device_type` (`device_type`),
  ADD KEY `idx_country_city` (`country`,`city`),
  ADD KEY `idx_is_mobile_tablet` (`is_mobile`,`is_tablet`),
  ADD KEY `idx_last_activity` (`last_activity`);

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
-- A tábla indexei `session_actions`
--
ALTER TABLE `session_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_session_id` (`device_session_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_created_at` (`created_at`);

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
-- AUTO_INCREMENT a táblához `device_sessions`
--
ALTER TABLE `device_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `session_actions`
--
ALTER TABLE `session_actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `weather_archives`
--
ALTER TABLE `weather_archives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `device_sessions`
--
ALTER TABLE `device_sessions`
  ADD CONSTRAINT `device_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `favorite_cities`
--
ALTER TABLE `favorite_cities`
  ADD CONSTRAINT `fk_city_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `session_actions`
--
ALTER TABLE `session_actions`
  ADD CONSTRAINT `session_actions_ibfk_1` FOREIGN KEY (`device_session_id`) REFERENCES `device_sessions` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `weather_archives`
--
ALTER TABLE `weather_archives`
  ADD CONSTRAINT `fk_archive_city_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
