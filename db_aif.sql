-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2024 at 06:41 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_aif`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Checkout` (IN `user_id` INT, IN `payment_method` ENUM('online','delivery'))   BEGIN
    DECLARE total INT;

    SELECT SUM(p.Price * c.Quantity)
    INTO total
    FROM Cart c
    JOIN Products p ON c.Product_ID = p.Product_ID
    WHERE c.User_ID = user_id;

    INSERT INTO Orders (User_ID, Total, Payment_Method)
    VALUES (user_id, total, payment_method);

    SET @order_id = LAST_INSERT_ID();

    INSERT INTO OrderDetails (Order_ID, Product_ID, Quantity, Price)
    SELECT @order_id, c.Product_ID, c.Quantity, p.Price
    FROM Cart c
    JOIN Products p ON c.Product_ID = p.Product_ID
    WHERE c.User_ID = user_id;

    DELETE FROM Cart WHERE User_ID = user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GetStoreTransactions` (IN `owner_id` INT)   BEGIN
    SELECT 
        s.Store_Name,
        o.Order_ID,
        o.Order_Date,
        od.Product_ID,
        ct.cate_Name,
        p.Product_Name,
        od.Quantity,
        u.Unit_Name,
        od.Price,
		o.Total
    FROM 
        Orders o
        JOIN OrderDetails od ON o.Order_ID = od.Order_ID
        JOIN Products p ON od.Product_ID = p.Product_ID
        JOIN Stores s ON p.Store_ID = s.Store_ID
        JOIN categorys ct ON p.Cate_ID = ct.cate_ID
        JOIN units u ON p.Unit_ID = u.unit_ID
    WHERE 
        s.Owner_ID = owner_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GetUserOrders` (IN `user_id` INT)   BEGIN
    SELECT 
        o.Order_ID,
        o.Order_Date,
        od.Product_ID,
        p.Product_Name,
        od.Quantity,
        od.Price,
        o.Total
    FROM 
        Orders o
        JOIN OrderDetails od ON o.Order_ID = od.Order_ID
        JOIN Products p ON od.Product_ID = p.Product_ID
    WHERE 
        o.User_ID = user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_ManageCart` (IN `mode` VARCHAR(255), IN `user_id` INT, IN `product_id` INT, IN `quantity` INT)   BEGIN
    IF mode = 'add' THEN
        INSERT INTO Cart (User_ID, Product_ID, Quantity)
        VALUES (user_id, product_id, quantity)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity);
    ELSEIF mode = 'update' THEN
        UPDATE Cart
        SET Quantity = quantity
        WHERE User_ID = user_id AND Product_ID = product_id;
    ELSEIF mode = 'delete' THEN
        DELETE FROM Cart WHERE User_ID = user_id AND Product_ID = product_id;
    ELSEIF mode = 'view' THEN
        SELECT c.Cart_ID, p.Product_Name, c.Quantity, p.Price, ct.cate_Name
        FROM Cart c
        JOIN Products p ON c.Product_ID = p.Product_ID
        JOIN categorys ct ON p.cate_ID = ct.cate_ID
        WHERE c.User_ID = user_id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Product` (IN `mode` VARCHAR(255), IN `id` INT, IN `st_id` INT, IN `name` VARCHAR(255), IN `p_detail` VARCHAR(255), IN `p_price` INT, IN `p_stock` INT, IN `u_id` INT, IN `c_id` INT)   BEGIN
    IF mode = 'select' THEN
        SELECT * FROM products;
    ELSEIF mode = 'select_by_id' THEN
        SELECT * FROM products WHERE Product_ID = id;
    ELSEIF mode = 'select_by_name' THEN
        SELECT * FROM stores WHERE Product_Name = name;
    ELSEIF mode = 'select_by_store' THEN
        SELECT * FROM stores WHERE Store_ID = st_id;
    ELSEIF mode = 'insert' THEN
        INSERT INTO products (Store_ID, Product_Name, Detail, Price, Stock, Unit_ID, Cate_ID)
        VALUES (st_id, name, p_detail, p_price, p_stock, u_id, c_id);
    ELSEIF mode = 'delete' THEN
        DELETE FROM products WHERE Product_ID = id;
    ELSEIF mode = 'update' THEN
        UPDATE products
        SET Store_ID = st_id,
            Product_Name = name,
            Detail = p_detail,
            Price = p_price,
            Stock = p_stock,
            Unit_ID = u_id,
            Cate_ID = c_id
        WHERE Product_ID = id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Store` (IN `mode` VARCHAR(255), IN `id` INT, IN `name` VARCHAR(255), IN `owner` INT, IN `s_tel` VARCHAR(255), IN `s_detail` VARCHAR(255))   BEGIN
    IF mode = 'select' THEN
        SELECT * FROM stores;
    ELSEIF mode = 'select_by_id' THEN
        SELECT * FROM stores WHERE Owner_ID = owner;
    ELSEIF mode = 'select_by_name' THEN
        SELECT * FROM stores WHERE Store_Name = name;
    ELSEIF mode = 'insert' THEN
        INSERT INTO stores (Store_Name, Owner_ID, tel, detail)
        VALUES (name, owner, s_tel, s_detail);
    ELSEIF mode = 'delete' THEN
        DELETE FROM stores WHERE Store_ID = id;
    ELSEIF mode = 'update' THEN
        UPDATE stores
        SET Store_Name = name,
            Owner_ID = owner,
            tel = s_tel,
            detail = s_detail
        WHERE Store_ID = id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_User` (IN `mode` VARCHAR(255), IN `id` INT, IN `user_name` VARCHAR(255), IN `password` VARCHAR(255), IN `email` VARCHAR(255), IN `role` VARCHAR(50), IN `secret_key` VARCHAR(255))   BEGIN
    IF mode = 'select' THEN
        SELECT * FROM Users;
    ELSEIF mode = 'select_by_id' THEN
        SELECT * FROM Users WHERE User_ID = id;
    ELSEIF mode = 'insert' THEN
        INSERT INTO Users (Username, Password, Email, Role, secret_key)
        VALUES (user_name, password, email, role, secret_key);
    ELSEIF mode = 'delete' THEN
        DELETE FROM Users WHERE User_ID = id;
    ELSEIF mode = 'update' THEN
        UPDATE Users
        SET Username = user_name,
            Password = password,
            Email = email,
            Role = role
        WHERE User_ID = id;
    ELSEIF mode = 'login' THEN
        SELECT * FROM Users WHERE Username = user_name;
    ELSEIF mode = 'select_key' THEN
        SELECT secret_key FROM Users WHERE User_ID = id;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `Cart_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `cate_ID` int(11) NOT NULL,
  `cate_Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorys`
--

INSERT INTO `categorys` (`cate_ID`, `cate_Name`) VALUES
(1, 'ເຄື່ອງດື່ມ'),
(2, 'ຂອງແຊ່ແຂງ'),
(3, 'ເຄື່ອງດື່ມທາດເຫຼົ້າ');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `OrderDetail_ID` int(11) NOT NULL,
  `Order_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`OrderDetail_ID`, `Order_ID`, `Product_ID`, `Quantity`, `Price`) VALUES
