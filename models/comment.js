const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const listComment = loader.database.define('listComment',{
  listCommentId:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  listItemId:{
    type:Sequelize.UUID,
    allowNull:false
  },
  postedBy:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  listCommentTitle:{
    type:Sequelize.STRING
  },
  listCommentCont:{
    type:Sequelize.TEXT
  }
});

listComment.sync();
module.exports = listComment;

