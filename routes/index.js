const route = require('express').Router();

route
  .route('/')
  .get((req, res, next) => {
    res.send('Route works');
});

module.exports = route;