var express = require('express');
var router = express.Router();
var Title = require('../models/title');
var subTitle = require('../models/subtitle');
const List = require('../models/list');
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


/* GET home page. */
router.get('/', function(req, res, next) {
  const loadingId  = Math.floor(Math.random()*500000).toString();
  const encodedLoadingId = encodeURIComponent(loadingId);
  var loadingCountALL = 0;
  
  
  console.log(`ローディングId : ${loadingId}`)
  Title.findAll({
    order:[['updateAt','ASC']]
  }).then((titles)=>{

  function uploadingTitle(){
    const titleLength = titles.length;
    var loadingCount = 0;
    console.log(`タイトルの長さ：${titleLength}`);
    if(titleLength!==0){
    for(var i=0;i<titleLength;i++){
      var topImg = titles[i].topImg;
      var imgUri = loadingId + topImg;
      console.log(`topImgパス${i}　：　${topImg}`)
      var key = `public/images/upload_diary_topImg/${topImg}`;
      var uploadParams = {Bucket: bucket_name, Key:key};
      var file = fs.createWriteStream(`public/images/getFromS3_img/${imgUri}`);
      var readStream = s3.getObject(uploadParams).createReadStream();
      readStream.pipe(file);
      readStream.on('error',(e)=>{
           file.destroy(e);
      });
      readStream.on('finish',()=>{
        loadingCount+=1;
        console.log(`タイトルカウント : ${loadingCount}`)
        if(loadingCount===titleLength){
          loadingCountALL+=1;
          if(loadingCountALL===3){
             console.log(`完了${loadingCountALL}`);
             console.log("全てのタイトル：ダウンロードしました");
             setTimeout(()=>{
              return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
             },5000)
          } else {
             console.log(`完了${loadingCountALL}`);
          }
        }
      });
      console.log(`topImgパス${i}　：　アップロード完了です`);
    }//for文終了
   } else {
      loadingCountALL+=1;
      if(loadingCountALL===3){
         console.log(`完了${loadingCountALL}`);
         console.log("全てのタイトル：ダウンロードしました");
         setTimeout(()=>{
         return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
         },5000)
      } else {
       console.log(`完了${loadingCountALL}`);
    }
   }
  }


   function subImgInput(){
    subTitle.findAll({where:{pict:{[Op.not]:""}}}).then((sub)=>{
      const subLength = sub.length;
      var loadingCount = 0;
      console.log(`サブタイトルの長さ：${subLength}`);
     if(subLength!==0){
      for(var i=0;i<subLength;i++){
         var subImg = sub[i].pict;
         var subUri = loadingId + subImg;
         console.log(`subImgパス${i}　：　${subImg}`)
         var key = `public/images/upload_img/${subImg}`;
         var uploadParams = {Bucket: bucket_name, Key:key};
         var file = fs.createWriteStream(`public/images/getFromS3_img/${subUri}`);
         var readStream = s3.getObject(uploadParams).createReadStream();
         readStream.pipe(file);
         readStream.on('error',(e)=>{
           file.destroy(e);
         });
         readStream.on('finish',()=>{
            loadingCount+=1;
            console.log(`サブタイトルカウント : ${loadingCount}`)
            if(loadingCount===subLength){
              loadingCountALL+=1;
              console.log("サブタイトルの画像挿入完了です");
              if(loadingCountALL===3){
                console.log(`完了${loadingCountALL}`);
                console.log("全てのサブ：ダウンロードしました");
                setTimeout(()=>{
                return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
                },5000);
              } else {
                console.log(`完了${loadingCountALL}`);
              }
            }
         })
         console.log(`subImgパス${i}　：　アップロード完了です`);
      }//for文終了
    } else {
      loadingCountALL+=1;
      console.log("サブタイトルの画像挿入完了です");
      if(loadingCountALL===3){
        console.log(`完了${loadingCountALL}`);
        console.log("全てのサブ：ダウンロードしました");
        setTimeout(()=>{
        return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
        },5000);
      } else {
        console.log(`完了${loadingCountALL}`);
      }
    }
    });
   };

   function listImgInput(){
     List.findAll({where:{listItemPict:{[Op.not]:""}}}).then((list)=>{
       const listLength = list.length;
       var loadingCount = 0;
       if(listLength!== 0){
       for(var i=0;i<listLength;i++){
        var listItemPict = list[i].listItemPict;
        var imgUri = loadingId + listItemPict;
        console.log(`topImgパス${i}　：　${listItemPict}`)
        var key = `public/images/upload_list_icon/${listItemPict}`;
        var uploadParams = {Bucket: bucket_name, Key:key};
        var file = fs.createWriteStream(`public/images/getFromS3_img/${imgUri}`);
        var readStream = s3.getObject(uploadParams).createReadStream();
        readStream.pipe(file);
        readStream.on('error',(e)=>{
          file.destroy(e);
        });
        readStream.on('finish',()=>{
          loadingCount+=1;
          if(loadingCount===listLength){
            loadingCountALL+=1;
            if(loadingCountALL===3){
              console.log(`完了${loadingCountALL}`);
              console.log("全てのリスト：ダウンロードしました");
              setTimeout(()=>{
                return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
              },5000);
            } else {
              console.log(`完了${loadingCountALL}`);
           }
          }
        });
        console.log(`topImgパス${i}　：　アップロード完了です`);
       }//for文終了
      } else {
            loadingCountALL+=1;
            if(loadingCountALL===3){
              console.log(`完了${loadingCountALL}`);
              console.log("全てのリスト：ダウンロードしました");
              setTimeout(()=>{
                return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
              },5000);
            } else {
               console.log(`完了${loadingCountALL}`);
            }
      }
     });
   }

  //関数の実行
  uploadingTitle();
  subImgInput();
  listImgInput();
  
 });
});

router.get('/test',(req,res,next)=>{
    res.render('account');
})

module.exports = router;
