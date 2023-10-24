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