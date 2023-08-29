//user facing js file
const express = require('express');
const productsRepo = require('../repositories/products2');
const UserProductsIndexTemplate = require('../views/products/index');

const app = express.Router();

app.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(UserProductsIndexTemplate({ products }));
});


module.exports = app;

//localhost:3000
