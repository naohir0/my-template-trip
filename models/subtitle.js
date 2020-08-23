const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const subTitle = loader.database.define('subTitle',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  titleId:{
    type:Sequelize.UUID,
    allowNull:false
  },
  postedBy:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  subtitle:{
    type:Sequelize.STRING
  },
  times:{
    type:Sequelize.STRING
  },
  pict:{
    type:Sequelize.STRING
  },
  impression:{
    type:Sequelize.TEXT
  },
  location:{
    type:Sequelize.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
});

subTitle.sync();
module.exports = subTitle