var express = require('express');
var router = express.Router();
var Title = require('../models/title');
var subTitle = require('../models/subtitle');
var authensure = require('./authensure');

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const bucket_name = "my-template-trip-assets";

/* GET users listing. */
router.get('/',authensure,(req, res, next)=>{
   Title.findAll({
     where:{postedBy:req.user.id},
     order:[['"date"','DESC']]
   }).then((titles)=>{
       const title_length = titles.length;

       s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

       res.render('users',{
         user:req.user,
         titles:titles,
         length:title_length
       })
   })
});

module.exports = router;
