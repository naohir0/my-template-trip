'use strict';
const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const Title = require('../models/title');

router.get('/',authensure,(req,res,next)=>{
  const id = req.query.id;
  Title.findAll({
    where:{share:"true"},
    order:[['updateAt','DESC']]
  }).then((titles)=>{
    res.render('share', {
      user:req.user,
      shareTitles:titles,
      id:id
    })
  })
})

module.exports = router;