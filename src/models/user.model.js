module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define('user', {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });
  
  return user;
};