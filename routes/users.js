var express = require('express');
var router = express.Router();
var Title = require('../models/title');
var subTitle = require('../models/subtitle');
var authensure = require('./authensure');
const fs = require('fs');
var AWS = require('aws-sdk');
var accessKey = "AKIAJOOIJEHLYZKCQBJA";
var secretKey = "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";
const bucket_name = "my-template-trip-assets";

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

/* GET users listing. */
router.get('/',authensure,(req, res, next)=>{
   const loadingId = req.query.id;
   console.log(`パースしたID：${loadingId}`);
   Title.findAll({
     where:{postedBy:req.user.id},
     order:[['"date"','DESC']]
   }).then(async(titles)=>{
   const title_length = titles.length;
       //S3から画像を取得、ファイルへの書き込み
   const Titles = titles;
   var fieldId = [];
   function getA(titles){
      for(i=0;i<title_length;i++){
        var title = titles[i];
        var key = `public/images/upload_diary_topImg/${titles[i].topImg}`;
        var uploadParams = {Bucket: bucket_name, Key:key};
        var fieldIdCont = Math.floor(Math.random()*5000).toString() + titles[i].topImg;
        title["fieldId"] = fieldIdCont;
        var file = fs.createWriteStream(`public/images/getFromS3_img/${fieldIdCont}`);
        s3.getObject(uploadParams).createReadStream().pipe(file);
        console.log(`パイプ${i} 完了です`);
    } 
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(titles)},30000);
     });
    }

   function getUsersItem(titles){
    res.render('users',{
         user:req.user,
         titles:titles,
         length:title_length,
         id:loadingId
      });
      console.log("getB 完了です");
    }
    
    getUsersItem(titles);
    
   });
  });

  router.post('/',authensure,(req, res, next)=>{
    const loadingId = req.query.id;
    console.log(`パースしたID：${loadingId}`);
    Title.findAll({
      where:{postedBy:req.user.id},
      order:[['"date"','DESC']]
    }).then(async(titles)=>{
    const title_length = titles.length;
 
    function getUsersItem(titles){
     res.render('users',{
          user:req.user,
          titles:titles,
          length:title_length,
          id:loadingId
       });
       console.log("getB 完了です");
     }
     getUsersItem(titles);
    });
   });
  

module.exports = router;
