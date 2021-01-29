const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});

require('date-utils');

const User = require('../models/user');
const List = require('../models/list');
const listComment = require('../models/comment');

var AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');
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

router.get('/',authensure,(req,res,next)=>{
    const id = req.query.id;
    List.findAll({
      where:{postedBy:req.user.id},
      order:[['"updateAt"','DESC']]
    }).then((lists)=>{
      const list_length = lists.length;
      const doneList = lists.filter((c)=>{return c.done !== ''});
      const doneList_length = doneList.length;
      const topImg = lists.listItemPict || '20200817185154e4d4a02c797acec493981c9e0632d907.jpg'
      res.render('list',{
        lists:lists,
        user:req.user,
        length:list_length,
        doneListLength:doneList_length,
        id:id
      })
    })
});

router.get('/new',authensure,csrfProtection,(req,res,next)=>{
    const id = req.query.id;
    const listComments = [1,2,3,4,5,6,7,8,9,10];
    res.render('new_list',{
      listComments:listComments,
      user:req.user,
      csrfToken:req.csrfToken(),
      id:id
    })
})

router.post('/create',authensure,csrfProtection,(req,res,next)=>{
    const id = req.query.id;
    const listItemId = uuid.v4();
    const now = new Date();
    const updateAt = now.toFormat('YYYY  MM/DD  HH24:MI');
    const time = now.toFormat('YYYYMMDDHH24MISS');
    let new_iconname = '';
    if(req.files){
     const icon_ext = path.extname(req.files.listPict.name);
     new_iconname = time + req.files.listPict.md5 + icon_ext;
     const target_path = 'public/images/upload_list_icon/' + new_iconname;
     fs.writeFileSync(target_path,req.files.listPict.data);

     //S3への画像のアップロード
     var uploadFile = fs.readFileSync(target_path);
     var key = target_path;
     var uploadParams = {Bucket: bucket_name, Key:key, Body:uploadFile};
     s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err)
        listCreate();
      } if (data) {
        console.log(`File uploaded successfully. ${data.Location}`);
        listCreate();
      }
    });
    } else {
      new_iconname = '';
      listCreate();
    }
    
    function listCreate(){
    List.create({
      listItemId:listItemId,
      postedBy:req.user.id,
      listItemName:req.body.listName.slice(0,20),
      listItemPlace:req.body.listPlace,
      listItemPict:new_iconname,
      done:'',
      updateAt:updateAt,
      insertAt:''
    }).then(()=>{
      let listCommentItem = '';
      let listCommentItemBox = []
      const listCommentTitleBox = [req.body.listCommentTitle1.slice(0,200),req.body.listCommentTitle2.slice(0,200),req.body.listCommentTitle3.slice(0,200),req.body.listCommentTitle4.slice(0,200),req.body.listCommentTitle5.slice(0,200),req.body.listCommentTitle6.slice(0,200),req.body.listCommentTitle7.slice(0,200),req.body.listCommentTitle8.slice(0,200),req.body.listCommentTitle9.slice(0,200),req.body.listCommentTitle10.slice(0,200)];
      const listCommentContBox = [req.body.listCommentCont1.slice(0,1000),req.body.listCommentCont2.slice(0,1000),req.body.listCommentCont3.slice(0,1000),req.body.listCommentCont4.slice(0,1000),req.body.listCommentCont5.slice(0,1000),req.body.listCommentCont6.slice(0,1000),req.body.listCommentCont7.slice(0,1000),req.body.listCommentCont8.slice(0,1000),req.body.listCommentCont9.slice(0,1000),req.body.listCommentCont10.slice(0,1000)];
      for(let i=0; i<10; i++){
        if(listCommentTitleBox[i]){
         listCommentItem = {listItemId:listItemId,postedBy:req.user.id,listCommentTitle:listCommentTitleBox[i],listCommentCont:listCommentContBox[i]};
         listCommentItemBox.push(listCommentItem)
        }
      }
      listCommentItemBox.filter((t)=>{return t !== ''});
      listComment.bulkCreate(listCommentItemBox).then(()=>{
        res.redirect(`/listCreating/?id=${id}&updateAt=${updateAt}`);
      })
    })
   }
})

router.get('/:listId/edit',authensure,csrfProtection,(req,res,next)=>{
    const id = req.query.id;
    const listId = req.params.listId;
    console.log("パラメーター" + listId);
    List.findById(listId).then((list)=>{
      if(isMine(req,list)){
        listComment.findAll({
          where:{listItemId:listId},
          order:[['"listCommentId"','ASC']]
        }).then((listComments)=>{
          let listCommentTitleBox = [];
          let listCommentContBox = [];
          for(let i=0; i<10; i++){
            if(listComments[i]){
              listCommentTitleBox.push(listComments[i].listCommentTitle);
              listCommentContBox.push(listComments[i].listCommentCont);
            } else {
              listCommentTitleBox.push('');
              listCommentContBox.push('');
            }
          }
          res.render('list_edit',{
            listTitle:list,
            listCommentTitle:listCommentTitleBox,
            listCommentCont:listCommentContBox,
            user:req.user,
            csrfToken:req.csrfToken(),
            id:id
          })
        })
      } else {
        const err = new Error('編集する権限がありません')
        err.status = 404;
        next(err);
      }
    })
});

