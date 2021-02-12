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
  //タイトル(公開）のデータ
var sharedTitles;
var sharedTitleLength

//サブタイトル(公開）のデータ
var sharedSubTitles;
var sharedSubTitleLength;

//タイトル(自分）のデータ
var Titles;
var TitlesLength;

//サブタイトル(自分）のデータ
var SubTitles;
var SubTitlesLength;

//ユーザーのID
var userId = req.user.id;
//カウント
var sharedSubTitleCount=0;
var subTitleCount=0;
var loadingCountALL = 0;

  
  //タイトル(公開）の取得
function getSharedTitle(){
  Title.findAll({
    where:{share:"true"}
  }).then((sharedTitle)=>{
     var loadingCount = 0;
     //取得したタイトルの情報を変数に入れる
     sharedTitles = sharedTitle;
     sharedTitleLength = sharedTitle.length;
     if(sharedTitleLength!==0){  //(分岐１)　タイトルがある場合
      for(var i=0;i<sharedTitleLength;i++){
        var sharedTitleId = sharedTitle[i].titleId;
        var topImg = sharedTitles[i].topImg;
        var imgUri = loadingId + topImg;
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
            //subTitle(公開）を取得する関数を実行
            getSharedSubTitle(sharedTitleId);
            if(loadingCount===sharedTitleLength){ //(条件）タイトル(自分)のローディングが全て完了した場合
                 loadingCountALL+=1; //全体のカウント１繰り上げ(A−1)
                 if(loadingCountALL===5){ //(分岐２)　日記(公開、自分)と予定(自分)の写真のローディングが全て完了した場合
                   setTimeout(()=>{
                   return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
                   },5000)
                 } else { //(分岐２)　他のローディングが完了していない場合
                  console.log(`公開日記(タイトル)のローディング完了`);
                 }
              }
        });
        console.log(`topImgパス${i}　：　アップロード完了です`);
      }//for文終了
     } else { //(分岐１)　タイトルがない場合
        loadingCountALL+=2; //全体のカウント１繰り上げ(A−1)
        if(loadingCountALL===5){ //(分岐２)　日記(公開、自分)と予定(自分)の写真のローディングが全て完了した場合
           setTimeout(()=>{
           return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
           },5000)
        } else { //(分岐２)　他のローディングが完了していない場合
          console.log(`公開日記(タイトル・サブタイトル)のローディング完了`);
      　}
     }
  })
}

//subTitle(公開）の取得
function getSharedSubTitle(sharedTitleId){
  subTitle.findAll({
    where:{titleId:sharedTitleId}
  }).then((sub)=>{
    sharedSubTitles = sub;
    sharedSubTitleLength = sub.length;
    var loadingCount = 0;
    if(sharedSubTitleLength!==0){ //(分岐１)　サブタイトルがある場合
       for(var i=0;i<sharedSubTitleLength;i++){
         var subImg = sharedSubTitles[i].pict;
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
           loadingCount+=1; //公開日記のサブ画像のローディング回数をカウント
           if(loadingCount===sharedSubTitleLength) //(条件) 取得したサブ画像のローディングが全て完了したとき
             sharedSubTitleCount+=1; //１つの記事のサブ画像のローディングが完了
             if(sharedSubTitleCount===sharedTitleLength){ //(条件) 全てのサブタイトル(自分)のローディング完了
              loadingCountALL+=1; //全体のカウント１繰り上げ(A−2)
              if(loadingCountALL===5){ //全てのローディングが完了した場合 
                setTimeout(()=>{
                  return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
                  },5000)
              } else {
                  console.log(`公開日記のザブ画像のローディング完了`);
              }
            }
         })
         console.log(`subImgパス${i}　：　アップロード完了です`);
      }//for文終了
   } else { //(分岐１)　サブタイトルがない場合
       sharedSubTitleCount += 1; //１つの記事のサブ画像のローディングが完了
       if(sharedSubTitleCount===sharedTitleLength){ //(条件) 全てのサブタイトル(自分)のローディング完了
        loadingCountALL+=1; //全体のカウント１繰り上げ(A−2)
        if(loadingCountALL===5){ //全てのローディングが完了した場合 
          setTimeout(()=>{
            return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
            },5000)
        } else {
            console.log(`公開日記のサブ画像のローディング完了`);
        }
      }
   }
 })
}

