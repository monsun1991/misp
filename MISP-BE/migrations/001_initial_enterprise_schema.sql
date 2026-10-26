-- MySQL dump 10.13  Distrib 8.4.11, for Linux (x86_64)
--
-- Host: localhost    Database: misp
-- ------------------------------------------------------
-- Server version	8.4.11-0ubuntu0.26.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `user` varchar(150) NOT NULL,
  `action` varchar(100) NOT NULL,
  `module` varchar(100) NOT NULL,
  `details` text NOT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `timestamp` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1bb179d048bbc581caa3b01343` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_pos`
--

DROP TABLE IF EXISTS `customer_pos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_pos` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `customerPoNumber` varchar(100) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerGst` varchar(50) DEFAULT NULL,
  `billingCity` varchar(150) NOT NULL DEFAULT 'Pune',
  `poDate` date NOT NULL,
  `expectedDispatchDate` date DEFAULT NULL,
  `totalAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalOrderedQty` int NOT NULL DEFAULT '0',
  `totalDispatchedQty` int NOT NULL DEFAULT '0',
  `totalPendingQty` int NOT NULL DEFAULT '0',
  `status` varchar(50) NOT NULL DEFAULT 'New Order',
  `uploadedFileName` varchar(255) DEFAULT NULL,
  `notes` text,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  `itemsJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_affd49b7c933c7216b7fc11e74` (`id`),
  UNIQUE KEY `IDX_219f15e2de1320102656834470` (`customerPoNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `gstin` varchar(50) DEFAULT NULL,
  `city` varchar(150) NOT NULL,
  `state` varchar(150) NOT NULL,
  `contactPerson` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'B2B Brand OEM',
  `paymentTerms` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_133ec679a801fab5e070f73d3e` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `name` varchar(150) NOT NULL,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune Hub',
  `manager` varchar(150) DEFAULT NULL,
  `description` text,
  `activeTeamsJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_839517a681a86bb84cbcc6a1e9` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finished_goods`
--

DROP TABLE IF EXISTS `finished_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finished_goods` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `productCode` varchar(100) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `wattage` varchar(50) DEFAULT NULL,
  `batchLotNumber` varchar(100) NOT NULL,
  `productionDate` date NOT NULL,
  `expiryDate` date DEFAULT NULL,
  `currentStock` int NOT NULL DEFAULT '0',
  `allocatedStock` int NOT NULL DEFAULT '0',
  `availableStock` int NOT NULL DEFAULT '0',
  `qaStatus` varchar(50) NOT NULL DEFAULT 'Ready for Dispatch',
  `qaInspectedBy` varchar(100) DEFAULT NULL,
  `warehouse` varchar(150) NOT NULL DEFAULT 'Central FG Warehouse',
  `binLocation` varchar(50) NOT NULL DEFAULT 'Rack A1',
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78eaaabfb90102ed22232bf724` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finished_goods_ledger`
--

DROP TABLE IF EXISTS `finished_goods_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finished_goods_ledger` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `productId` varchar(100) NOT NULL,
  `productCode` varchar(100) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `batchLotNumber` varchar(100) DEFAULT NULL,
  `transactionType` varchar(100) NOT NULL,
  `referenceNo` varchar(100) DEFAULT NULL,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  `warehouse` varchar(100) DEFAULT NULL,
  `inQty` int NOT NULL DEFAULT '0',
  `outQty` int NOT NULL DEFAULT '0',
  `balanceQty` int NOT NULL DEFAULT '0',
  `user` varchar(150) NOT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c8a377c55181f5bd489b7155ee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grn_entries`
--

DROP TABLE IF EXISTS `grn_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grn_entries` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `grnNumber` varchar(100) NOT NULL,
  `poId` varchar(100) DEFAULT NULL,
  `poNumber` varchar(100) NOT NULL,
  `supplierName` varchar(255) NOT NULL,
  `vehicleNumber` varchar(50) DEFAULT NULL,
  `challanNumber` varchar(100) DEFAULT NULL,
  `receivedDate` date NOT NULL,
  `receivedBy` varchar(150) NOT NULL,
  `remarks` text,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  `itemsJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_2e78a6da33bbd9608a6b366759` (`id`),
  UNIQUE KEY `IDX_b4d27c0a9b41b148e100939c1d` (`grnNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kits`
--

DROP TABLE IF EXISTS `kits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kits` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `kitNumber` varchar(100) NOT NULL,
  `productCode` varchar(100) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `plannedQty` int NOT NULL,
  `workerName` varchar(150) NOT NULL,
  `supervisorName` varchar(150) DEFAULT NULL,
  `workstation` varchar(150) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Issued',
  `itemsJson` text,
  `reconciliationJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ce4a775d30ac772ed054b15537` (`id`),
  UNIQUE KEY `IDX_a0825091f2cbe823fa2eb15446` (`kitNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `subCategory` varchar(100) DEFAULT NULL,
  `uom` varchar(50) NOT NULL DEFAULT 'Pcs',
  `supplier` varchar(255) DEFAULT NULL,
  `warehouse` varchar(150) NOT NULL DEFAULT 'Main Raw Material Store',
  `location` varchar(100) DEFAULT NULL,
  `currentStock` decimal(12,2) NOT NULL DEFAULT '0.00',
  `stockWithEmployees` decimal(12,2) NOT NULL DEFAULT '0.00',
  `minStock` decimal(12,2) NOT NULL DEFAULT '0.00',
  `maxStock` decimal(12,2) NOT NULL DEFAULT '0.00',
  `reorderLevel` decimal(12,2) NOT NULL DEFAULT '0.00',
  `safetyStock` decimal(12,2) NOT NULL DEFAULT '0.00',
  `leadTimeDays` int NOT NULL DEFAULT '7',
  `standardCost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_2fd1a93ecb222a28bef28663fa` (`id`),
  UNIQUE KEY `IDX_5f59d61b51ffcb1db994286221` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outward_dispatches`
--

DROP TABLE IF EXISTS `outward_dispatches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outward_dispatches` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `dispatchNo` varchar(100) NOT NULL,
  `customerPoId` varchar(100) DEFAULT NULL,
  `customerPoNumber` varchar(100) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `dispatchDate` date NOT NULL,
  `transporter` varchar(150) DEFAULT NULL,
  `vehicleNumber` varchar(50) DEFAULT NULL,
  `driverName` varchar(150) DEFAULT NULL,
  `driverPhone` varchar(50) DEFAULT NULL,
  `ewayBillNumber` varchar(100) DEFAULT NULL,
  `docketNumber` varchar(100) DEFAULT NULL,
  `invoiceNumber` varchar(100) DEFAULT NULL,
  `totalDispatchedUnits` int NOT NULL DEFAULT '0',
  `notes` text,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  `itemsJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_204915c3623aa95dd46d1595fa` (`id`),
  UNIQUE KEY `IDX_b38b6f6c9baa5c56c008e456b3` (`dispatchNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants`
--

DROP TABLE IF EXISTS `plants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plants` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `city` varchar(150) NOT NULL,
  `type` varchar(100) NOT NULL,
  `manager` varchar(150) DEFAULT NULL,
  `warehousesCount` int NOT NULL DEFAULT '0',
  `departmentsCount` int NOT NULL DEFAULT '0',
  `description` text,
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7056d6b283b48ee2bb0e53bee6` (`id`),
  UNIQUE KEY `IDX_01730098ec1effab1a37d1b450` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `production_logs`
