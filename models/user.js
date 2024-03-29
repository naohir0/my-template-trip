const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('User',{
  userId:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false
  },
  username:{
    type:Sequelize.STRING,
    allowNull:false
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = User;