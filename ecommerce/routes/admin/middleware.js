const { validationResult } = require('express-validator');

module.exports = {
    //'next' is similar to 'continue' -> it tells express tht we're all done w the computation here so it continue on with the rest of the request (its a callback; express was designed b4 Promises)
    handleErrors(templateFxn, dataCallBack) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                //since DataCallBack is an optional arg we need to check if it was provided first
                let data = {};
                if (dataCallBack) {
                  data = await dataCallBack(req);
                }

                return res.send(templateFxn({ errors, ...data })); //doing ...data here takes any existing keys&values from data and merges them into the errors object
            }
            next(); //this says everything went well (no errors) so continue with the middleware fxn / route handler
        };
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        } 
        next();
    }
};