const route = require('express').Router();

// Route modules
const auth = require('auth');

route
  .route('/')
  .get((req, res, next) => {
    res.send('Route works');
});

route.use('/auth', auth);

module.exports = route;