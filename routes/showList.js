'use strict';
const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const List = require('../models/list');
const listComment = require('../models/comment');


router.post('/:listId/alter/d',authensure,(req,res,next)=>{
 const listId = req.body.data;
 List.findById(listId).then((list)=>{
  listComment.findAll({
    where:{listItemId:listId},
    order:[['"listCommentId"','ASC']]
  }).then((listComs)=>{
    const listItemName = list.listItemName;
    const listItemPlace = list.listItemPlace;
    const listItemPict = list.listItemPict;
    const updateAt = list.updateAt;
    const insertAt = list.insertAt;
    let listCommentTitle = '';
    let listCommentCont = '';
    for(let i=0; i<listComs.length-1; i++){
      listCommentTitle += listComs[i].listCommentTitle;
      listCommentTitle += '/n'
      listCommentCont += listComs[i].listCommentCont;
      listCommentCont += '/n'
    }
    listCommentTitle += listComs[listComs.length-1].listCommentTitle;
    listCommentCont += listComs[listComs.length-1].listCommentCont;
    console.log('リストコンテンツ : '+listComs[0].listCommentTitle);
    res.json({status:'OK',listItemName:listItemName,listItemPlace:listItemPlace,listItemPict:listItemPict,updateAt:updateAt,insertAt:insertAt,listCommentTitle:listCommentTitle,listCommentCont:listCommentCont});
  })
 })
})

module.exports = router;