//タイトル(自分）の取得
function getTitle(){
  Title.findAll({
    where:{
      postedBy:userId,
      share:""
    }
  }).then((title)=>{
    var loadingCount = 0;
    //取得したタイトルの情報を変数に入れる
    Titles = title;
    TitlesLength = title.length;
    
    if(TitlesLength!==0){  //(分岐１)　タイトルがある場合
     for(var i=0;i<TitlesLength;i++){
       var TitlesId = Titles[i].titleId;
       var topImg = Titles[i].topImg;
       var imgUri = loadingId + topImg;
       var key = `public/images/upload_diary_topImg/${topImg}`;
       var uploadParams = {Bucket: bucket_name, Key:key};
       var file = fs.createWriteStream(`public/images/getFromS3_img/${imgUri}`);
       var readStream = s3.getObject(uploadParams).createReadStream();
       readStream.pipe(file);
       readStream.on('error',(e)=>{
            file.destroy(e);
       });
       readStream.on('finish',()=>{
         loadingCount+=1; //日記(自分)のトップ画像のローディング回数をカウント
         //subTitle(自分）を取得する関数を実行
            getSubTitle(TitlesId);
              if(loadingCount===TitlesLength){ //(条件) タイトル(自分)のローディングが全て完了した場合
                loadingCountALL+=1; //全体のカウント１繰り上げ(A−3)
                if(loadingCountALL===5){ //(分岐２) 日記(公開、自分)と予定(自分)の写真のローディングが全て完了した場合
                  setTimeout(()=>{
                  return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
                  },5000)
                } else {  //(分岐２) 他のローディングが完了していない場合
                  console.log(`個人の日記のタイトル画像のローディング完了`);
              }
            }
       });
       console.log(`topImgパス${i}　：　アップロード完了です`);
     }//for文終了
    } else {           　//(分岐１)　タイトルがない場合
       loadingCountALL+=2;
       if(loadingCountALL===5){ //(分岐２）全てのローディングが完了していない場合
          setTimeout(()=>{
          return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
          },5000)
       } else {  //(分岐２）他のローディングが完了していない場合
         console.log(`個人の日記(タイトル・サブ）のローディング完了`);
      }
    }
  })
}

//サブタイトル(自分）の取得
function getSubTitle(TitlesId){
  subTitle.findAll({
    where:{
      pict:{[Op.not]:""},
      titleId:TitlesId
    }
  }).then((sub)=>{
    var loadingCount = 0;
     //取得したタイトルの情報を変数に入れる
    SubTitles = sub;
    SubTitlesLength = sub.length;
    if(SubTitlesLength!==0){ //(分岐１) サブタイトルがある場合
      for(var i=0;i<SubTitlesLength;i++){
        var subImg = SubTitles[i].pict;
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
         console.log(`サブタイトルカウント : ${loadingCount}`);
         console.log(`subImgパス${i}　：　アップロード完了です`);
         if(loadingCount===SubTitlesLength){  //(条件) サブタイトル(自分)のローディングが全て完了した場合
            subTitleCount+=1; //１つの記事のサブ画像のローディングが完了
            if(subTitleCount===TitlesLength){ //(条件) 全てのサブタイトル(自分)のローディング完了
              loadingCountALL+=1; //全体のカウント１繰り上げ(A−4)
              if(loadingCountALL===5){ //全てのローディングが完了した場合 
                setTimeout(()=>{
                  return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
                  },5000)
              } else {
                  console.log(`個人の日記のサブ画像のローディング完了`);
              }
            }
         }
       })
      }//for文終了
    } else {  //(分岐１) サブタイトルがない場合
       subTitleCount+=1; //１つの記事のサブ画像のローディングが完了
       if(subTitleCount===TitlesLength){ //(条件) 全てのサブタイトル(自分)のローディング完了
        loadingCountALL+=1; //全体のカウント１繰り上げ(A−4)
        if(loadingCountALL===5){ //全てのローディングが完了した場合 
          setTimeout(()=>{
            return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
            },5000)
        } else {
            console.log(`個人の日記のザブ画像のローディング完了`);
        }
      }
    }
  })
}


function getListImg(){
  List.findAll({
    where:{
        listItemPict:{[Op.not]:""},
        postedBy:userId
    }
  }).then((list)=>{
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
         loadingCountALL+=1; //全体のカウント１繰り上げ(A−5)
         if(loadingCountALL===5){
           console.log(`完了${loadingCountALL}`);
           console.log("全てのリスト：ダウンロードしました");
           setTimeout(()=>{
             return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
           },5000);
         } else {
          console.log(`予定のローディング完了`);
        }
       }
     });
     console.log(`topImgパス${i}　：　アップロード完了です`);
    }//for文終了
   } else {
         loadingCountALL+=1; //全体のカウント１繰り上げ(A−5)
         if(loadingCountALL===5){
           console.log(`完了${loadingCountALL}`);
           console.log("全てのリスト：ダウンロードしました");
           setTimeout(()=>{
             return res.json({state:"全ての画像のダウンロードが完了しました",loadingId:loadingId,encodedLoadingId:encodedLoadingId});
           },5000);
         } else {
            console.log(`完了${loadingCountALL}`);
         }
    }
  })
 }
 //関数の実行(公開日記、個人の日記、個人の予定のローディングは同時に実行する)
 getSharedTitle();
 getTitle();
 getListImg()
});

router.get('/test',(req,res,next)=>{
    res.render('account');
})

module.exports = router;