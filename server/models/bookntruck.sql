CREATE DATABASE bookntruck;
USE bookntruck;

CREATE TABLE `user` (
    `user_id` INT PRIMARY KEY AUTO_INCREMENT,
    `email_address` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `user_type` ENUM('client', 'trucker', 'admin') NOT NULL,
    `status` ENUM('active', 'deactivated', 'deleted') NOT NULL,
    `date_registered` datetime DEFAULT curdate(),
    `last_login` DATETIME DEFAULT NULL
);

CREATE TABLE `client`(
    `client_id` INT PRIMARY KEY AUTO_INCREMENT,
    `client_name` VARCHAR(60) NOT NULL,
    `contact_number` CHAR(11) NOT NULL,
    `date_updated` DATETIME DEFAULT NULL,
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_client_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `trucker`(
    `trucker_id` INT PRIMARY KEY AUTO_INCREMENT,
    `business_name` VARCHAR(50) NOT NULL,
    `trucker_name` VARCHAR(255) NOT NULL,
    `contact_number` CHAR(11) NOT NULL,
    `position` VARCHAR(60) NOT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `logo` VARCHAR(255) DEFAULT NULL,
    `emp_proof` VARCHAR(255) DEFAULT NULL,
    `servCharge` DECIMAL(10,2) DEFAULT NULL,
    `distCharge` DECIMAL(10,2) DEFAULT NULL,
    `contrCharge` DECIMAL(10,2) DEFAULT NULL,
    `date_updated` DATETIME DEFAULT NULL,
    `trucker_status` ENUM('Pending', 'Approved', 'Declined', 'Unavailable') NOT NULL DEFAULT 'Pending',
    `is_viewable` tinyint(1) NOT NULL DEFAULT 0,
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_trucker_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `admin`(
    `admin_id` INT PRIMARY KEY AUTO_INCREMENT,
    `admin_name` VARCHAR(60) NOT NULL,
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `review`(
    `review_id` INT PRIMARY KEY AUTO_INCREMENT,
    `rating` INT(11) NOT NULL,
    `comment` LONGTEXT DEFAULT NULL,
    `date_submitted` datetime DEFAULT curdate(),
    `client_id` INT NOT NULL,
    `trucker_id` INT NOT NULL,
    CONSTRAINT `fk_review_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`),
    CONSTRAINT `fk_review_trucker` FOREIGN KEY (`trucker_id`) REFERENCES `trucker` (`trucker_id`)
);

CREATE TABLE `payment`(
    `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
    `service_charge` DECIMAL(10,2) NOT NULL,
    `distance_charge` DECIMAL(10,2) NOT NULL,
    `container_charge` DECIMAL(10,2) NOT NULL,
    `total_balance` DECIMAL(10,2) NOT NULL,
    `rem_balance` DECIMAL(10,2) NULL,
    `paid_amount` DECIMAL(10,2) NULL,
    `payment_status` enum('Pending', 'Paid', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `due_date` DATE DEFAULT NULL,
    `payment_date` DATETIME DEFAULT NULL,
    `invoice_date` DATETIME DEFAULT NULL,
    `date_added` DATETIME DEFAULT curdate(),
    `date_updated` DATETIME DEFAULT NULL,
    `is_visible` tinyint(1) NOT NULL DEFAULT 1
);


CREATE TABLE `container`(
    `container_id` INT PRIMARY KEY AUTO_INCREMENT,
    `container_type` VARCHAR(255) NOT NULL,
    `weight` VARCHAR(50) NOT NULL,
    `quantity` INT(20) NOT NULL,
    `pickup_location` VARCHAR(255) NOT NULL,
    `item_name` VARCHAR(50) NOT NULL,
    `item_type` VARCHAR(255) NOT NULL,
    `item_weight` VARCHAR(50) NOT NULL,
    `item_quantity` INT(20) NOT NULL,
    `date_added` datetime DEFAULT curdate()
);

CREATE TABLE `booking`(
    `booking_id` INT PRIMARY KEY AUTO_INCREMENT,
    `booking_date` DATETIME DEFAULT curdate(),
    `finish_date` DATE NOT NULL,
    `est_finish_date` DATE NOT NULL,
    `delivery_address` VARCHAR(255) NOT NULL,
    `status` enum('Pending','Pullout Docs Required','Ongoing','Completed','Reserved','Cancelled') NOT NULL DEFAULT 'Pending',
    `book_price` DECIMAL(10,2) NOT NULL,
    `pullout_doc` VARCHAR(255) DEFAULT NULL,
    `eir_doc` VARCHAR(255) DEFAULT NULL,
    `date_updated` DATETIME DEFAULT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT 1, 
    `trucker_id` INT NOT NULL,
    `client_id` INT NOT NULL,
    `container_id` INT NOT NULL,
    `payment_id` INT NOT NULL,
    CONSTRAINT `fk_book_trucker` FOREIGN KEY (`trucker_id`) REFERENCES `trucker`(`trucker_id`),
    CONSTRAINT `fk_book_client` FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`),
    CONSTRAINT `fk_book_cont` FOREIGN KEY (`container_id`) REFERENCES `container`(`container_id`),
    CONSTRAINT `fk_book_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`payment_id`)
);

CREATE TABLE `asset`(
    `asset_id` INT PRIMARY KEY AUTO_INCREMENT,
    `asset_category` enum('Truck', 'Trailer') NOT NULL,
    `asset_name` VARCHAR(50) DEFAULT NULL,
    `brand` VARCHAR(50) DEFAULT NULL,
    `type` VARCHAR(50) DEFAULT NULL,
    `measurements` VARCHAR(128) DEFAULT NULL,
    `weight` VARCHAR(128) DEFAULT NULL,
    `plate_number` VARCHAR(255) DEFAULT NULL,
    `status` enum('Idle', 'In-Use') NOT NULL DEFAULT 'Idle',
    `date_added` datetime DEFAULT curdate(),
    `date_updated` DATETIME DEFAULT NULL,
    `is_visible` tinyint(4) NOT NULL DEFAULT 1, 
    `trucker_id` INT NOT NULL,
    `booking_id` INT DEFAULT NULL,
    CONSTRAINT `fk_asset_busi` FOREIGN KEY(`trucker_id`) REFERENCES `trucker`(`trucker_id`),
    CONSTRAINT `fk_asset_book` FOREIGN KEY(`booking_id`) REFERENCES `booking`(`booking_id`)
);

-- ALTERING TABLES

ALTER TABLE `user`
    ADD UNIQUE KEY `email_address`(`email_address`);


-- INSERTING VALUES

INSERT INTO `user` (`user_id`, `email_address`, `password`, `user_type`, `status`, `date_registered`, `last_login`) VALUES
(1, 'bnkad1@gmail.com', '$2b$10$RdZtJQUImJ1H6DjW6Fqn4OmW73J1g01YK.xEobNceUCN34ArzBjzy', 'admin', 'active', '2023-12-01 00:00:00', '2023-12-07 21:07:51'),
(2, 'jbtruck@gmail.com', '$2b$10$wf3EmQ3r2mBOpOdZA0ZGIuG4V9qUYgcPaMEokXO4slEZbLQFoA3ra', 'trucker', 'active', '2023-12-02 00:00:00', '2023-12-07 10:59:27'),
(3, 'louis123@gmail.com', '$2b$10$aEt8QHTMFUTn07Ak/Mgjg.k64LYNTNadAYr30ADo9aU44S0vY0Lqi', 'client', 'active', '2023-12-02 00:00:00', '2023-12-07 11:23:47'),
(4, 'miguel456@gmail.com', '$2b$10$ApBekBVGPRwkeE.phbdETuGsnANcLYWLYLITQ8sQVnniNORJKi0LG', 'client', 'active', '2023-12-02 00:00:00', '2023-12-05 23:58:55'),
(5, 'tbtrkr@gmail.com', '$2b$10$E6Y9mRE2HMEJUOAOVq731usscpKuQDIGMboWAANO5Iy1n1PikRqXW', 'trucker', 'active', '2023-12-02 00:00:00', '2023-12-05 23:22:11'),
(6, 'zach@gmail.com', '$2b$10$4Q21Zqtb/LYSOpga9BbcOOl1TX6cVzf3eu7LGx13VKfBeWrkRFZVW', 'client', 'active', '2023-12-02 00:00:00', '2023-12-06 00:01:37'),
(7, 'joss@gmail.com', '$2b$10$CVX5v4H.QxEvw1Rl.B/dBun.jdRBFAWtFUyuoHcQYRrHjVHzCWO8y', 'client', 'active', '2023-12-03 00:00:00', '2023-12-06 00:08:42'),
(8, 'jason@gmail.com', '$2b$10$yFj1O5oJKQ2v0dZD7zIZt.pnJku87XgUO5riGo8VvOf2KSzDvto4e', 'client', 'active', '2023-12-03 00:00:00', '2023-12-06 00:12:24'),
(9, 'hgtrkco@gmail.com', '$2b$10$KN7HFyroCaiqYlsHrvV0Ce/4Gdk9G3HiUkQ545TXNJ2gpwB2o61hm', 'trucker', 'active', '2023-12-04 00:00:00', '2023-12-05 23:24:10'),
(10, 'angelo@gmail.com', '$2b$10$ncen0PELErYm6bR3eRa7V.kumreKIttLQQAVD46MmTVWWGwcIV0iS', 'client', 'active', '2023-12-04 00:00:00', '2023-12-06 00:12:24'),
(11, 'nicole@gmail.com', '$2b$10$qQAoVXZNGzTCQHhgL3293O1LUlv3Co82B7DePQJymuhO64gcsa/9O', 'client', 'active', '2023-12-04 00:00:00', '2023-12-06 07:56:04'),
(12, 'angelica@gmail.com', '$2b$10$aGfuMV2dbkQRmj.ZB3K0j.hBDZoTohi7bYol3JByOhtRTRGsABdgW', 'client', 'active', '2023-12-05 00:00:00', '2023-12-06 07:52:49'),
(13, 'ben32@gmail.com', '$2b$10$BC7.7gms0NpTdQucUGSV..DzvGsBoFvjxdrbTdBsdz5wJxMNo0inW', 'client', 'deactivated', '2023-12-07 00:00:00', '2023-12-06 07:51:27');

INSERT INTO `client` (`client_id`, `client_name`, `contact_number`, `date_updated`, `user_id`) VALUES
(1, 'Louis Andre', '09324578912', NULL, 3),
(2, 'Miguel Tamarra', '09564738912', NULL, 4),
(3, 'Zach Ryan', '09438764952', NULL, 6),
(4, 'Joss Gabrielle', '09436745321', NULL, 7),
(5, 'John Jason', '09513456721', NULL, 8),
(6, 'Angelo Brian', '09085826782', NULL, 10),
(7, 'Nicole Sam', '09436745321', NULL, 11),
(8, 'Angelica Claire', '09454122485', NULL, 12),
(9, 'Ben Riley', '09322047404', '2023-12-06 07:51:34', 13);

INSERT INTO `trucker` (`trucker_id`, `business_name`, `trucker_name`, `contact_number`, `position`, `address`, `description`, `logo`, `emp_proof`, `servCharge`, `distCharge`, `contrCharge`, `date_updated`, `trucker_status`, `is_viewable`, `user_id`) VALUES
(1, 'JAB Trucking', 'Joseph Barita', '09134538791', 'Operations Manager', 'Osmena Boulevard, Cebu City', 'JAB Trucking is a Cebu Based trucking company committed to delivering reliable and efficient transportation solutions. With a dedication to excellence, we specialize in the seamless movement of goods, providing a comprehensive range of trucking services tailored to meet the diverse needs of our clients.', 'https://i.imgur.com/ZjYCHJp.png', 'uploads\\emp_proof-1701771470967-513753306.png', 1793.00, 500.00, 500.00, '2023-12-05 20:25:58', 'Approved', 1, 2),
(2, 'Tubarao Trucking', 'Isaac Nunes', '09789125637', 'Transportation Manager', 'Talisay City, Cebu, Philippines', 'Tubarao Trucking is a leading trucking company committed to delivering reliable and efficient transportation services across the Philippines. With a focus on customer satisfaction, safety, and innovation, we have positioned ourselves as a trusted partner for businesses seeking seamless logistics solutions.', 'https://i.imgur.com/0JxX68D.jpg', 'uploads\\emp_proof-1701772760409-965405485.png', 2303.00, 500.00, 800.00, '2023-12-05 20:27:10', 'Approved', 1, 5),
(3, 'High Grade Trucking Co', 'Harry Bradford', '09120975302', 'Logistics Manager', 'Mandaue City, Cebu, Philippines', 'High Grade Trucking Co.  is a leading trucking company committed to providing reliable, efficient, and innovative transportation solutions. With a steadfast dedication to excellence, we have emerged as a trailblazer in the logistics industry, connecting businesses and ensuring seamless cargo movement across the Philippines.', 'https://i.imgur.com/xghIj3y.png', 'uploads\\emp_proof-1701774049307-26690536.png', 1820.00, 500.00, 700.00, '2023-12-05 20:34:37', 'Approved', 1, 9);

INSERT INTO `admin` (`admin_id`, `admin_name`, `user_id`) VALUES
(1, 'Shane', 1);

INSERT INTO `review` (`review_id`, `rating`, `comment`, `date_submitted`, `client_id`, `trucker_id`) VALUES
(1, 5, 'Very reliable service!', '2023-12-05 23:09:07', 1, 1),
(2, 5, 'Very high quality service provided...', '2023-12-05 23:23:41', 1, 2),
(3, 4, 'Good service, but with some hiccups here and there.', '2023-12-05 23:25:57', 1, 3),
(4, 4, 'Pretty good service', '2023-12-05 23:59:13', 2, 2),
(5, 5, 'Very good service, friendly manager', '2023-12-05 23:59:59', 2, 1),
(6, 3, 'Debatable service but over all alright', '2023-12-06 00:00:44', 2, 3);

INSERT INTO `payment` (`payment_id`, `service_charge`, `distance_charge`, `container_charge`, `total_balance`, `rem_balance`, `paid_amount`, `payment_status`, `due_date`, `payment_date`, `invoice_date`, `date_added`, `date_updated`, `is_visible`) VALUES
(1, 1793.00, 500.00, 10000.00, 12293.00, 0.00, 12293.00, 'Paid', '2023-12-15', '2023-12-14 00:00:00', '2023-12-14 00:00:00', '2023-12-05 00:00:00', '2023-12-05 23:40:12', 1),
(2, 2303.00, 500.00, 8000.00, 10803.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-05 00:00:00', NULL, 1),
(3, 1820.00, 500.00, 10500.00, 12820.00, 0.00, 12820.00, 'Paid', '2023-12-15', '2023-12-13 00:00:00', '2023-12-05 00:00:00', '2023-12-05 00:00:00', '2023-12-05 23:27:38', 1),
(4, 1793.00, 500.00, 5000.00, 7293.00, 7000.00, 293.00, 'Pending', '2023-12-09', NULL, '2023-12-07 00:00:00', '2023-12-05 00:00:00', '2023-12-05 23:56:45', 1),
(5, 2303.00, 500.00, 4000.00, 6803.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-05 00:00:00', NULL, 1),
(6, 1820.00, 500.00, 7000.00, 9320.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-05 00:00:00', NULL, 1),
(7, 1793.00, 500.00, 10000.00, 12293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(8, 1793.00, 500.00, 10000.00, 12293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(9, 2303.00, 500.00, 10400.00, 13203.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(10, 1793.00, 500.00, 5000.00, 7293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(11, 2303.00, 500.00, 9600.00, 12403.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(12, 1793.00, 500.00, 5000.00, 7293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(13, 1793.00, 500.00, 10000.00, 12293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(14, 1793.00, 500.00, 4000.00, 6293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-06 00:00:00', NULL, 1),
(15, 1793.00, 500.00, 10000.00, 12293.00, NULL, NULL, 'Pending', NULL, NULL, NULL, '2023-12-07 00:00:00', NULL, 1);

INSERT INTO `container` (`container_id`, `container_type`, `weight`, `quantity`, `pickup_location`, `item_name`, `item_type`, `item_weight`, `item_quantity`, `date_added`) VALUES
(1, '1x20', '2050 kg', 20, 'Port of Cebu, Cebu City', 'Ceramic Tiles', 'Building Materials', '30.0 lbs.', 40, '2023-12-05 00:00:00'),
(2, '1x45', '4800 kg', 10, 'Cebu Port, Cebu City', 'Treadmill', 'Consumer Goods and Retail Products', '50.0 lbs.', 10, '2023-12-05 00:00:00'),
(3, '1x40', '3750 kg', 15, 'Cebu Port, Cebu City, Philippines', 'Office Chairs', 'Furniture and Home Decor', '10.0 lbs', 20, '2023-12-05 00:00:00'),
(4, '1x45', '4800 kg', 10, 'Cebu Port, Cebu City', 'Bags of potatoes', 'Food and Beverages', '50.0 lbs', 40, '2023-12-05 00:00:00'),
(5, '1x40', '3750 kg', 5, 'Port of Cebu, Cebu City', 'Metallic Pipes', 'Building Materials', '40 lbs.', 50, '2023-12-05 00:00:00'),
(6, '1x20', '2050 kg', 10, 'Port of Cebu, Cebu City', 'Tables', 'Furniture and Home Decor', '10.0 lbs', 29, '2023-12-05 00:00:00'),
(7, '1x20', '2050 kg', 20, 'Cebu Port, Cebu City', 'Wood', 'Building Materials', '50.0 lbs', 50, '2023-12-06 00:00:00'),
(8, '1x45', '4800 kg', 20, 'Port of Cebu, Cebu City', 'Cement', 'Building Materials', '50.0 lbs', 40, '2023-12-06 00:00:00'),
(9, '1x40', '3750 kg', 13, 'Cebu Port, Cebu City', 'Bags of Chicken', 'Food and Beverages', '10.0 lbs', 30, '2023-12-06 00:00:00'),
(10, '1x20', '2050 kg', 10, 'Port of Cebu, Cebu City', 'Bags of Rice', 'Food and Beverages', '30.0 lbs.', 40, '2023-12-06 00:00:00'),
(11, '1x20', '2050 kg', 12, 'Port of Cebu, Cebu City', 'Bags of Fish', 'Food and Beverages', '30.0 lbs.', 20, '2023-12-06 00:00:00'),
(12, '1x40', '3750 kg', 10, 'Port of Cebu, Cebu City', 'Bags of Rice', 'Food and Beverages', '50.0 lbs', 20, '2023-12-06 00:00:00'),
(13, '1x20', '2050 kg', 20, 'Port of Cebu, Cebu City', 'Steel cabinets', 'Furniture and Home Decor', '50.0 lbs', 30, '2023-12-06 00:00:00'),
(14, '1x20', '2050 kg', 8, 'Port of Cebu, Cebu City', 'Cement', 'Building Materials', '50.0 lbs', 25, '2023-12-06 00:00:00'),
(15, '1x20', '2050 kg', 20, 'Cebu Port, Cebu City', 'Chicken', 'Food and Beverages', '10.0 lbs', 30, '2023-12-07 00:00:00');

INSERT INTO `booking` (`booking_id`, `booking_date`, `finish_date`, `est_finish_date`, `delivery_address`, `status`, `book_price`, `pullout_doc`, `eir_doc`, `date_updated`, `is_visible`, `trucker_id`, `client_id`, `container_id`, `payment_id`) VALUES
(1, '2023-12-05 00:00:00', '2023-12-08', '2023-12-09', 'Mandaue City, Cebu', 'Completed', 12293.00, 'uploads\\1701788849809.png', 'uploads\\1701788907695.png', '2023-12-08 23:08:27', 1, 1, 1, 1, 1),
(2, '2023-12-04 00:00:00', '2023-12-06', '2023-12-07', 'SM Seaside, Cebu', 'Completed', 10803.00, 'uploads\\1701789758656.png', 'uploads\\1701789786798.png', '2023-12-06 23:23:06', 1, 2, 1, 2, 2),
(3, '2023-12-05 00:00:00', '2023-12-07', '2023-12-08', 'Mactan-Cebu International Airport', 'Completed', 12820.00, 'uploads\\1701789900565.png', 'uploads\\1701789919206.png', '2023-12-07 23:25:19', 1, 3, 1, 3, 3),
(4, '2023-12-06 00:00:00', '2023-12-09', '2023-12-09', 'SM City, Cebu', 'Completed', 7293.00, 'uploads\\1701789900565.png', 'uploads\\1701789900565.png', '2023-12-19 23:39:34', 1, 1, 2, 4, 4),
(5, '2023-12-08 00:00:00', '2023-12-18', '2023-12-18', 'Argao, Cebu, Philippines', 'Completed', 6803.00, 'uploads\\1701788907695.png', 'uploads\\1701788907695.png', '2023-12-18 23:44:32', 1, 2, 2, 5, 5),
(6, '2023-12-06 00:00:00', '2023-12-20', '2023-12-21', 'SM Seaside, Cebu', 'Completed', 9320.00, 'uploads\\1701788907695.png', 'uploads\\1701788907695.png', '2023-12-20 23:51:10', 1, 3, 2, 6, 6),
(7, '2023-12-06 00:00:00', '0000-00-00', '2023-12-11', 'Mandaue City, Cebu', 'Reserved', 12293.00, NULL, NULL, '2023-12-06 00:05:20', 1, 1, 3, 7, 7),
(8, '2023-12-06 00:00:00', '0000-00-00', '2023-12-13', 'SM Seaside, Cebu', 'Reserved', 12293.00, NULL, NULL, '2023-12-06 00:05:15', 1, 1, 3, 8, 8),
(9, '2023-12-06 00:00:00', '0000-00-00', '2023-12-15', 'Talisay City, Cebu', 'Pending', 13203.00, NULL, NULL, NULL, 1, 2, 3, 9, 9),
(10, '2023-12-06 00:00:00', '0000-00-00', '2023-12-09', 'Consolacion, Cebu, Philippines', 'Ongoing', 7293.00, 'uploads\\1701788907695.png', 'uploads\\1701788907695.png', '2023-12-06 00:10:04', 1, 1, 4, 10, 10),
(11, '2023-12-06 00:00:00', '0000-00-00', '2023-12-07', 'Talisay City, Cebu', 'Pending', 12403.00, NULL, NULL, NULL, 1, 2, 1, 11, 11),
(12, '2023-12-06 00:00:00', '0000-00-00', '2023-12-13', 'Bogo, Cebu, Philippines', 'Pullout Docs Required', 7293.00, NULL, NULL, '2023-12-06 07:52:27', 1, 1, 1, 12, 12),
(13, '2023-12-06 00:00:00', '0000-00-00', '2023-12-09', 'Bogo, Cebu', 'Pullout Docs Required', 12293.00, NULL, NULL, '2023-12-06 07:53:58', 1, 1, 8, 13, 13),
(14, '2023-12-06 00:00:00', '0000-00-00', '2023-12-14', 'SM Seaside, Cebu', 'Pending', 6293.00, NULL, NULL, NULL, 1, 1, 7, 14, 14),
(15, '2023-12-07 00:00:00', '0000-00-00', '2023-12-09', 'SM Seaside, Cebu', 'Pending', 12293.00, NULL, NULL, NULL, 1, 1, 1, 15, 15);


INSERT INTO `asset` (`asset_id`, `asset_category`, `asset_name`, `brand`, `type`, `measurements`, `weight`, `plate_number`, `status`, `date_added`, `date_updated`, `is_visible`, `trucker_id`, `booking_id`) VALUES
(1, 'Truck', 'Blue Boy', 'Isuzu', 'Flat-Nose', NULL, NULL, 'PL5-45M-L3R', 'In-Use', '2023-12-05 00:00:00', NULL, 1, 1, 10),
(2, 'Truck', 'Blue Jr.', 'Isuzu', 'Flat-nose', NULL, NULL, 'TRU-M32-B80', 'Idle', '2023-12-05 00:00:00', NULL, 1, 1, NULL),
(3, 'Trailer', NULL, NULL, 'Flatbed', '16.15 x 3.10 m', '100.00 kg', 'L31-H3N-R4Y', 'In-Use', '2023-12-05 00:00:00', NULL, 1, 1, 10),
(4, 'Truck', 'TB-TRK-01', 'Hino', 'Flat-nose', NULL, NULL, '4R4-TKL-MN4', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(5, 'Truck', 'TB-TRK-02', 'Isuzu', 'Semi', NULL, NULL, 'R1B-L63-MNA', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(6, 'Truck', 'TB-TRK-03', 'Foton', 'Flat-nose', NULL, NULL, 'LDR-BRF-123', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(7, 'Truck', 'TB-TRK-04', 'JAC Motors', 'Flat-nose', NULL, NULL, 'Y0G-RYL-40L', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(8, 'Trailer', NULL, NULL, 'Flatbed', '14.63 x 3.10m', '500.00 kg', 'PL4-T3N-UM3', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(9, 'Trailer', NULL, NULL, 'Stepdeck', '16.15 x 3.10m', '100.00 kg', 'KLR-Q33-NR3', 'Idle', '2023-12-05 00:00:00', NULL, 1, 2, NULL),
(10, 'Truck', 'HG-TK1', 'Dong Feng', 'Semi', NULL, NULL, 'PR3-R4V-ZQW', 'Idle', '2023-12-05 00:00:00', NULL, 1, 3, NULL),
(11, 'Truck', 'HG-TK2', 'Hino', 'Flat-nose', NULL, NULL, 'FDE-M3N-GFD', 'Idle', '2023-12-05 00:00:00', NULL, 1, 3, NULL),
(12, 'Trailer', NULL, NULL, 'Flatbed', '16.15  x 3.10m', '100.00 kg', 'FSD-WAS-QWE', 'Idle', '2023-12-05 00:00:00', NULL, 1, 3, NULL),
(13, 'Trailer', NULL, NULL, 'Flatbed', '16.15 x 3.10m', '100.00 kg', 'GB2-091-HH1', 'Idle', '2023-12-05 00:00:00', NULL, 1, 3, NULL);