router.post('/:listId/edit',authensure,csrfProtection,(req,res,next)=>{
   const listId = req.params.listId;
   const id = req.query.id;
   var upLoadedImg = '';
   List.findById(listId).then((list)=>{
     if(isMine(req,list)){
      if(req.query.edit==='QxAmQjYmlY2Lza1bbbr2SQAJxY7w9VnjJaVmTxwzfd'){
       const now = new Date();
       const insertAt = now.toFormat('YYYY  MM/DD  HH24:MI');
       const time = now.toFormat('YYYYMMDDHH24MISS');
       console.log('完了 : ' + req.body.done);
       let new_iconname = '';
       if(req.files){
       upLoadedImg = 'Editing' //Editing ：新しい写真の追加あり
       const icon_ext = path.extname(req.files.listPict.name);
       new_iconname = time + req.files.listPict.md5 + icon_ext;
       const target_path = 'public/images/upload_list_icon/' + new_iconname;
       fs.writeFileSync(target_path,req.files.listPict.data);
       //S3への画像のアップロード
       var uploadFile = fs.readFileSync(target_path);
       var key = target_path;
       var uploadParams = {Bucket: bucket_name, Key:key, Body:uploadFile};
       s3.upload (uploadParams, function (err, data) {
       if (err) {
          console.log("Error", err)
          listUpsert();
       } if (data) {
          console.log(`File uploaded successfully. ${data.Location}`);
          listUpsert();
       }
      });
       } else {  
       new_iconname = list.listItemPict
       listUpsert();
       }

       function listUpsert(){
       List.upsert({
        listItemId:listId,
        postedBy:req.user.id,
        listItemName:req.body.listName.slice(0,18),
        listItemPlace:req.body.listPlace,
        listItemPict:new_iconname,
        done:req.body.done,
        updateAt:list.updateAt,
        insertAt:insertAt
       }).then(()=>{
         listComment.findAll({
           where:{listItemId:listId}
         }).then((listComments)=>{
           const promises = listComments.map((c)=>{return c.destroy()});
           Promise.all(promises).then(()=>{
            let listCommentItemBox = [];
            let listCommentItem = '';
            const listCommentTitleBox = [req.body.listCommentTitle1.slice(0,200),req.body.listCommentTitle2.slice(0,200),req.body.listCommentTitle3.slice(0,200),req.body.listCommentTitle4.slice(0,200),req.body.listCommentTitle5.slice(0,200),req.body.listCommentTitle6.slice(0,200),req.body.listCommentTitle7.slice(0,200),req.body.listCommentTitle8.slice(0,200),req.body.listCommentTitle9.slice(0,200),req.body.listCommentTitle10.slice(0,200)];
            const listCommentContBox = [req.body.listCommentCont1.slice(0,1000),req.body.listCommentCont2.slice(0,1000),req.body.listCommentCont3.slice(0,1000),req.body.listCommentCont4.slice(0,1000),req.body.listCommentCont5.slice(0,1000),req.body.listCommentCont6.slice(0,1000),req.body.listCommentCont7.slice(0,1000),req.body.listCommentCont8.slice(0,1000),req.body.listCommentCont9.slice(0,1000),req.body.listCommentCont10.slice(0,1000)];
            for(let i=0; i<10; i++){
              if(listCommentTitleBox[i]){
               listCommentItem = {listItemId:listId,postedBy:req.user.id,listCommentTitle:listCommentTitleBox[i],listCommentCont:listCommentContBox[i]};
               listCommentItemBox.push(listCommentItem)
              }
            } 
            listCommentItemBox.filter((t)=>{return t !== ''});
            listComment.bulkCreate(listCommentItemBox).then(()=>{
                 res.redirect(`/list${upLoadedImg}/?id=${id}&insertAt=${insertAt}`);
            })
           })
         })
       })
      } //関数終了
      } else {
        const err = new Error('不正なリクエストです')
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

router.get('/:listItemId/delete',authensure,(req,res,next)=>{
   const id = req.query.id;
   const listItemId = req.params.listItemId;
   List.findById(listItemId).then((list)=>{
     if(isMine(req,list)){
      if(req.query.delete==='pGn4DvVbnoZ51MivajgyyaivO1mmGElpCc0k6dvEqn'){
       listComment.findAll({
         where:{listItemId:list.listItemId}
       }).then((listComments)=>{
         const promises = listComments.map((c)=>{return c.destroy()});
         Promise.all(promises).then(()=>{
          list.destroy().then(()=>{
            res.redirect(`/list/?id=${id}`);
          })
         })
       })
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
     } else {
      const err = new Error('削除する権限がありません');
      err.status = 404;
      next(err);
     }
   })
})

function isMine(req,list){
  return list && parseInt(req.user.id) === list.postedBy
}
module.exports = router;