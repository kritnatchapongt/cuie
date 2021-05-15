-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: localhost    Database: senior
-- ------------------------------------------------------
-- Server version	8.0.25
USE senior;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cookie`
--

DROP TABLE IF EXISTS `cookie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cookie` (
  `userID` varchar(15) NOT NULL,
  `cookieID` varchar(45) DEFAULT NULL,
  `socketID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cookie`
--

LOCK TABLES `cookie` WRITE;
/*!40000 ALTER TABLE `cookie` DISABLE KEYS */;
INSERT INTO `cookie` VALUES ('12345','6642637d-bdb0-4e66-aa4b-abe5086f09f7',NULL),('6030024721','3a9b49b7-939e-4967-ab5d-8be13c5b129d',NULL),('6231341521','eeedd9ec-efb7-452e-a581-fd12e930291c',NULL),('9876543','130583a7-a019-455b-bcf7-b3f6a5609777',NULL);
/*!40000 ALTER TABLE `cookie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `messageID` varchar(45) NOT NULL,
  `roomID` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `senderID` varchar(45) DEFAULT NULL,
  `message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `message_type` varchar(50) DEFAULT NULL,
  `sendtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES ('77b9de60-bf95-4a3f-96b2-374323fd3f1f','b4267180-a4b0-4556-8d29-ebeaff1c9e29','6030024721','เตรียมค่าเทอมละนะ','TEXT','2021-05-05 17:24:26'),('81e73fab-f39e-4975-bc64-ae92c944b809','736d07fa-9330-4b73-968e-fc085f79e645','9876543','กี้กี้กี้กีกี๊กีกี้','TEXT','2021-05-05 17:27:03'),('b91adc10-e292-4c82-a69f-44bc2ce7ff7a','cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','12345','ฉันจะเป็นราชาโจรสลัดให้ได้เล้ย','TEXT','2021-05-05 17:21:08'),('dc87b2ef-2c44-4a47-acf5-c50fd68d6cd8','852e5d94-7738-4bbb-9550-e719b348dd9b','6231341521','สวัสดีวันจันทร์','TEXT','2021-05-14 05:06:11'),('f17a6637-12a8-4bbe-878b-4451e527496e','cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','6231341521','wowowow','TEXT','2021-05-14 05:02:14'),('f7d79aff-ad39-4afe-a1f9-346e5df8cea8','852e5d94-7738-4bbb-9550-e719b348dd9b','6231341521','ทรมานชิบหาย','TEXT','2021-05-05 17:26:09'),('fd8804df-aba8-48c6-80a1-ea23ded546f5','cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','6030024721','ว้าวเหี้ยไรของมึง','TEXT','2021-05-14 05:07:10'),('message01','chatroom01','6231341521','ยังเลยว่ะ ส่งวันไหนวะ','TEXT','2021-05-05 08:32:48'),('message02','chatroom01','6030024721','ทำม็อคอังกฤษยังวะ','TEXT','2021-05-05 08:32:48');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `postID` varchar(45) NOT NULL,
  `head` varchar(45) DEFAULT NULL,
  `body` varchar(8000) DEFAULT NULL,
  `senderID` varchar(45) DEFAULT NULL,
  `posttime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `filepath` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`postID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES ('ab7a9d9d-b39f-4694-bc95-b16ea4b2928d','punmr','I am punmr','6030024721',NULL,'1617877188826.jpg'),('dfea7742-847e-4334-b6dc-77849b964682','นี่คือหัวข้อ','wowowowowowowowowowowo เทสภาษาไทย','6231341521','2021-05-05 07:51:37','files/16202010974166231341521.jpg');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posttarget`
--

DROP TABLE IF EXISTS `posttarget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posttarget` (
  `postID` varchar(45) NOT NULL,
  `target` varchar(45) NOT NULL,
  PRIMARY KEY (`postID`,`target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posttarget`
--

LOCK TABLES `posttarget` WRITE;
/*!40000 ALTER TABLE `posttarget` DISABLE KEYS */;
INSERT INTO `posttarget` VALUES ('25702b07-e49d-4c5d-978b-c05f3c108a18','111222333'),('25702b07-e49d-4c5d-978b-c05f3c108a18','6030024721'),('49b537dd-01cb-41d5-9b40-73d06c6fefd4','111222333'),('49b537dd-01cb-41d5-9b40-73d06c6fefd4','6030024721'),('9de56ad6-4775-4e93-ab82-0388323d0686','111222333'),('9de56ad6-4775-4e93-ab82-0388323d0686','6030024721'),('ab7a9d9d-b39f-4694-bc95-b16ea4b2928d','111222333'),('ab7a9d9d-b39f-4694-bc95-b16ea4b2928d','6030024721'),('dfea7742-847e-4334-b6dc-77849b964682','6231341521'),('f268462d-bdb5-432b-9941-084966c2d823','111222333'),('f268462d-bdb5-432b-9941-084966c2d823','6030024721');
/*!40000 ALTER TABLE `posttarget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `roomID` varchar(45) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `roomtype` varchar(20) DEFAULT NULL,
  `lastmsg` varchar(1000) DEFAULT NULL,
  `lastmsg_time` timestamp NULL DEFAULT NULL,
  `group_picpath` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `single_userID1` varchar(45) DEFAULT NULL,
  `single_userID2` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`roomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES ('736d07fa-9330-4b73-968e-fc085f79e645','รวมพลกีกี้','GROUP','81e73fab-f39e-4975-bc64-ae92c944b809','2021-05-05 17:27:03',NULL,NULL,NULL),('852e5d94-7738-4bbb-9550-e719b348dd9b',NULL,'SINGLE','dc87b2ef-2c44-4a47-acf5-c50fd68d6cd8','2021-05-14 05:06:11',NULL,'12345','6231341521'),('b4267180-a4b0-4556-8d29-ebeaff1c9e29',NULL,'SINGLE','77b9de60-bf95-4a3f-96b2-374323fd3f1f','2021-05-05 17:24:26',NULL,'6030024721','6231341521'),('c2519f55-effc-4016-a9a7-22718e172e9b',NULL,'SINGLE',NULL,NULL,NULL,'6231341521','9876543'),('cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','กลุ่มลับมหัศจรรย์','GROUP','fd8804df-aba8-48c6-80a1-ea23ded546f5','2021-05-14 05:07:10','groups/1621086784453cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47.png',NULL,NULL),('chatroom01','chatroom01','GROUP','message01','2021-05-05 08:32:48','groups/1621086861626chatroom01.png',NULL,NULL);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roomuser`
