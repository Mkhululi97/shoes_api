### Unit Tests
[![Node.js CI](https://github.com/Mkhululi97/shoes_api/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mkhululi97/shoes_api/actions/workflows/node.js.yml)

# Project codeX - Shoe API solution

This is a solution to the Shoe API challenge from one of codeX's challenges on their curriculum.

### Table of contents
- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Getting started](#to-get-started)
  - [API endpoints](#api-endpoints)
  - [Testing API](#testing-the-api)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge
Build Lubalolo an API that will allow him to, list all shoes in stock, list all shoes for a given brand, list all shoes for a given size, list all shoes for a given brand and size. Update the stock levels when a shoe is sold. Add a new shoe to his stock.

#### Welcome to the Shoe Catalogue API documentation.
This API allows you to build an e-commerce like shoe-webapp.
Data in this API consists of the shoe's image, quantity, brand, price, size and color allowing users a selected range of designer shoes to choose from.
API also has Login and Cart features. Each user get's have their own custom cart, that will have shoes they had selected to add on the basket.

#### To get started:

1. Clone Repo: 
```bash 
git clone https//github.com/mkhululi97/shoes_api.git 
```
2. Go the repos directory:
```bash
cd shoes_api
```
3. Install dependencies:
```bash
npm install
```
4. Setup your database and run the tables.sql script, to create relations in your db, then run, content.sql script to insert the given data in your db.
``` ```
5. Start the server:
```bash
npm start
```

### API Endpoints

- #### Shoe 

  - GET /api/shoes - List all shoes in stock.
  - GET /api/shoes/:id - Get shoe in stock by shoe id.
  - GET /api/shoes/brand/:brandname - List all shoes for a given brand.
  - GET /api/shoes/size/:size - List all shoes for a given size.
  - GET /api/shoes/color/:color - List all shoes for a given color.
  - GET /api/shoes/brand/:brandname/size/:size - List all shoes for a given brand and size.
  - GET /api/shoes/brand/:brandname/color/:color - List all shoes for a given brand and color.
  - GET /api/shoes/size/:size/color/:color - List all shoes for a given size and color.
  - GET /api/shoes/brand/:brandname/size/:size/color/:color - List all shoes for a given brand, size, and color.

  - POST /api/shoes/sold/:id - Updates the stock level of a shoe.
  - POST /api/shoes - Add a new shoe to his stock.

- ### Cart 

  - GET /api/cart/:email - Get a user's cart for the given email.
  - POST /api/cart/add - Add shoe to the user's cart.
  - POST /api/cart/remove - Removes a shoe from the user's cart.
  - POST /api/cart/delete - Delete's the cart.
  - POST /api/cart/payment - Clears the cart on successful payment.
  - POST /api/cart/sold - Update the stock levels when shoe is sold.

- ### Users

  - POST /api/users/signup - Add a user to the system.
  - POST /api/users/login - Allow user to make a purchase.


#### Testing the API

You can use the REST Client VS Code extension, to make HTTP requests and test each endpoint. Or you can try the API with Postman as well.

### Built with

Express.js
NodeJS
PostgreSQL
TDD with Mocha

### What I learned

I learned to how design a relational database for an e-commerce like webapp.
How to create multiple API's that would make up 
Render the data on my application using AlpineJS.

### Continued development

Get better with AlpineJS, handling user login forms and to use session storage instead of local storage.

### Useful resources

codeX internal resources

### Author

- Site: [My Portfolio Site](https://mkhululi97.github.io/portfolio_website/)
- LinkedIn: [My LinkedIn](https://linkedin.com/in/mkhululi-mtshali-bb8920116)