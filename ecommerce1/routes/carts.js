//user facing, for holding all the routes around the user carts
const express = require('express');
const cartsRepo = require('../repositories/carts')
const productsRepo = require('../repositories/products2');
const cartShowTemplate = require('../views/cart/show');

const app  = express.Router();

//receive a post request to add an item to a cart
app.post('/cart/products', async (req, res) => {
    //req.session is managed by cookie session, so thats how we know what user it is
    let cart;
    if (!req.session.cartId) {
        //creating a cart and storing it on the req.session.cartId
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        //there is an existing cart, so need to retrieve it from the carts repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    console.log(cart);


    //receive a get request to show all items in cart
    const existingItem = cart.items.find(item => item.id === req.body.productId)
    if (existingItem) {
        //if true, then we need to incriment the quantity by one
        existingItem.quantity++;
        console.log('im inside of if existingItem statement')

    } else {
        //adding in a new product to the cart
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }


    //save this record by updating the carts repository
    await cartsRepo.update(cart.id, {
        items: cart.items
    });


    res.send("Product Added to cart");
});

//receive a GET request to show all items in cart
app.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/'); //root route 
    }
    const cart = await cartsRepo.getOne(req.session.cartId)
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }
    res.send(cartShowTemplate({ items: cart.items }))
});

//receive a post request to delete an item from a cart
app.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== itemId);
    await cartsRepo.update(req.session.cartId, { items }) //first arg is the IDof the record we want to update, and then the second is the attributes we want to replace on the target record 

    res.redirect('/cart');
});

module.exports = app;
