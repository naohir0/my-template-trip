var express = require('express');
var router = express.Router();
var Title = require('../models/title');
var subTitle = require('../models/subtitle');
const loader = require('../models/sequelize-loader');
const Sequelize = loader.Sequelize;
const Op = Sequelize.Op;


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
  const insertAt = req.query.insertAt;
  const t = req.query.t;
  var countLoadingAll = 0;
  console.log(`ローディングId : ${loadingId}`);

  setTimeout(()=>{
  Title.findAll({
    where:{insertAt:insertAt}
  }).then((titles)=>{
  const titleId = titles[0].titleId

  function titleImgInput(){
     if(t === '1'){
      var topImg = titles[0].topImg;
      var imgUri = loadingId + topImg;
      var key = `public/images/upload_diary_topImg/${topImg}`;
      var uploadParams = {Bucket: bucket_name, Key:key};
      var file = fs.createWriteStream(`public/images/getFromS3_img/${imgUri}`);
      var readStream = s3.getObject(uploadParams).createReadStream();
      readStream.pipe(file);
      readStream.on('error',(e)=>{
        file.destroy(e);
      })
      readStream.on('finish',()=>{
        countLoadingAll+=1;
        if(countLoadingAll===2){
          return res.redirect(`/users/?id=${loadingId}`);
        }
      })
   } else {
    countLoadingAll+=1;
    if(countLoadingAll===2){
      return res.redirect(`/users/?id=${loadingId}`);
      }
   }
  }

  function subImgInput(){
    var countLoading = 0;
    subTitle.findAll({
      where:{
        titleId:titleId,
        pict:{[Op.not]:""}
      }
    }).then((sub)=>{
      console.log(`取得したsubデータ ${sub}`);
      const subLength = sub.length;
      if(sub!==[]){
      console.log('サブタイトル写真有り');
      for(i=0;i<subLength;i++){
         var subImg = sub[i].pict;
         var subUri = loadingId + subImg;
         console.log(`subImgパス　：　${subImg}`)
         var key = `public/images/upload_img/${subImg}`;
         var uploadParams = {Bucket: bucket_name, Key:key};
         var file = fs.createWriteStream(`public/images/getFromS3_img/${subUri}`);
         var readStream = s3.getObject(uploadParams).createReadStream();
         readStream.pipe(file);
         readStream.on('error',(e)=>{
           file.destroy(e);
         })
         readStream.on('finish',()=>{
            countLoading+=1;
            if(countLoading===subLength){
              countLoadingAll+=1;
              if(countLoadingAll===2){
              return res.redirect(`/users/?id=${loadingId}`);
              }
            }
         })
      }
     } else {
        countLoadingAll+=1;
        console.log('サブタイトル写真無し');
        if(countLoadingAll===2){
        return res.redirect(`/users/?id=${loadingId}`);
        }
     }
    });
   };
    //関数の実行
    titleImgInput();
    subImgInput();
  });
 },4000);
});

module.exports = router;
