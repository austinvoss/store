-- Delete data from tables in the reverse order of their dependencies
DELETE FROM Orders;
DELETE FROM Cart;
DELETE FROM Products;
DELETE FROM Users;

-- Seed Users
INSERT INTO Users (username, email, password_hash) VALUES
('john_doe', 'john.doe@example.com', 'hashedpassword1'),
('jane_doe', 'jane.doe@example.com', 'hashedpassword2');

-- Seed Products
INSERT INTO Products (name, description, price, photo_url, category) VALUES
('Laptop', 'A high performance laptop', 1200.00, 'url1', 'Electronics'),
('Phone', 'Latest smartphone', 800.00, 'url2', 'Electronics');

-- Seed Cart
INSERT INTO Cart (user_id, product_id, quantity) VALUES
(1, 1, 2),
(2, 2, 1);

-- Seed Orders
INSERT INTO Orders (user_id, total_price, status) VALUES
(1, 2400.00, 'Shipped'),
(2, 800.00, 'Pending');
