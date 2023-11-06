-- Shoes Table
CREATE TABLE shoe_api_schema.shoe_details(
    id SERIAL PRIMARY KEY, 
    brand VARCHAR(255),
    color VARCHAR(255),
    name VARCHAR(100),
    size INT,
    price VARCHAR(50),
    quantity INT,
    image_url VARCHAR(500) 
)
-- Users Table
CREATE TABLE shoe_api_schema.users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_admin BOOLEAN NOT NULL
);
-- Cart Table
CREATE TABLE shoe_api_schema.cart(
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES shoe_api_schema.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    cart_status INT
)
-- Orders Table
CREATE TABLE shoe_api_schema.orders(
    id SERIAL PRIMARY KEY ,
    qty FLOAT,
    shoe_id INT,
    cart_id INT,
    FOREIGN KEY(shoe_id) REFERENCES shoe_api_schema.shoe_details (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(cart_id) REFERENCES shoe_api_schema.cart (id) ON UPDATE CASCADE ON DELETE CASCADE
)
