CREATE DATABASE nodejscrud;

use nodejscrud;

CREATE TABLE customer(
    idcustom INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    adress VARCHAR(100) NOT NULL,
    phone VARCHAR(15)
);

SHOW TABLES;

describe customer;