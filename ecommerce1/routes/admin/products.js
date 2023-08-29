const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middleware');
const products2Repo = require('../../repositories/products2');
const productsNewTemplate = require('../../views/admin/productsnew/new');
const productsIndexTemplate = require('../../views/admin/productsnew/index')
const productsEditTemplate = require('../../views/admin/productsnew/edit');
const { requireTitle, requirePrice } = require('./validators');


const app = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //upload is now a middleware fxn


app.get('/admin/products', requireAuth, async (req, res)=> {
       
    const products = await products2Repo.getAll();
    res.send(productsIndexTemplate({ products }));
});

app.get('/admin/productsnew/new', requireAuth, (req, res)=> {
    
    res.send(productsNewTemplate({}));
});

//this is the route handler that will deal w/ the actual form submission 
//2nd arg is an array of the validators
//3rd arg is a fxn of req and res
app.post(
    '/admin/productsnew/new',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],  
    handleErrors(productsNewTemplate),
    async (req, res) => {
        
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await products2Repo.create({ title, price, image });

    res.redirect('/admin/products');//this redirects the user to the products index page
}); 

app.get('/admin/products/:id/edit', async (req, res) => {
    const product = await products2Repo.getOne(req.params.id);

    if (!product) {
        return res.send('Product not found');
    }
    res.send(productsEditTemplate({ product }));
});
app.post('/admin/products/:id/edit', requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await products2Repo.getOne(req.params.id);
        return { product }; //object w/ product as key&value
    }), //second arg is optional; it returns an object that automatically forwards data to the template
    async (req, res) => {
        const changes = req.body; //represents where the items we are changing are from 
        if (req.file) { //req.file = the file that was uploaded
            changes.image = req.file.buffer.toString('base64');
        }
        try { 
            await products2Repo.update(req.params.id, changes)
        } catch (err) {
            return res.send('could not find item');
        }
        res.redirect('/admin/products');
    }
);

app.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
    await products2Repo.delete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = app;

//get retrives the form and post deals w/ the user trying to submit the form info 
//`to get the errors off the incoming request after its gone thru requiredTitle and requirePrice,
//we have to require in the validation result fxn
//
