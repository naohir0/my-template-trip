const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/my_trip_making',
  {
    operatorsAliases: false
  }
);

module.exports = {
   Sequelize:Sequelize,
   database:sequelize
}