const { check } = require('express-validator'); //it also needs UsersRepo
const usersRepo = require('../../repositories/users');

//middleware fxns that can be exported and used by the other files
module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5 and 40 characters.'),

    requirePrice: check('price')
        .trim()
        .toFloat() //when the admin user types in the price input, it is read in as a string. this converts it to a float and isFloat checks that it is a float with a min of 1
        .isFloat({ min: 1 })
        .withMessage('Must be a number of at least 1 character.'),

    requireEmail:  check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email }); //the key and value are idential { email: email } so we can shorten it to just { email }
            if (existingUser) {
                throw new Error('email in use')
            }
        }
    ),

    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters'),

    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters')
        .custom(async (passwordConfirmation, { req }) => {
            console.log('BEN::: pwConf', passwordConfirmation)
            console.log('BEN::: req', req.body)

            if (passwordConfirmation !== req.body.password) {
              throw new Error('Passwords must match')
            } 
        }),

    requireEmailExists:  check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({ email }); //used to search by one crietera such as email 
            if (!user) {
                throw new Error('Email not found');
            }
        }),    

    requireValidPasswordForUser: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email }); //this is how we find the user 
            //to guard against the error msg of 'user is undefinded'
            if(!user) {
                throw new Error('invalid password'); //even tho technically its not an invalid password but rather something just went wrong in the user identifying processes 
            }
            const validPassword = await usersRepo.comparePasswords(
                user.password, //this is the exisiting password, its put as the 1st argument into comparePasswords
                password //then this is the password that is supplied by the current user
            )
            if (!validPassword) {
                throw new Error('invalid password');
            }
        })
}