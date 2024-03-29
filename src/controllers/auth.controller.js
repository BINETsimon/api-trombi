const db = require('../models');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = db.users;

const auth = require('../middleware/auth');
const fs = require('fs');

// Create and Save a new User
exports.signUp = (req, res) => {
  
  let userReq = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };

  // Password check  
  if (!userReq.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g)) {
    res.status(400).send({
      type: 'error',
      message: 'your password didn\'t match the following rules : Minimum 8 characters, at least one letter, one number and one special character.'
    });
    return;
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error('Error while generating salt :', err);
      return;
    } else {
      bcrypt.hash(userReq.password, salt, (err, hash) => {
        if (err) {
          console.error('Error while hashing password :', err);
          return;
        } else {
          userReq.password = hash;
          
          // Save User in the database
          User.findOne({ where: {email: userReq.email} })
            .then((check) => {
              console.log(!check);
              if (check) {
                res.status(400).send({
                  type: 'error',
                  message: `${userReq.email} email adress is already used.`
                });
              }else{
                User.create(userReq)
                  .then(data => {

                    const folderName = `uploads/${userReq.email}`;
                    try {
                      if (!fs.existsSync(folderName)) {
                        fs.mkdirSync(folderName);
                      }
                    } catch (err) {
                      console.error(err);
                    }

                    const token = auth.generateToken(data.dataValues);
                    const userRes = {
                      first_name: data.first_name,
                      last_name: data.last_name,
                      email: data.email,
                    };

                    res.send({
                      data: userRes,
                      token: token
                    });
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                  err.message || 'Some error occurred.'
                    });
                  });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message:
          err.message || 'Some error occurred.'
              });
            });



        }
      });
    }
  });
};

// Retrieve all USER from the database.
exports.logIn = (req, res) => {

  User.findOne({ where: {email: req.body.email} })
    .then((data) => {
      
      bcrypt.compare(req.body.password, data.password, (err, result) => {
        if (err) {
          console.error('Error while comparing passwords :', err);
        } else {
          if (result) {
            const token = auth.generateToken(data.dataValues);
            data.token = token;
                
            const user = {
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
            };

            res.send({
              data: user,
              token: token
            });
          } else {
            res.status(400).send({
              type: 'error',
              message: 'password is not correct'
            });
          }
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
              err.message || 'Some error occurred.'
      });
    });
};


// Find a specific User by the token
exports.findMe = (req, res) => {
  const email = req.user.email;

  db.users.findOne({ where: { email: email }})
    .then(data => {
      const userRes = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        pictures: data.pictures
      };
      
      res.send(userRes);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || 'Some error occurred.'
      });
    });
};

// Update a User by the token
exports.updateMe = (req, res) => {
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
    .catch(err => {
      res.status(500).send({
        message: err
      });
    });
};