--

DROP TABLE IF EXISTS `roomuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roomuser` (
  `roomID` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userID` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`roomID`,`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roomuser`
--

LOCK TABLES `roomuser` WRITE;
/*!40000 ALTER TABLE `roomuser` DISABLE KEYS */;
INSERT INTO `roomuser` VALUES ('736d07fa-9330-4b73-968e-fc085f79e645','12345'),('736d07fa-9330-4b73-968e-fc085f79e645','6231341521'),('736d07fa-9330-4b73-968e-fc085f79e645','9876543'),('852e5d94-7738-4bbb-9550-e719b348dd9b','12345'),('852e5d94-7738-4bbb-9550-e719b348dd9b','6231341521'),('b4267180-a4b0-4556-8d29-ebeaff1c9e29','6030024721'),('b4267180-a4b0-4556-8d29-ebeaff1c9e29','6231341521'),('c2519f55-effc-4016-a9a7-22718e172e9b','6231341521'),('c2519f55-effc-4016-a9a7-22718e172e9b','9876543'),('cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','12345'),('cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','6030024721'),('cc97e4f4-12e2-4f0c-9a6d-0a0b28699b47','6231341521'),('chatroom01','6030024721'),('chatroom01','6231341521');
/*!40000 ALTER TABLE `roomuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `userID` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL,
  `bio` varchar(1000) DEFAULT NULL,
  `picpath` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Thanainun','Li','professor','12345','li','email@li.com',NULL,NULL,'profiles/162108762051912345.jpg'),('pun','mr','student4','6030024721','159951123','kritnatchapong@hotmail.com','ie','เทส','profiles/16210876631106030024721.png'),('pon-ek','tang','student3','6231341521','passwordKongPonEk','email_kong_pon-ek@example.com','com','อากาศร๊อนๆ','profiles/16209699428426231341521.png'),('กีกี้1','กี้กี้กี้กี้','staff','9876543','janitor01','hello@world.com',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'senior'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-15 21:09:02
