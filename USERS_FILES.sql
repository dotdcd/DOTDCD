-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 08-11-2022 a las 13:38:39
-- Versión del servidor: 5.7.39-cll-lve
-- Versión de PHP: 7.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dotdcd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USERS_FILES`
--

CREATE TABLE `USERS_FILES` (
  `id` int(11) NOT NULL,
  `type` varchar(150) DEFAULT NULL,
  `file` varchar(250) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `USERS_FILES`
--

INSERT INTO `USERS_FILES` (`id`, `type`, `file`, `userId`) VALUES
(40, 'foto', '26990b54-3656-430d-a595-4921cd015683.png', 'c80b9dd4-591e-4398-8615-fcc552a03877'),
(41, 'covid', '420d67ef-ff83-464e-931d-967482cd536b.png', 'c80b9dd4-591e-4398-8615-fcc552a03877');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `USERS_FILES`
--
ALTER TABLE `USERS_FILES`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `USERS_FILES`
--
ALTER TABLE `USERS_FILES`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
