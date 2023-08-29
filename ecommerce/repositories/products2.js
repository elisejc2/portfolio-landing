const Repositories = require('./repositories');

class ProductsReposities extends Repositories {};


//new instance 
module.exports = new ProductsReposities('products2.json');