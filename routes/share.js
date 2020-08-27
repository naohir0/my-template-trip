'use strict';
const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const Title = require('../models/title');

router.get('/',authensure,(req,res,next)=>{
  Title.findAll({
    where:{share:"true"},
    order:[['updateAt','DESC']]
  }).then((titles)=>{
    res.render('share', {
      user:req.user,
      shareTitles:titles
    })
  })
})

module.exports = router;