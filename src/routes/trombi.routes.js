module.exports = app => {
  const trombi = require('../controllers/trombi.controller.js');
  const uploadMiddleware = require('../middleware/uploads.js');
  const auth = require('../middleware/auth');
  
  var router = require('express').Router();
  
  // Upload multiple pictures
  router.post('/', auth.authenticateToken, uploadMiddleware, trombi.uploadFile);

  // Update pictures name
  router.put('/', auth.authenticateToken, trombi.updateFile);
  
  // Retrieve all pictures name
  router.get('/', auth.authenticateToken, trombi.findAll);
  
  // Retrieve a single picture with name
  router.get('/:fileName', auth.authenticateToken, trombi.findOne);
  
  // Delete a picture with id
  router.delete('/:fileName', auth.authenticateToken, trombi.delete);
  
  app.use('/trombi', router);
};