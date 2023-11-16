module.exports = app => {
  const users = require('../controllers/user.controller.js');
  const auth = require('../middleware/auth');
  
  var router = require('express').Router();
  
  // Create a new user
  router.post('/', users.create);
  
  // Retrieve all users
  router.get('/', users.findAll);

  // Retrieve a single user with id
  router.get('/:id', users.findOne);
  
  // Update a user with id
  router.put('/:id', auth.authenticateToken, users.update);
  
  // Delete a user with id
  router.delete('/:id', users.delete);

  
  app.use('/users', router);

};