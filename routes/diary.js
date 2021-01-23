const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs')
const User = require('../models/user');
const Title = require('../models/title');
const subTitle = require('../models/subtitle');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
require('date-utils');

var AWS = require('aws-sdk');
var accessKey = "AKIAJOOIJEHLYZKCQBJA";
var secretKey = "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";
AWS.config.update({
  region: 'us-east-2',
credentials: new AWS.Credentials(accessKey, secretKey)});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

const bucket_name = "my-template-trip-assets";

router.get('/new',authensure,csrfProtection,(req,res,next)=>{
  const baseitems = ['1','2','3','4','5'];
  const additems = ['7','8','9','10','11','12','13','14','15'];
  const joinitems = ['6']
  res.render('new_diary',{
    baseitems:baseitems,
    additems:additems,
    joinitems:joinitems,
    user:req.user,
    csrfToken:req.csrfToken()
  });
})

router.post('/create',authensure,csrfProtection,(req,res,next)=>{
   const titleId = uuid.v4();
   const now = new Date();
   var updateAt = now.toFormat('YYYY  MM/DD  HH24:MI');
   const time = now.toFormat('YYYYMMDDHH24MISS');
   var newIconNameBox = [];
   console.log(req.files);
   if(req.files){
     if(req.files.topImg){
       var top_icon_ext = path.extname(req.files.topImg.name);
       var top_new_iconname = time + req.files.topImg.md5 + top_icon_ext;
       var target_path_top = 'public/images/upload_diary_topImg/' + top_new_iconname;
       fs.writeFileSync(target_path_top,req.files.topImg.data)

       //S3へのアップロード
       var uploadParams = {Bucket: bucket_name, Key: '', Body: ''};
       uploadParams.Body = fs.readFileSync(target_path_top);
       uploadParams.key = target_path_top;
       s3.upload (uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err)
        } if (data) {
          console.log("Upload Success", data.Location)
        }
      });
 
     } else {
       var top_new_iconname = '';
     }
   }
   if(req.files){
   const fileDataBox = [req.files.pict1,req.files.pict2,req.files.pict3,req.files.pict4,req.files.pict5,req.files.pict6,req.files.pict7,req.files.pict8,req.files.pict9,req.files.pict10,req.files.pict11,req.files.pict12,req.files.pict13,req.files.pict14,req.files.pict15];
   for(let i=0; i<15; i++){
     if(fileDataBox[i]){
      var icon_ext = path.extname(fileDataBox[i].name);
      var new_iconname = time + fileDataBox[i].md5 + icon_ext;
      var target_path = 'public/images/upload_img/' + new_iconname;
      fs.writeFileSync(target_path,fileDataBox[i].data)
      newIconNameBox.push(new_iconname)
      console.log(`写真${i+1}が保存されました`);

      //S3への画像のアップロード
      var uploadParams = {Bucket: bucket_name, Key: '', Body: ''};
       uploadParams.Body = fileDataBox[i].data
       uploadParams.key = new_iconname;
       s3.upload (uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err)
        } if (data) {
          console.log("Upload Success", data.Location)
        }
      });

     } else {
      newIconNameBox.push('');
      console.log(`空の写真${i+1}が保存されました`)
     }
    }
  } else {
    for(let i=0; i<15; i++){
    newIconNameBox.push('');
    console.log(`空の写真${i+1}が保存されました`)
    }
  }
    Title.create({
          titleId:titleId,
          titleName:req.body.title.slice(0,24),
          postedBy:req.user.id,
          contributor:req.user.username,
          date:req.body.date.slice(0,12),
          weather:req.body.weather,
          topImg:top_new_iconname,
          share:"",
          updateAt:updateAt,
          insertAt:""
        }).then(()=>{
          console.log(`${req.body.title}が保存されました`)
          let subTtl = ""
          let subTitleBox = [];
          const subtitleNames = [req.body.subtitle1.slice(0,255),req.body.subtitle2.slice(0,255),req.body.subtitle3.slice(0,255),req.body.subtitle4.slice(0,255),req.body.subtitle5.slice(0,255),req.body.subtitle6.slice(0,255),req.body.subtitle7.slice(0,255),req.body.subtitle8.slice(0,255),req.body.subtitle9.slice(0,255),req.body.subtitle10.slice(0,255),req.body.subtitle11.slice(0,255),req.body.subtitle12.slice(0,255),req.body.subtitle13.slice(0,255),req.body.subtitle14.slice(0,255),req.body.subtitle15.slice(0,255)];
          const timesBox = [req.body.times1,req.body.times2,req.body.times3,req.body.times4,req.body.times5,req.body.times6,req.body.times7,req.body.times8,req.body.times9,req.body.times10,req.body.times11,req.body.times12,req.body.times13,req.body.times14,req.body.times15]
          const impressionBox = [req.body.impression1.slice(0,1500),req.body.impression2.slice(0,1500),req.body.impression3.slice(0,1500),req.body.impression4.slice(0,1500),req.body.impression5.slice(0,1500),req.body.impression6.slice(0,1500),req.body.impression7.slice(0,1500),req.body.impression8.slice(0,1500),req.body.impression9.slice(0,1500),req.body.impression10.slice(0,1500),req.body.impression11.slice(0,1500),req.body.impression12.slice(0,1500),req.body.impression13.slice(0,1500),req.body.impression14.slice(0,1500),req.body.impression15.slice(0,1500)];
          const locationBox = [req.body.location1.slice(0,100),req.body.location2.slice(0,100),req.body.location3.slice(0,100),req.body.location4.slice(0,100),req.body.location5.slice(0,100),req.body.location6.slice(0,100),req.body.location7.slice(0,100),req.body.location8.slice(0,100),req.body.location9.slice(0,100),req.body.location10.slice(0,100),req.body.location11.slice(0,100),req.body.location12.slice(0,100),req.body.location13.slice(0,100),req.body.location14.slice(0,100),req.body.location15.slice(0,100)];
          for(var i=0; i<15; i++){
            subTtl = {titleId:titleId,postedBy:req.user.id,subtitle:subtitleNames[i],times:timesBox[i],impression:impressionBox[i],location:locationBox[i],pict:newIconNameBox[i]};
            subTitleBox.push(subTtl)
          }
           subTitleBox.filter((i)=>{return i.subtitle !== ""})
           subTitle.bulkCreate(subTitleBox).then(()=>{
               res.redirect('/users')
         })
       })
     }) 

