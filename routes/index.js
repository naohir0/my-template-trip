var express = require('express');
var router = express.Router();
var Title = require('../models/title');

var AWS = require('aws-sdk');
var accessKey = "AKIAJOOIJEHLYZKCQBJA";
var secretKey = "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";
const bucket_name = "my-template-trip-assets";


/* GET home page. */
router.get('/', function(req, res, next) {
  Title.findAll({
    where:{share:"true"},
    order:[['updateAt','ASC']]
  }).then((titles)=>{

  const s3 = new AWS.S3({
  accessKeyId:accessKey,
  secretAccessKey:secretKey
  });
  const params = {
  Bucket: bucket_name,
  CreateBucketConfiguration: {
      // Set your region here
      LocationConstraint: "us-east-2"
   }
  };
  s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
  });
  
    res.render('index', {
      title: 'Express',
      shareTitles:titles
    })
  })
});

module.exports = router;
