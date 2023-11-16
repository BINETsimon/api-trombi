const db = require('../models');

const User = db.users;
const Op = db.Sequelize.Op;

const auth = require('../middleware/auth');

// Create and Save a new User
exports.create = (req, res) => {
  
  // Create a User
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };
  
  // Password check  
  if (req.body.first_name) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }

  // Save User in the database
  User.create(user)
    .then(data => {
      data.token = token;
      const token = auth.generateToken(user);
      console.log(token);
      user.token = token;

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the User.'
      });
    });
};

// Retrieve all USER from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving users.'
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error retrieving User with id=' + id
      });
    });
};

// Find a specific User
exports.findMe = (req, res) => {
  const email = req.user.email;

  console.log(req);

  User.findOne({ where: { email: email } })
    .then(data => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error retrieving you'
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error updating User with id=' + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id
      });
    });
};