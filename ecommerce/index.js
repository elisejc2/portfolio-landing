
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session'); //middleware
const authRouter = require('./routes/admin/auth');
const AdminProductsRouter = require('./routes/admin/products');
const UserProductsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const port = 3001
//MIDDLEWARE
app.use(express.static('public')); //every request that comes thru our app is handled first by this middleware in public (it will look in public to see if there is a route that matches the request)
//now all route handlers in our app will use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
    keys: ['wef4nhowt3294ugjea2rg'] //used to encrypt all the info
    })
);
app.use(authRouter); //very important that this is right after the cookies-session
app.use(AdminProductsRouter);
app.use(UserProductsRouter);
app.use(cartsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//and then navigate to localhost:3001
