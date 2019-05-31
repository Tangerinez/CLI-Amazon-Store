DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR
    (100) NOT NULL,
  category VARCHAR
    (45) NOT NULL,
  department_name VARCHAR
    (100) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("IPhone 10X", "Technology", "Apple Products", 1000, 30);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("Yeezy's", "Shoes", "Clothing", 300, 15);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("IKEA sofa", "Sofas", "Furniture", 200, 5);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("Giant Stuffed Panda", "Stuffed Animals", "Toys", 30, 10);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("Grapefruit LaCroix (24ct)", "Sparkling Water", "Drinks", 18, 50);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("Nerf Gun P50X", "Toy Guns", "Toys", 25, 12);

    INSERT INTO products
        (product_name, category, department_name, price, stock_quantity)
    VALUES
        ("Bosch Dishwasher", "Dishwashers", "Appliances", 1200, 15);