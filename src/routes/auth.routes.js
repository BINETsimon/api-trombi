module.exports = app => {
  const athentication = require('../controllers/auth.controller.js');
  const auth = require('../middleware/auth');
  
  var router = require('express').Router();
  
  // Signin a new user
  router.post('/signup', athentication.signUp);

  // Login a user
  router.post('/login', athentication.logIn);
    
  // Get User by token
  app.get('/me', auth.authenticateToken, athentication.findMe);
    
  // Get User by token
  app.put('/me', auth.authenticateToken, athentication.updateMe);
    
  app.use('/auth', router);
};