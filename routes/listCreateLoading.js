var express = require('express');
var router = express.Router();
var List = require('../models/list');


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


router.get('/', function(req, res, next) {
  const loadingId = req.query.id;
  const updateAt = req.query.updateAt;
  console.log(`アップデート：${updateAt}`)
  console.log(`ローディングId : ${loadingId}`);

  setTimeout(()=>{
  List.findAll({
    where:{updateAt:updateAt}
  }).then((lists)=>{

  function titleImgInput(){
      var listImg = lists[0].listItemPict;
      var imgUri = loadingId + listImg;
      var key = `public/images/upload_list_icon/${listImg}`;
      var uploadParams = {Bucket: bucket_name, Key:key};
      var file = fs.createWriteStream(`public/images/getFromS3_img/${imgUri}`);
      var readStream = s3.getObject(uploadParams).createReadStream()
      readStream.pipe(file);
      readStream.on('error',(e)=>{
          file.destroy(e);
      })
      readStream.on('finish',()=>{
         setTimeout(()=>{return res.redirect(`/list/?id=${loadingId}`)},3000);
     });
    }
  titleImgInput();
  });
 },10000);
});

module.exports = router;