--

DROP TABLE IF EXISTS `production_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_logs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `kitNumber` varchar(100) NOT NULL,
  `productCode` varchar(100) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `stage` varchar(100) NOT NULL,
  `operatorName` varchar(150) NOT NULL,
  `goodQty` int NOT NULL,
  `reworkQty` int NOT NULL DEFAULT '0',
  `scrapQty` int NOT NULL DEFAULT '0',
  `qaStatus` varchar(50) NOT NULL DEFAULT 'Pass',
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_044919928a4713ecb09f7e8de5` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `wattage` varchar(50) DEFAULT NULL,
  `unit` varchar(50) NOT NULL DEFAULT 'Unit',
  `standardCost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `bomJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0806c755e0aca124e67c0cf6d7` (`id`),
  UNIQUE KEY `IDX_7cfc24d6c24f0ec91294003d6b` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `poNumber` varchar(100) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `poDate` date NOT NULL,
  `materialCode` varchar(100) NOT NULL,
  `materialName` varchar(255) NOT NULL,
  `orderedQty` decimal(12,2) NOT NULL,
  `receivedQty` decimal(12,2) NOT NULL DEFAULT '0.00',
  `pendingQty` decimal(12,2) NOT NULL DEFAULT '0.00',
  `unitRate` decimal(12,2) NOT NULL,
  `expectedDeliveryDate` date DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `transporter` varchar(255) DEFAULT NULL,
  `trackingNo` varchar(100) DEFAULT NULL,
  `dispatchDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_05148947415204a897e8beb255` (`id`),
  UNIQUE KEY `IDX_2e0fc7a6605393a9bd691cdceb` (`poNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `name` varchar(100) NOT NULL,
  `description` text,
  `isSystem` tinyint NOT NULL DEFAULT '0',
  `permissionsJson` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c1433d71a4838793a49dcad46a` (`id`),
  UNIQUE KEY `IDX_648e3f5447f725579d7d4ffdfb` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_ledgers`
--

DROP TABLE IF EXISTS `stock_ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_ledgers` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `materialCode` varchar(100) NOT NULL,
  `materialName` varchar(255) NOT NULL,
  `transactionType` varchar(50) NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `balanceAfter` decimal(12,2) NOT NULL,
  `referenceNumber` varchar(100) DEFAULT NULL,
  `department` varchar(150) DEFAULT NULL,
  `employeeName` varchar(150) DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c271e4ede988c163da47b9224f` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `category` varchar(150) NOT NULL,
  `contactPerson` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `leadTimeAvg` int NOT NULL DEFAULT '7',
  `gstNumber` varchar(50) DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b70ac51766a9e3144f778cfe81` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `empCode` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Super Admin',
  `plant` varchar(100) DEFAULT 'Plant 1 - Pune',
  `warehouse` varchar(100) DEFAULT 'Main Raw Material Store',
  `department` varchar(100) DEFAULT 'Assembly Line 1',
  `team` varchar(100) DEFAULT 'Team Alpha',
  `workstation` varchar(100) DEFAULT NULL,
  `supervisor` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `skills` varchar(255) DEFAULT NULL,
  `assignedWorkersJson` text,
  `customPermissionsJson` text,
  `revokedPermissionsJson` text,
  `lastLoginAt` datetime DEFAULT NULL,
  `lastLogoutAt` datetime DEFAULT NULL,
  `pin` varchar(10) DEFAULT '123456',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a3ffb1c0c8416b9fc6f907b743` (`id`),
  UNIQUE KEY `idx_user_email` (`email`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  KEY `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `name` varchar(150) NOT NULL,
  `plant` varchar(100) NOT NULL DEFAULT 'Plant 1 - Pune',
  `type` varchar(100) NOT NULL DEFAULT 'Raw Materials & Parts',
  `capacityUnits` int NOT NULL DEFAULT '0',
  `manager` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_56ae21ee2432b2270b48867e4b` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26 14:56:28
