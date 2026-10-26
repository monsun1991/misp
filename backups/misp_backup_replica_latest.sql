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
-- Dumping data for table `customer_pos`
--

LOCK TABLES `customer_pos` WRITE;
/*!40000 ALTER TABLE `customer_pos` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_pos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `finished_goods`
--

LOCK TABLES `finished_goods` WRITE;
/*!40000 ALTER TABLE `finished_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `finished_goods` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `kits`
--

LOCK TABLES `kits` WRITE;
/*!40000 ALTER TABLE `kits` DISABLE KEYS */;
INSERT INTO `kits` VALUES ('5459c635-d347-4082-8194-842ec7fc740a','2026-10-11 15:34:43.545000','2026-10-11 15:34:43.545000',NULL,NULL,1,0,'KIT-2026-1001','EFL-BLB-12W','Eiffel 12W Prime Eco LED Bulb (B22)',100,'Ravi Kumar','Suresh Patil','Station 2 - Housing Assembly & Cap Press','In Production','[{\"materialCode\":\"PCB-12W-FR4\",\"materialName\":\"12W LED Star MCPCB\",\"bomQty\":1,\"totalIssued\":100,\"consumed\":80,\"returned\":10,\"wastage\":0,\"balance\":10},{\"materialCode\":\"DRV-12W-IC\",\"materialName\":\"12W Isolated Driver\",\"bomQty\":1,\"totalIssued\":100,\"consumed\":85,\"returned\":5,\"wastage\":2,\"balance\":8},{\"materialCode\":\"HSG-12W-ALU\",\"materialName\":\"12W Aluminium Housing\",\"bomQty\":1,\"totalIssued\":100,\"consumed\":90,\"returned\":10,\"wastage\":0,\"balance\":0},{\"materialCode\":\"DIF-12W-PC\",\"materialName\":\"PC Diffuser Dome\",\"bomQty\":1,\"totalIssued\":100,\"consumed\":85,\"returned\":15,\"wastage\":0,\"balance\":0}]',NULL),('5dad6597-4b38-4c74-a057-0e990d02c0db','2026-10-11 15:34:43.562000','2026-10-11 15:34:43.562000',NULL,NULL,1,0,'KIT-2026-1002','EFL-BLB-09W','Eiffel 9W Classic LED Bulb (B22)',150,'Amit Sharma','Suresh Patil','Station 1 - Driver Potting & Wire Soldering','In Production','[{\"materialCode\":\"PCB-09W-FR4\",\"materialName\":\"9W LED Star MCPCB\",\"bomQty\":1,\"totalIssued\":150,\"consumed\":120,\"returned\":0,\"wastage\":0,\"balance\":30},{\"materialCode\":\"DRV-09W-IC\",\"materialName\":\"9W Isolated Driver\",\"bomQty\":1,\"totalIssued\":150,\"consumed\":125,\"returned\":0,\"wastage\":1,\"balance\":24}]',NULL),('c5133e30-a8b6-43ea-8a1b-49770f7c911c','2026-10-11 15:34:43.574000','2026-10-11 15:34:43.574000',NULL,NULL,1,0,'KIT-2026-0988','EFL-BLB-12W','Eiffel 12W Prime Eco LED Bulb (B22)',200,'Ravi Kumar','Suresh Patil','Final Assembly Line 1','Closed','[{\"materialCode\":\"PCB-12W-FR4\",\"materialName\":\"12W LED Star MCPCB\",\"bomQty\":1,\"totalIssued\":200,\"consumed\":198,\"returned\":2,\"wastage\":0,\"balance\":0}]','{\"reconciledAt\":\"2026-10-01 05:30 PM\",\"supervisorNotes\":\"Batch completed with 100% material accounting. 2 undamaged PCBs returned to warehouse.\"}');
/*!40000 ALTER TABLE `kits` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('0fd91ba0-ab53-4fc5-bd5d-ba8510576c58','2026-10-11 15:34:43.327000','2026-10-11 15:34:43.327000',NULL,NULL,1,0,'PCB-09W-FR4','9W LED Star MCPCB (Lumileds 2835 Chipset)','Electronics','LED Star Boards','Pcs','Lumileds India Components','Main Raw Material Store','Rack E-02 (Moisture Controlled)',4800.00,150.00,2500.00,15000.00,3500.00,1800.00,14,32.00,'Active'),('246b98ec-de49-4c02-adf4-ac885c31050b','2026-10-11 15:34:43.394000','2026-10-11 15:34:43.394000',NULL,NULL,1,0,'HSG-09W-ALU','9W Aluminium Die-Cast Housing Shell','Mechanical','Heatsinks & Enclosures','Pcs','Sunlit Precision Die-Cast','Main Raw Material Store','Bay M-04',5100.00,200.00,2500.00,12000.00,3500.00,1800.00,7,26.50,'Active'),('34ec1d89-8e9f-49cc-bb95-f09ca13d383a','2026-10-11 15:34:43.406000','2026-10-11 15:34:43.406000',NULL,NULL,1,0,'HSG-50W-FLD','50W Pressure Die-Cast IP66 Floodlight Enclosure with Fin Radiator','Mechanical','Heavy Castings','Pcs','Sunlit Precision Die-Cast','Southern Staging Store','Bay M-10',800.00,40.00,400.00,3000.00,700.00,350.00,10,195.00,'Active'),('3d0fa556-3a91-465d-9b27-cb0f57c52cf5','2026-10-11 15:34:43.423000','2026-10-11 15:34:43.423000',NULL,NULL,1,0,'WIR-PTFE-22','22AWG High-Temp PTFE Connecting Wire Harness (Pre-Stripped)','Hardware','Wiring & Cables','Sets','Apex Cables & Electrical Fasteners','Main Raw Material Store','Shelf W-02',8500.00,250.00,3000.00,20000.00,5000.00,2500.00,4,4.80,'Active'),('53641f8c-2b33-4119-b0f7-58914d323b61','2026-10-11 15:34:43.356000','2026-10-11 15:34:43.356000',NULL,NULL,1,0,'DRV-12W-IC','12W Constant Current Isolated Driver (HPF > 0.95, Surge 2.5kV)','Electronics','Power Supplies','Pcs','Delta Electronics India','Main Raw Material Store','Rack D-01',2150.00,120.00,1500.00,8000.00,2500.00,1200.00,10,58.00,'Active'),('624f5259-0be6-4cbd-a671-7d8c953e0c7a','2026-10-11 15:34:43.415000','2026-10-11 15:34:43.415000',NULL,NULL,1,0,'DIF-12W-PC','12W High Transmittance Polycarbonate Frosted Dome Diffuser','Optics','Diffusers','Pcs','Sunlit Precision Die-Cast','Main Raw Material Store','Bay O-01',7800.00,180.00,3000.00,15000.00,4500.00,2000.00,5,12.50,'Active'),('62ac8142-025a-4e8c-8608-c26f34a89f34','2026-10-11 15:34:43.442000','2026-10-11 15:34:43.442000',NULL,NULL,1,0,'BOX-12W-RET','12W Eiffel Premium Retail Printed Inner Monocarton (350 GSM)','Packaging','Retail Monocartons','Pcs','Packwell Corrugations','Finished Goods Packaging Store','Pallet P-01',9200.00,200.00,4000.00,25000.00,6000.00,3000.00,7,4.50,'Active'),('6ac9a0d0-ff74-4562-ae88-d93d4ce9aab1','2026-10-11 15:34:43.336000','2026-10-11 15:34:43.336000',NULL,NULL,1,0,'PCB-20W-BAT','20W Linear Batten LED Module (4ft Al-Substrate)','Electronics','Linear Modules','Pcs','Lumileds India Components','Main Raw Material Store','Rack E-05',1800.00,80.00,1000.00,6000.00,1500.00,800.00,14,65.00,'Active'),('a50c9c78-4447-40ee-a080-345b01572456','2026-10-11 15:34:43.365000','2026-10-11 15:34:43.365000',NULL,NULL,1,0,'DRV-09W-IC','9W Constant Current Isolated Driver (HPF > 0.92)','Electronics','Power Supplies','Pcs','Delta Electronics India','Main Raw Material Store','Rack D-02',3200.00,140.00,2000.00,10000.00,2800.00,1400.00,10,46.00,'Active'),('bf032f14-efa2-4b0f-8e63-c7679e1124d0','2026-10-11 15:34:43.432000','2026-10-11 15:34:43.432000',NULL,NULL,1,0,'SCR-M3-SS','SS M3x6 Phillips Pan Head Assembly Screws','Hardware','Fasteners','Pcs','Apex Cables & Electrical Fasteners','Main Raw Material Store','Shelf F-08',32000.00,600.00,10000.00,80000.00,20000.00,10000.00,3,0.75,'Active'),('d37763fd-24f9-45b6-ad6f-24f891623a57','2026-10-11 15:34:43.347000','2026-10-11 15:34:43.347000',NULL,NULL,1,0,'COB-50W-BRIDG','50W High-Lumen Bridgelux COB LED Array (5000K, 90 CRI)','Electronics','COB Arrays','Pcs','Bridgelux Semiconductor','Southern Staging Store','Rack E-09 (Static Protected)',950.00,40.00,500.00,3000.00,800.00,400.00,21,185.00,'Active'),('d8133159-560c-405b-909f-9b132389458d','2026-10-11 15:34:43.376000','2026-10-11 15:34:43.376000',NULL,NULL,1,0,'DRV-50W-IP67','50W IP67 Waterproof Constant Current Driver (4kV Surge)','Electronics','Outdoor Drivers','Pcs','Delta Electronics India','Heavy Luminaire Assembly Buffer','Rack D-07',620.00,30.00,400.00,2500.00,600.00,300.00,14,240.00,'Active'),('f0f3e510-a1f9-45da-b0a3-f3e8813d5b14','2026-10-11 15:34:43.307000','2026-10-11 15:34:43.307000',NULL,NULL,1,0,'PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)','Electronics','LED Star Boards','Pcs','Lumileds India Components','Main Raw Material Store','Rack E-01 (Moisture Controlled)',3450.00,180.00,2000.00,12000.00,3000.00,1500.00,14,42.50,'Active'),('f421e92c-08e6-42f4-bf95-7bf815ca98d2','2026-10-11 15:34:43.385000','2026-10-11 15:34:43.385000',NULL,NULL,1,0,'HSG-12W-ALU','12W Aluminium Die-Cast Thermally Conductive Housing','Mechanical','Heatsinks & Enclosures','Pcs','Sunlit Precision Die-Cast','Main Raw Material Store','Bay M-03',6400.00,250.00,2500.00,14000.00,4000.00,2000.00,7,34.00,'Active');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `outward_dispatches`
--

LOCK TABLES `outward_dispatches` WRITE;
/*!40000 ALTER TABLE `outward_dispatches` DISABLE KEYS */;
/*!40000 ALTER TABLE `outward_dispatches` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `production_logs`
--

LOCK TABLES `production_logs` WRITE;
/*!40000 ALTER TABLE `production_logs` DISABLE KEYS */;
INSERT INTO `production_logs` VALUES ('2cf16300-6dc0-4f1a-86d8-937b222bb0e2','2026-10-11 15:34:43.583000','2026-10-11 15:34:43.583000',NULL,NULL,1,0,'KIT-2026-1001','EFL-BLB-12W','Eiffel 12W Prime Eco LED Bulb (B22)','Final Assembly & Testing','Ravi Kumar',98,2,0,'Pass','Morning Shift A completed. Average throughput 12.25 units/hr. 2 units sent for wire resoldering.'),('a84afe13-ce15-47f8-b5fd-a911bb6d0e0e','2026-10-11 15:34:43.597000','2026-10-11 15:34:43.597000',NULL,NULL,1,0,'KIT-2026-1002','EFL-BLB-09W','Eiffel 9W Classic LED Bulb (B22)','Driver Integration & Potting','Amit Sharma',148,1,1,'Pass','Evening Shift B. Achieved 102.7% target productivity. 1 driver failed Hi-Pot surge.');
/*!40000 ALTER TABLE `production_logs` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('3d491be1-455f-4dc4-a8ee-7b6bd0e109e0','2026-10-11 15:34:43.452000','2026-10-11 15:34:43.452000',NULL,NULL,1,0,'EFL-BLB-12W','Eiffel 12W Prime Eco LED Bulb (B22)','LED Bulbs','12W','Unit',161.05,'Active','[{\"materialCode\":\"PCB-12W-FR4\",\"materialName\":\"12W LED Star MCPCB\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DRV-12W-IC\",\"materialName\":\"12W Isolated Driver\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"HSG-12W-ALU\",\"materialName\":\"12W Aluminium Housing\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DIF-12W-PC\",\"materialName\":\"12W PC Diffuser Dome\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"WIR-PTFE-22\",\"materialName\":\"22AWG Wire Harness\",\"qtyPerUnit\":1,\"uom\":\"Sets\"},{\"materialCode\":\"SCR-M3-SS\",\"materialName\":\"SS M3x6 Assembly Screws\",\"qtyPerUnit\":2,\"uom\":\"Pcs\"},{\"materialCode\":\"BOX-12W-RET\",\"materialName\":\"12W Eiffel Retail Box\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"}]'),('46a09c93-1454-47b6-8350-caa8fbfd74d1','2026-10-11 15:34:43.474000','2026-10-11 15:34:43.474000',NULL,NULL,1,0,'EFL-BAT-20W','Eiffel 20W Linear Slim Batten (4ft)','Battens','20W','Unit',285.00,'Active','[{\"materialCode\":\"PCB-20W-BAT\",\"materialName\":\"20W Linear Batten LED Module\",\"qtyPerUnit\":2,\"uom\":\"Pcs\"},{\"materialCode\":\"DRV-12W-IC\",\"materialName\":\"Batten Power Driver\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"WIR-PTFE-22\",\"materialName\":\"22AWG Wire Harness\",\"qtyPerUnit\":2,\"uom\":\"Sets\"},{\"materialCode\":\"SCR-M3-SS\",\"materialName\":\"SS M3x6 Assembly Screws\",\"qtyPerUnit\":4,\"uom\":\"Pcs\"}]'),('4dbb881c-add7-4029-bd36-a19acf469cf8','2026-10-11 15:34:43.492000','2026-10-11 15:34:43.492000',NULL,NULL,1,0,'EFL-FLD-50W','Eiffel 50W Commercial Outdoor IP66 Floodlight','Floodlights','50W','Unit',890.00,'Active','[{\"materialCode\":\"COB-50W-BRIDG\",\"materialName\":\"50W Bridgelux COB LED Array\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DRV-50W-IP67\",\"materialName\":\"50W IP67 Waterproof Driver\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"HSG-50W-FLD\",\"materialName\":\"50W Die-Cast Floodlight Housing\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"WIR-PTFE-22\",\"materialName\":\"Wire Harness\",\"qtyPerUnit\":2,\"uom\":\"Sets\"},{\"materialCode\":\"SCR-M3-SS\",\"materialName\":\"SS Fasteners\",\"qtyPerUnit\":8,\"uom\":\"Pcs\"}]'),('54c4b0f8-3a98-43e1-b4b0-27cfa9c1f0a3','2026-10-11 15:34:43.465000','2026-10-11 15:34:43.465000',NULL,NULL,1,0,'EFL-BLB-09W','Eiffel 9W Classic LED Bulb (B22)','LED Bulbs','9W','Unit',124.50,'Active','[{\"materialCode\":\"PCB-09W-FR4\",\"materialName\":\"9W LED Star MCPCB\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DRV-09W-IC\",\"materialName\":\"9W Isolated Driver\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"HSG-09W-ALU\",\"materialName\":\"9W Aluminium Housing\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DIF-12W-PC\",\"materialName\":\"PC Diffuser Dome\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"WIR-PTFE-22\",\"materialName\":\"22AWG Wire Harness\",\"qtyPerUnit\":1,\"uom\":\"Sets\"},{\"materialCode\":\"SCR-M3-SS\",\"materialName\":\"SS M3x6 Screws\",\"qtyPerUnit\":2,\"uom\":\"Pcs\"},{\"materialCode\":\"BOX-12W-RET\",\"materialName\":\"Retail Monocarton\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"}]'),('68960207-0cd6-44a3-a056-620addd5784b','2026-10-11 15:34:43.484000','2026-10-11 15:34:43.484000',NULL,NULL,1,0,'EFL-DL-15W','Eiffel 15W Architectural Recessed Downlight','Downlights','15W','Unit',340.00,'Active','[{\"materialCode\":\"PCB-12W-FR4\",\"materialName\":\"LED Engine Board\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DRV-12W-IC\",\"materialName\":\"Downlight Driver\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"HSG-12W-ALU\",\"materialName\":\"Die-Cast Downlight Trim\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"},{\"materialCode\":\"DIF-12W-PC\",\"materialName\":\"Frosted Optical Lens\",\"qtyPerUnit\":1,\"uom\":\"Pcs\"}]');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES ('32896c1a-04d7-4e75-9647-0974060e1856','2026-10-11 15:34:43.537000','2026-10-11 15:34:43.537000',NULL,NULL,1,0,'PO-2026-085','Bridgelux Semiconductor','2026-09-25','COB-50W-BRIDG','50W High-Lumen Bridgelux COB LED Array',1000.00,0.00,1000.00,185.00,'2026-10-15','In Transit','Gati KWE Express (AWB: GATI-HYD-772)','GATI-HYD-772','2026-10-02'),('34caafae-ad70-41c3-9a9a-b10763715426','2026-10-11 15:34:43.503000','2026-10-11 15:34:43.503000',NULL,NULL,1,0,'PO-2026-089','Lumileds India Components','2026-09-28','PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)',5000.00,0.00,5000.00,42.50,'2026-10-06','In Transit','V-Trans Express (AWB: VT-892110)','VT-892110','2026-10-01'),('a569560e-b596-4cad-8b7f-8e9830d86fc1','2026-10-11 15:34:43.529000','2026-10-11 15:34:43.529000',NULL,NULL,1,0,'PO-2026-091','Sunlit Precision Die-Cast','2026-10-01','HSG-12W-ALU','12W Aluminium Die-Cast Housing Shell',6000.00,0.00,6000.00,34.00,'2026-10-12','Ordered','Mahindra Logistics Direct','ML-PUN-331','2026-10-03'),('b6140d1f-ea5e-455b-8ad0-bf8801d05f7f','2026-10-11 15:34:43.520000','2026-10-11 15:34:43.520000',NULL,NULL,1,0,'PO-2026-090','Delta Electronics India','2026-09-29','DRV-12W-IC','12W Constant Current Isolated Driver (HPF)',4000.00,1000.00,3000.00,58.00,'2026-10-08','In Transit','TCI Freight Logistics (AWB: TCI-54129)','TCI-54129','2026-10-02');
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `stock_ledgers`
--

LOCK TABLES `stock_ledgers` WRITE;
/*!40000 ALTER TABLE `stock_ledgers` DISABLE KEYS */;
INSERT INTO `stock_ledgers` VALUES ('677dd3e1-c3ac-4f04-b0df-1beb1c61ab17','2026-10-11 15:34:43.637000','2026-10-11 15:34:43.637000',NULL,NULL,1,0,'PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)','PO_RECEIPT',1000.00,5700.00,'INV-2026-9812','Raw Material Stores & Logistics','Ramesh Sharma','Supplier delivery from Lumileds India (Inv: INV-2026-9812, Lot: LOT-LM-865-B4)'),('85946b13-0c8f-4021-bee3-d0cc5e97e6b6','2026-10-11 15:34:43.607000','2026-10-11 15:34:43.607000',NULL,NULL,1,0,'PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)','PO_RECEIPT',5000.00,5000.00,'SYS-INIT-PUN-01','Raw Material Stores & Logistics','Ramesh Sharma','Initial audited physical inventory balance upload (Pune Plant)'),('9dbad88b-9c0d-468a-b25c-26c401aed316','2026-10-11 15:34:43.629000','2026-10-11 15:34:43.629000',NULL,NULL,1,0,'PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)','KIT_ISSUE',-100.00,4700.00,'KIT-2026-1001','Final Assembly Line 1','Ravi Kumar','Issued to Ravi Kumar under Work Order WO-2026-091'),('a6cf9789-6cd3-4d5b-b954-cb0ac570f90d','2026-10-11 15:34:43.644000','2026-10-11 15:34:43.644000',NULL,NULL,1,0,'DRV-12W-IC','12W Constant Current Isolated Driver (HPF)','RTV_RETURN',-50.00,2150.00,'DN-2026-042','Quality Assurance & Testing','Dr. Vikram Malhotra','RTV to Delta Electronics under Debit Note DN-2026-042 (Power factor < 0.90)'),('be2a7226-6079-45d3-85ed-f0155ad0d01f','2026-10-11 15:34:43.619000','2026-10-11 15:34:43.619000',NULL,NULL,1,0,'PCB-12W-FR4','12W LED Star MCPCB (Lumileds 2835 Chipset)','KIT_ISSUE',-200.00,4800.00,'KIT-2026-0988','Final Assembly Line 1','Ravi Kumar','Issued to Line 1 for batch 200 (Ravi Kumar)');
/*!40000 ALTER TABLE `stock_ledgers` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('14d33944-11e5-46b3-8fe1-7d75a0d8c361','2026-10-11 15:34:43.298000','2026-10-12 03:46:54.000000',NULL,NULL,1,0,'EMP-3003','k.srinivas@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11012','K. Srinivas',NULL,NULL,'Floor Supervisor','Plant 2 - Hyderabad','Heavy Luminaire Assembly Buffer','Commercial Assembly Line 2','Line 2 Bravo','Floodlight Jig Line','Naveen Reddy','Active','Die-Cast Heavy Assembly, IP67 Driver Integration, Torque Calibration',NULL,NULL,NULL,'2026-10-12 09:16:55',NULL,'123456'),('2a70d06e-7cff-4f1d-b7b9-bcf9bf59cf0b','2026-10-11 15:34:43.152000','2026-10-26 04:01:31.000000',NULL,NULL,1,0,'EMP-0001','admin@gmail.com','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11001','System Super Admin',NULL,NULL,'SuperAdmin','All Plants (Global)','All Warehouses','Executive Management','Operations Leadership','HQ Office','Board of Directors','Active','ERP Governance, Plant Operations, System Security, UBAC Scoping',NULL,NULL,NULL,'2026-10-26 09:31:31',NULL,'123456'),('3ecc789d-fe7b-4e67-9e65-96d82b4fbc27','2026-10-11 15:34:43.268000','2026-10-20 15:11:12.000000',NULL,NULL,1,0,'EMP-2003','sunil.jadhav@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11009','Sunil Jadhav',NULL,NULL,'Worker','Plant 1 - Pune','Assembly Line 1 Buffer','Final Assembly Line 1','Line 1 Alpha','Station 4 - High-Voltage Ageing & Lumens Check','Suresh Patil','Active','End-of-Line Testing, Ageing Tunnel Loading, Optical Diffuser Snap-Fitting',NULL,NULL,NULL,'2026-10-20 20:41:13',NULL,'123456'),('63ca80d7-d10b-4414-a11b-7d31c3344963','2026-10-11 15:34:43.226000','2026-10-20 15:14:17.000000',NULL,NULL,1,0,'EMP-1004','sneha.kulkarni@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11005','Sneha Kulkarni',NULL,NULL,'Purchase Manager','Plant 1 - Pune','Main Raw Material Store','Procurement & Sourcing','Vendor Governance','Procurement Office','Anand Deshmukh','Active','Vendor Negotiation, 4-Month Material Run Forecasting, Import Logistics, PO Issuance',NULL,NULL,NULL,'2026-10-20 20:44:17',NULL,'123456'),('83d845f7-5a8f-4fab-9866-3a0f24c6553d','2026-10-20 20:39:57.058000','2026-10-20 20:39:57.058000',NULL,NULL,1,0,'EMP-1856','mayuri.bansal@eiffellight.com','$2b$10$blPBjODo9osgte25CmC/IuxsgICRYK5Q5kL5caJv8qWxeNV0L2Fye','+91 8527822525','Mayuri Bansal ',NULL,NULL,'Super Admin','Plant 1 - Pune Hub','Main Raw Material Store','Final Assembly Line 1','Line 1 Alpha','General Floor','Anand Deshmukh','Active','Assembly, Testing',NULL,NULL,NULL,NULL,NULL,'123456'),('89385c74-a5d8-42de-b17d-7d298ea69a40','2026-10-11 15:34:43.237000','2026-10-12 03:46:53.000000',NULL,NULL,1,0,'EMP-1005','suresh.patil@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11006','Suresh Patil',NULL,NULL,'Floor Supervisor','Plant 1 - Pune','Assembly Line 1 Buffer','Final Assembly Line 1','Line 1 Alpha','Line 1 Supervisory Station','Anand Deshmukh','Active','Kit Issuance, BOM Reconciliation, Shop Floor Shift Balancing, Worker Productivity Tracking','[\"Ravi Kumar\",\"Amit Sharma\",\"Sunil Jadhav\"]',NULL,NULL,'2026-10-12 09:16:53',NULL,'123456'),('98ea2a02-dbc0-4954-a0a6-feca4c153627','2026-10-11 15:34:43.288000','2026-10-12 03:46:54.000000',NULL,NULL,1,0,'EMP-3002','priya.nair@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11011','Priya Nair',NULL,NULL,'Store Manager','Plant 2 - Hyderabad','Southern Staging Store','Raw Material Stores & Logistics','Southern Depot Logistics','Store Desk - Hyderabad','Naveen Reddy','Active','Inter-Plant Transit GRN, High-Bay Staging, FIFO Dispatch',NULL,NULL,NULL,'2026-10-12 09:16:55',NULL,'123456'),('af1f49e6-304c-4353-8e2c-db7a9c940ca4','2026-10-11 15:34:43.247000','2026-10-12 03:46:53.000000',NULL,NULL,1,0,'EMP-2001','ravi.kumar@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11007','Ravi Kumar',NULL,NULL,'Worker','Plant 1 - Pune','Assembly Line 1 Buffer','Final Assembly Line 1','Line 1 Alpha','Station 2 - Housing Assembly & Cap Press','Suresh Patil','Active','Pneumatic Screwdriver, B22 Cap Press, Heat-Sink Paste Dispensing',NULL,NULL,NULL,'2026-10-12 09:16:54',NULL,'123456'),('cbc08b07-111c-4d10-a2e5-ec7eeef71732','2026-10-11 15:34:43.278000','2026-10-12 03:46:54.000000',NULL,NULL,1,0,'EMP-3001','naveen.reddy@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11010','Naveen Reddy',NULL,NULL,'Plant Manager','Plant 2 - Hyderabad','Southern Staging Store','Executive Management','Plant 2 Leadership','Plant Office - Cherlapally','System Super Admin','Active','Commercial Luminaire Fabrication, IP66 Gasket Sealing, Production Planning',NULL,NULL,NULL,'2026-10-12 09:16:54',NULL,'123456'),('eb7e19a6-163c-4cd4-bf5e-ae65ce785e63','2026-10-11 15:34:43.192000','2026-10-12 03:46:52.000000',NULL,NULL,1,0,'EMP-1001','anand.deshmukh@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11002','Anand Deshmukh',NULL,NULL,'Plant Manager','Plant 1 - Pune','Main Raw Material Store','Executive Management','Plant 1 Leadership','Manager Cabin - Pune','System Super Admin','Active','Lean Manufacturing, OEE Optimization, Plant Sizing, Six Sigma',NULL,NULL,NULL,'2026-10-12 09:16:52',NULL,'123456'),('f31fc5ac-b031-4ae7-84c3-c8483147afd9','2026-10-11 15:34:43.206000','2026-10-12 03:46:53.000000',NULL,NULL,1,0,'EMP-1002','vikram.malhotra@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11003','Dr. Vikram Malhotra',NULL,NULL,'Quality Inspector','Plant 1 - Pune','QA Hold & Quarantine Staging','Quality Assurance & Testing','Reliability Engineering','Photometric Darkroom & Sphere Lab','Anand Deshmukh','Active','Integrating Sphere, Spectroradiometer, Hi-Pot Surge, CCT Chromaticity Binning',NULL,NULL,NULL,'2026-10-12 09:16:54',NULL,'123456'),('f6a69450-1b34-4e70-9159-9aab19bc97bd','2026-10-11 15:34:43.259000','2026-10-11 15:34:43.259000',NULL,NULL,1,0,'EMP-2002','amit.sharma@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11008','Amit Sharma',NULL,NULL,'Worker','Plant 1 - Pune','Assembly Line 1 Buffer','Final Assembly Line 1','Line 1 Alpha','Station 1 - Driver Potting & Wire Soldering','Suresh Patil','Active','Lead-Free Soldering, Potting Gel Injection, Wire Harness Routing',NULL,NULL,NULL,NULL,NULL,'123456'),('f7ce813c-93a4-4283-8ddf-498105f85113','2026-10-11 15:34:43.216000','2026-10-21 04:45:33.000000',NULL,NULL,1,0,'EMP-1003','ramesh.sharma@eiffel.in','$2b$10$3.G7xBAGgelPPyl1IWk4cul69wZdFMz2EhPrIOPx0kPiKTaOZ6yxW','+91 98220 11004','Ramesh Sharma',NULL,NULL,'Store Manager','Plant 1 - Pune','Main Raw Material Store','Raw Material Stores & Logistics','Inbound Logistics','Inbound Dock 1 - Pune','Anand Deshmukh','Active','Stock Ledger Reconciliations, GRN Validation, FIFO Storage, Barcode Verification',NULL,NULL,NULL,'2026-10-21 10:15:33',NULL,'123456');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26 12:08:59
