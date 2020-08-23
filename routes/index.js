var express = require('express');
var router = express.Router();
var Title = require('../models/title');

/* GET home page. */
router.get('/', function(req, res, next) {
  Title.findAll({
    where:{share:"true"},
    order:[['updateAt','ASC']]
  }).then((titles)=>{
    res.render('index', {
      title: 'Express',
      shareTitles:titles
    })
  })
});

module.exports = router;
