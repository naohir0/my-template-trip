const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const List = loader.database.define('List',{
  listItemId:{
    type:Sequelize.UUID,
    allowNull:false,
    primaryKey:true
  },
  postedBy:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  listItemName:{
    type:Sequelize.STRING
  },
  listItemPlace:{
    type:Sequelize.STRING
  },
  listItemPict:{
    type:Sequelize.STRING
  },
  done:{
    type:Sequelize.STRING
  },
  updateAt:{
    type:Sequelize.STRING
  },
  insertAt:{
    type:Sequelize.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
})

module.exports = List