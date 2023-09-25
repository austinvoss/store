-- Delete data from tables in the reverse order of their dependencies
DELETE FROM Orders;
DELETE FROM Cart;
DELETE FROM Products;
DELETE FROM Users;

-- Reset the serial counter for the Users table
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Reset the serial counter for the Products table
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Seed Users
INSERT INTO Users (username, email, password_hash) VALUES
('john_doe', 'john.doe@example.com', 'hashedpassword1'),
('jane_doe', 'jane.doe@example.com', 'hashedpassword2');

-- Seed Products
INSERT INTO Products (name, description, price, photo_url, category) VALUES
('Laptop', 'A high performance laptop', 1200.00, 'url1', 'Electronics'),
('Phone', 'Latest smartphone', 800.00, 'url2', 'Electronics'),
('Headphones', 'Noise-cancelling over-ear headphones', 300.00, 'url3', 'Electronics'),
('TV', '4K Ultra HD Smart TV', 900.00, 'url4', 'Electronics'),
('Camera', 'Digital SLR Camera', 700.00, 'url5', 'Electronics'),
('Table', 'Wooden dining table', 250.00, 'url6', 'Furniture'),
('Sofa', 'Three-seater sofa', 500.00, 'url7', 'Furniture'),
('Chair', 'Office chair', 120.00, 'url8', 'Furniture'),
('Watch', 'Analog wrist watch', 200.00, 'url9', 'Accessories'),
('Bag', 'Leather bag', 100.00, 'url10', 'Accessories');


-- Seed Cart
INSERT INTO Cart (user_id, product_id, quantity) VALUES
(1, 1, 2),
(2, 2, 1);

-- Seed Orders
INSERT INTO Orders (user_id, total_price, status) VALUES
(1, 2400.00, 'Shipped'),
(2, 800.00, 'Pending');

-- Create View
CREATE OR REPLACE VIEW CartView AS
SELECT
  Cart.id,
  Cart.user_id,
  Cart.quantity,
  Products.name,
  Products.price,
  Products.description,
  Products.category
FROM
  Cart
JOIN Products ON Cart.product_id = Products.id;