(1, 1, 2, 6, 15000),
(2, 2, 2, 3, 15000);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Total` int(11) NOT NULL,
  `Payment_Method` enum('online','delivery') NOT NULL,
  `Order_Date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Order_ID`, `User_ID`, `Total`, `Payment_Method`, `Order_Date`) VALUES
(1, 7, 90000, 'online', '2024-08-03 10:52:09'),
(2, 7, 45000, 'online', '2024-08-03 10:58:07');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `Product_ID` int(11) NOT NULL,
  `Store_ID` int(11) NOT NULL,
  `Product_Name` varchar(255) NOT NULL,
  `Detail` varchar(255) NOT NULL,
  `Price` int(20) NOT NULL,
  `Stock` int(11) NOT NULL,
  `Unit_ID` int(11) NOT NULL,
  `Cate_ID` int(11) NOT NULL,
  `Product_Img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Product_ID`, `Store_ID`, `Product_Name`, `Detail`, `Price`, `Stock`, `Unit_ID`, `Cate_ID`, `Product_Img`) VALUES
(2, 1, 'ເບຍນ້ຳຂອງ', '.....', 15000, 15, 1, 3, '');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `Store_ID` int(11) NOT NULL,
  `Store_Name` varchar(255) NOT NULL,
  `Owner_ID` int(11) NOT NULL,
  `Create` datetime NOT NULL DEFAULT current_timestamp(),
  `Update` datetime NOT NULL,
  `tel` varchar(255) NOT NULL,
  `detail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`Store_ID`, `Store_Name`, `Owner_ID`, `Create`, `Update`, `tel`, `detail`) VALUES
(1, 'ShopME', 7, '2024-08-02 20:55:09', '0000-00-00 00:00:00', '777554300', '........');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `Trans_ID` varchar(255) NOT NULL,
  `Order_ID` varchar(255) NOT NULL,
  `Store` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Create_Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `unit_ID` int(11) NOT NULL,
  `Unit_Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`unit_ID`, `Unit_Name`) VALUES
(1, 'ແກ້ວ'),
(2, 'ຖົງ'),
(3, 'ແກັດ'),
(4, 'ອັນ'),
(5, 'ຫໍ່');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Create` datetime NOT NULL DEFAULT current_timestamp(),
  `Update` datetime NOT NULL,
  `Email` varchar(255) NOT NULL,
  `secret_key` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Username`, `Password`, `Role`, `Create`, `Update`, `Email`, `secret_key`) VALUES
(7, 'jay', '$2b$10$Nf2bunepWJ9J0pHDbnGphe4VB0jNJddNnhBrg6lor/ojBBbPSodOK', 'admin', '2024-08-02 09:34:01', '0000-00-00 00:00:00', 'jay@gmail.com', '4be671c25cc5664de17e22941821ccff8295658b68b969e2d32cc11c9b4e2fa18f8ac79c3a6fce4b602b6f9f5476604cddbb071502d790d46de362ad7703d8e0'),
(8, 'kea', '$2b$10$bfWLxBtrHLsDnOj7KMWGsO/ayfqutvf1hghejrTY.FQNZH6hxyS.u', 'admin', '2024-08-02 09:57:51', '0000-00-00 00:00:00', 'kea@gmail.com', '23c8b86663852cc3fe78fde6a1ec2334fb0127899d79cccf0d42f14fff3732c86a87a0baefa9fdcedc9dbcac8f07d0a3eec566adb25eac79dcef7513f89ca3c7');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`Cart_ID`),
  ADD UNIQUE KEY `unique_user_product` (`User_ID`,`Product_ID`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`cate_ID`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`OrderDetail_ID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_ID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`Product_ID`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`Store_ID`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`Trans_ID`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`unit_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `Cart_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `cate_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `OrderDetail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `Product_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `Store_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `unit_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
