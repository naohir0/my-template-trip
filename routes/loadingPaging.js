var express = require('express');
var router = express.Router();
const authensure = require('./authensure');

router.get('/',authensure,(req,res,next)=>{
  res.render('loading');
});

router.get('/loadingData',authensure,(req,res,next)=>{
  res.redirect('/loading');
});
module.exports = router;