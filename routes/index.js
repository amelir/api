const route = require('express').Router();

// Route modules
const account = require('account-api');
const auth = require('auth');

route
  .route('/')
  .get((req, res, next) => {
    res.send('Route works');
});

route.use('/auth', auth);

// Require token for any request outside authentication
route.use(require('auth/checkToken'));

route.use('/account', account);

module.exports = route;