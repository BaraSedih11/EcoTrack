-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: echotrack
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Password` varchar(255) NOT NULL,
  `ProfilePicture` varchar(255) DEFAULT NULL,
  `Location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Interests` json DEFAULT NULL,
  `SustainabilityScore` decimal(10,2) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT NULL,
  `LastLoginDate` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumpaing data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'newuser','newuser@example.com','$2b$10$2CiVNYFhRjhvcrQfxWB30Og91NFI0qp0zqIEP.3K1CtiHWVtjOzIe','temp2','Nablus','{\"key\": null, \"term\": \"climate change\"}',NULL,NULL,'2023-10-24 19:53:09',1),(2,'newuser1','newuser1@example.com','$2b$10$/6R8V6OLHUUJ7zZQ3CbKZewbqrHg07dQHYPM89eZQD.1Fu3aIP3Vi',NULL,NULL,NULL,NULL,NULL,NULL,0),(6,'newuser2','newuser2@example.com','$2b$10$ZHzTFQVxcw7/3D/j9nd6P.3QXqMfm/qsoDgbqK6A4vTtmYQcRxuCy',NULL,NULL,NULL,NULL,'2023-10-24 15:30:23','2023-10-24 17:10:26',0),(7,'newuser3','newuser3@example.com','$2b$10$yOY05swGbu1i/yE.dSGmfu25eFMP9fCeUe9f5e/xcwhkhEiNofYPW',NULL,NULL,NULL,NULL,'2023-10-24 17:50:38','2023-10-24 17:58:52',1),(8,'newuser8','newuser8@example.com','$2b$10$evQv9IroREZt2jyc9LhYnOiCdJNBYpkoyk5KB64RnrRJlsha3mQ/i',NULL,NULL,NULL,NULL,'2023-10-24 18:26:16',NULL,1),(9,'bara','bara@example.com','$2b$10$J094k2iy9wVXWa54uE4gP.7B8APIOcc5gnZP34WFavaoVaW24oePu',NULL,NULL,NULL,NULL,'2023-10-27 19:29:49',NULL,1),(18,'bbrara','baraa@example.com','$2b$10$it5R8wBSJ/Ta2qAWqDWjxOp6fazdG4Y3GvhYCn.NfPPKuMFMtqwgW',NULL,NULL,NULL,NULL,'2023-10-27 20:08:40',NULL,1),(24,'bbraraa','baraaa@example.com','$2b$10$NglIEcLtg4W1h2diqXZ.Z.f484hgWY0nJykyAlfBSuUXrTJ5k/dCS',NULL,NULL,NULL,NULL,'2023-10-27 20:25:33',NULL,1),(27,'bbraraa1','baraaa1@example.com','$2b$10$SYMGYF.fGCinUMmWxk5SDukFasSRKODJNazlVHS6MTUNMGXfWiqtK',NULL,NULL,NULL,NULL,'2023-10-27 20:28:17',NULL,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-24 19:13:07
