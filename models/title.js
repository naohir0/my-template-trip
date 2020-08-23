const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Title = loader.database.define('Title',{
  titleId:{
    type:Sequelize.UUID,
    primaryKey:true,
    allowNull:false
  },
  postedBy:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  titleName:{
   type:Sequelize.STRING,
   allowNull:false
  },
  date:{
    type:Sequelize.STRING
  },
  weather:{
    type:Sequelize.STRING
  },
  share:{
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
});

module.exports = Title