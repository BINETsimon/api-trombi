module.exports = (sequelize, Sequelize) => {
  const picture = sequelize.define('picture', {
    picture_url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return picture;
};