router.get('/:titleId/edit',authensure,csrfProtection,(req,res,next)=>{
    const titleId = req.params.titleId;
    Title.findById(titleId).then((t)=>{
      if(isMine(req,t)){
      subTitle.findAll({
        where:{titleId:t.titleId},
        order:[['id','ASC']]
      }).then((subs)=>{
        console.log(subs.length + 'である！');
        var subTitleBox = [];
        var subTimesbox = [];
        var subImpressionBox = [];
        var subLocation = [];
        for(let i=0; i<subs.length; i++){
          subTitleBox.push(subs[i].subtitle)
        };
        for(let i=0; i<subs.length; i++){
          subTimesbox.push(subs[i].times)
        };
        for(let i=0; i<subs.length; i++){
          subImpressionBox.push(subs[i].impression)
        };
        for(let i=0; i<subs.length; i++){
          subLocation.push(subs[i].location)
        };
        console.log(subTitleBox)
        res.render('diary_edit',{
          title:t,
          subTitleBox:subTitleBox,
          subTimesbox:subTimesbox,
          subImpressionBox:subImpressionBox,
          subLocation:subLocation,
          user:req.user,
          csrfToken:req.csrfToken()
        })
      })
     } else {
      const err = new Error('編集する権限がありません');
      err.status = 404;
      next(err);
     }
   })
})

