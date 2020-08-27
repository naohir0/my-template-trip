var express = require('express');
var router = express.Router();
var Title = require('../models/title');
var subTitle = require('../models/subtitle');
var authensure = require('./authensure')

/* GET users listing. */
router.get('/',authensure,(req, res, next)=>{
   Title.findAll({
     where:{postedBy:req.user.id},
     order:[['"date"','DESC']]
   }).then((titles)=>{
       const title_length = titles.length
       res.render('users',{
         user:req.user,
         titles:titles,
         length:title_length
       })
   })
});

module.exports = router;
