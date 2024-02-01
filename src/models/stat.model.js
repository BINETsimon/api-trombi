module.exports = (sequelize, Sequelize) => {
  const stat = sequelize.define('stat', {
    success: {
      type: Sequelize.NUMBER,
      allowNull: false
    }
  });
  
  return stat;
};