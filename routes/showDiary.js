'use strict';
const express = require('express');
const router = express.Router();
const authensure = require('./authensure');
const Title = require('../models/title');
const subTitle = require('../models/subtitle')

router.post('/:titleId/alter/d',authensure,(req,res,next)=>{
   const titleId = req.body.data;
   Title.findById(titleId).then((title)=>{
     subTitle.findAll({
       where:{titleId:titleId},
       order:[['id','ASC']]
     }).then((subs)=>{
       console.log(subs[0])
       console.log(subs[0].id)
       console.log(subs[0].subtitle)
       console.log(subs[0].subtitle + '/n')
       const titleName = title.titleName;
       const titleDate = title.date;
       const titleWeather = title.weather;
       const contributor = title.contributor;
       const topImg = title.topImg;
       const updateAt = title.updateAt;
       const insertAt = title.insertAt || '';
       const subTitleLine = subs[0].subtitle + '/n' + subs[1].subtitle + '/n' + subs[2].subtitle + '/n' + subs[3].subtitle + '/n' + subs[4].subtitle + '/n' + subs[5].subtitle + '/n' + subs[6].subtitle + '/n' + subs[7].subtitle + '/n' + subs[8].subtitle + '/n' + subs[9].subtitle + '/n' + subs[10].subtitle + '/n' + subs[11].subtitle + '/n' + subs[12].subtitle + '/n' + subs[13].subtitle + '/n' + subs[14].subtitle;
       const subTimesLine = subs[0].times + '/n' + subs[1].times + '/n' + subs[2].times + '/n' + subs[3].times + '/n' + subs[4].times + '/n' + subs[5].times + '/n' + subs[6].times + '/n' + subs[7].times + '/n' + subs[8].times + '/n' + subs[9].times + '/n' + subs[10].times + '/n' + subs[11].times + '/n' + subs[12].times + '/n' + subs[13].times + '/n' + subs[14].times;
       const subImpressionLine = subs[0].impression + '/n' + subs[1].impression + '/n' + subs[2].impression + '/n' + subs[3].impression + '/n' + subs[4].impression + '/n' + subs[5].impression + '/n' + subs[6].impression + '/n' + subs[7].impression + '/n' + subs[8].impression + '/n' + subs[9].impression + '/n' + subs[10].impression + '/n' + subs[11].impression + '/n' + subs[12].impression + '/n' + subs[13].impression + '/n' + subs[14].impression;
       const subLocationLine = subs[0].location + '/n' + subs[1].location + '/n' + subs[2].location + '/n' + subs[3].location + '/n' + subs[4].location + '/n' + subs[5].location + '/n' + subs[6].location + '/n' + subs[7].location + '/n' + subs[8].location + '/n' + subs[9].location + '/n' + subs[10].location + '/n' + subs[11].location + '/n' + subs[12].location + '/n' + subs[13].location + '/n' + subs[14].location;
       const subPictLine = subs[0].pict + '/n' + subs[1].pict + '/n' + subs[2].pict + '/n' + subs[3].pict + '/n' + subs[4].pict + '/n' + subs[5].pict + '/n' + subs[6].pict + '/n' + subs[7].pict + '/n' + subs[8].pict + '/n' + subs[9].pict + '/n' + subs[10].pict + '/n' + subs[11].pict + '/n' + subs[12].pict + '/n' + subs[13].pict + '/n' + subs[14].pict;
       res.json({state:'OK',titleName:titleName,titleDate:titleDate,titleWeather:titleWeather,contributor:contributor,topImg:topImg,updateAt:updateAt,insertAt:insertAt,subTitleLine:subTitleLine,subTimesLine:subTimesLine,subImpressionLine:subImpressionLine,subLocationLine:subLocationLine,subPictLine:subPictLine})
     })
   })
})

module.exports = router;