router.post('/:titleId/edit',authensure,csrfProtection,(req,res,next)=>{
    const titleId = req.params.titleId;
    Title.findById(titleId).then((title)=>{
    if(isMine(req,title)){
    if(req.query.edit === 'sRN6BiPkt13m3c3QjLWNvNXzVdB3qsJiFKX8ptEAfH') {
      const now = new Date();
      const times = now.toFormat('YYYYMMDDHH24MISS');
      const insertAt = now.toFormat('YYYY  MM/DD  HH24:MI');
      var top_new_iconname = '';
      if(req.files){
        if(req.files.topImg){
          var top_icon_ext = path.extname(req.files.topImg.name);
          top_new_iconname = times + req.files.topImg.md5 + top_icon_ext;
          var target_path_top = 'public/images/upload_diary_topImg/' + top_new_iconname;
          fs.writeFileSync(target_path_top,req.files.topImg.data);

          //S3への画像のアップロード
          var uploadParams = {Bucket: bucket_name, Key: '', Body: ''};
          uploadParams.Body = req.files.topImg.data
          uploadParams.key = top_new_iconname;
          s3.upload (uploadParams, function (err, data) {
           if (err) {
             console.log("Error", err)
           } if (data) {
           console.log("Upload Success", data.Location)
          }
         });

        } else {
          top_new_iconname = title.topImg;
        }
      } else {
        top_new_iconname = title.topImg;
      }
      Title.upsert({
        titleId:title.titleId,
        titleName:req.body.title.slice(0,24),
        postedBy:title.postedBy,
        contributor:title.contributor,
        date:req.body.date.slice(0,12),
        weather:req.body.weather,
        topImg:top_new_iconname,
        share:req.body.share,
        updateAt:title.updateAt,
        insertAt:insertAt
      }).then(()=>{
        subTitle.findAll({
          where:{titleId:title.titleId}
        }).then((subs)=>{
          const lastPictBox = [subs[0].pict,subs[1].pict,subs[2].pict,subs[3].pict,subs[4].pict,subs[5].pict,subs[6].pict,subs[7].pict,subs[8].pict,subs[9].pict,subs[10].pict,subs[11].pict,subs[12].pict,subs[13].pict,subs[14].pict];
          console.log(lastPictBox);
          const promises = subs.map((a) => { return a.destroy(); });
          Promise.all(promises).then(()=>{
            const time = now.toFormat('YYYYMMDDHH24MISS');
            var fileDataBox = "";
            if(req.files){
            fileDataBox = [req.files.pict1 || '',req.files.pict2 || '',req.files.pict3 || '',req.files.pict4 || '',req.files.pict5 || '',req.files.pict6 || '',req.files.pict7 || '',req.files.pict8 || '',req.files.pict9 || '',req.files.pict10 || '',req.files.pict11 || '',req.files.pict12 || '',req.files.pict13 || '',req.files.pict14 || '',req.files.pict15 || ''];
            } else {
            fileDataBox = [];
            for(let i=0;i<15;i++){
              fileDataBox.push('');
            }
            }
            var pictBox = [];
          for(let i=0; i<15; i++) {
            if(fileDataBox[i]){
              const icon_ext = path.extname(fileDataBox[i].name);
              const new_iconname = time + fileDataBox[i].md5 + icon_ext;
              const target_path = 'public/images/upload_img/' + new_iconname;
              pictBox.push(new_iconname);
              fs.writeFileSync(target_path,fileDataBox[i].data);
              console.log('新しく写真を入れました');

              //S3への画像のアップロード
             var uploadParams = {Bucket: bucket_name, Key: '', Body: ''};
             uploadParams.Body = fileDataBox[i].data
             uploadParams.key = new_iconname;
             s3.upload (uploadParams, function (err, data) {
             if (err) {
               console.log("Error", err)
             } if (data) {
               console.log("Upload Success", data.Location)
             }
            });

            } else {
              pictBox.push(lastPictBox[i]);
              console.log('前回の写真を挿入しました');
            }
          }
          const subtitleNames = [req.body.subtitle1.slice(0,255),req.body.subtitle2.slice(0,255),req.body.subtitle3.slice(0,255),req.body.subtitle4.slice(0,255),req.body.subtitle5.slice(0,255),req.body.subtitle6.slice(0,255),req.body.subtitle7.slice(0,255),req.body.subtitle8.slice(0,255),req.body.subtitle9.slice(0,255),req.body.subtitle10.slice(0,255),req.body.subtitle11.slice(0,255),req.body.subtitle12.slice(0,255),req.body.subtitle13.slice(0,255),req.body.subtitle14.slice(0,255),req.body.subtitle15.slice(0,255)];
          const timesBox = [req.body.times1,req.body.times2,req.body.times3,req.body.times4,req.body.times5,req.body.times6,req.body.times7,req.body.times8,req.body.times9,req.body.times10,req.body.times11,req.body.times12,req.body.times13,req.body.times14,req.body.times15]
          const impressionBox = [req.body.impression1.slice(0,1500),req.body.impression2.slice(0,1500),req.body.impression3.slice(0,1500),req.body.impression4.slice(0,1500),req.body.impression5.slice(0,1500),req.body.impression6.slice(0,1500),req.body.impression7.slice(0,1500),req.body.impression8.slice(0,1500),req.body.impression9.slice(0,1500),req.body.impression10.slice(0,1500),req.body.impression11.slice(0,1500),req.body.impression12.slice(0,1500),req.body.impression13.slice(0,1500),req.body.impression14.slice(0,1500),req.body.impression15.slice(0,1500)];
          const locationBox = [req.body.location1.slice(0,100),req.body.location2.slice(0,100),req.body.location3.slice(0,100),req.body.location4.slice(0,100),req.body.location5.slice(0,100),req.body.location6.slice(0,100),req.body.location7.slice(0,100),req.body.location8.slice(0,100),req.body.location9.slice(0,100),req.body.location10.slice(0,100),req.body.location11.slice(0,100),req.body.location12.slice(0,100),req.body.location13.slice(0,100),req.body.location14.slice(0,100),req.body.location15.slice(0,100)];
          var subTtl = '';
          var subTitleDataBox = [];
          for(let i=0; i<15; i++){
            subTtl = {titleId:titleId,postedBy:req.user.id,subtitle:subtitleNames[i],times:timesBox[i],pict:pictBox[i],impression:impressionBox[i],location:locationBox[i]};
            subTitleDataBox.push(subTtl);
          }
            subTitleDataBox.filter((i)=>{return i.subtitle !== ""})
            subTitle.bulkCreate(subTitleDataBox).then(()=>{
              res.redirect('/users')
            })
          })
        })
      })
    } else {
      const err = new Error('不正なリクエストです');
      err.status = 400;
      next(err);
    }
    } else {
      const err = new Error('編集する権限がありません');
      err.status = 404;
      next(err);
    }
  })
})

router.get('/:titleId/delete',authensure,(req,res,next)=>{
    const titleId = req.params.titleId;
    Title.findById(titleId).then((title)=>{
      if(isMine(req,title)){
      if(req.query.delete === 'J8bRiFW7tUqgcHNraAgTkP8116KYuMxLIP9VRlRtpu'){
        subTitle.findAll({
          where:{titleId:title.titleId}
        }).then((subs)=>{
          const promises = subs.map((s)=>{return s.destroy()});
          Promise.all(promises).then(()=>{
            title.destroy().then(()=>{
              res.redirect('/users')
            })
          })
        })
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
      } else {
        const err = new Error('この投稿を削除する権限がありません');
        err.status = 404;
        next(err);
      }
    })
})

function isMine(req,t){
  return t && t.postedBy === parseInt(req.user.id)
}

module.exports = router;