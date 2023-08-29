//this tells our web server what it should do when it receives a network request coming from our browser
//req = incoming request represented in an object from a browser into our web server; we will find info from a user in this object
//res = response; outgoing response from our web server to the browser; we can send back info in this object 
//we are registering a callback (route handler)

const express = require('express');

const { handleErrors } = require('./middleware');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');
const app = express.Router(); //just like the app object

app.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

//MIDDLEWARE
app.post('/signup', 
    [requireEmail, requirePassword, requirePasswordConfirmation], 
    handleErrors(signupTemplate),
    async (req, res) => {
        console.log('hi')
        const { email, password } = req.body; //this is an object that contains all the properties inside of the form ('name' from each inpurt)
        //create a user in our user repo to represent this person
        const user = await usersRepo.create({ email, password });
        //store the id of that user inside the users cookie
        //added by cookie-session library; its like a js object; it will automatically look at the object
        //then take all the info and code it into a simple string and then attach it to the out gooing respoonse as the cookie that should be stored on the user's browser
        req.session.userId = user.id;

        res.redirect('/admin/products');
});

app.get('/signout', (req, res) => {
    req.session = null; //this will clear out any cookie data saved
    res.send('you are logged out');
});

app.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

app.post('/signin', 
    [requireEmailExists, requireValidPasswordForUser], 
    handleErrors(signinTemplate),
    async (req, res) => {
    
        const { email} = req.body;
        const user = await usersRepo.getOneBy({ email });
     
        req.session.userId = user.id; //authenticated with the app
        res.redirect('/admin/products')
    }
);

module.exports = app;
