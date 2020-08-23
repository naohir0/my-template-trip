  if(req.files.pict1){
  var icon_ext1 = path.extname(req.files.pict1.name);
  var new_iconname1 = time + req.files.pict1.md5 + icon_ext1;
  var target_path1 = 'public/images/upload_img/' + new_iconname1;
  fs.writeFileSync(target_path1,req.files.pict1.data)
  } else {
  var new_iconname1 = "";
  }

  if(req.files.pict2){
  var icon_ext2 = path.extname(req.files.pict2.name);
  var new_iconname2 = time + req.files.pict2.md5 + icon_ext2;
  var target_path2 = 'public/images/upload_img/' + new_iconname2;
  fs.writeFileSync(target_path2,req.files.pict2.data);
  } else {
   var new_iconname2 = "";
  }

  if(req.files.pict3){
    var icon_ext3 = path.extname(req.files.pict3.name);
    var new_iconname3 = time + req.files.pict3.md5 + icon_ext3;
    var target_path3 = 'public/images/upload_img/' + new_iconname3;
    fs.writeFileSync(target_path3,req.files.pict3.data)
    } else {
     var new_iconname3 = "";
    }
 
    if(req.files.pict4){
     var icon_ext4 = path.extname(req.files.pict4.name);
     var new_iconname4 = time + req.files.pict4.md5 + icon_ext4;
     var target_path4 = 'public/images/upload_img/' + new_iconname4;
     fs.writeFileSync(target_path4,req.files.pict4.data)
     } else {
      var new_iconname4 = "";
     }
 
     if(req.files.pict5){
       var icon_ext5 = path.extname(req.files.pict5.name);
       var new_iconname5 = time + req.files.pict5.md5 + icon_ext5;
       var target_path5 = 'public/images/upload_img/' + new_iconname5;
       fs.writeFileSync(target_path5,req.files.pict5.data)
       } else {
        var new_iconname5 = "";
       }


    if(req.files.pict6){
      var icon_ext6 = path.extname(req.files.pict6.name);
      var new_iconname6 = time + req.files.pict6.md5 + icon_ext6;
      var target_path6 = 'public/images/upload_img/' + new_iconname6;
      fs.writeFileSync(target_path6,req.files.pict6.data)
      } else {
      var new_iconname6 = "";
      }

      if(req.files.pict7){
       var icon_ext7 = path.extname(req.files.pict7.name);
       var new_iconname7 = time + req.files.pict7.md5 + icon_ext7;
       var target_path7 = 'public/images/upload_img/' + new_iconname7;
       fs.writeFileSync(target_path7,req.files.pict7.data)
       } else {
        var new_iconname7 = "";
       }

       if(req.files.pict8){
         var icon_ext8 = path.extname(req.files.pict8.name);
         var new_iconname8 = time + req.files.pict8.md5 + icon_ext8;
         var target_path8 = 'public/images/upload_img/' + new_iconname8;
         fs.writeFileSync(target_path8,req.files.pict8.data)
         } else {
         var new_iconname8 = "";
         }

         if(req.files.pict9){
           var icon_ext9 = path.extname(req.files.pict9.name);
           var new_iconname9 = time + req.files.pict9.md5 + icon_ext9;
           var target_path9 = 'public/images/upload_img/' + new_iconname9;
           fs.writeFileSync(target_path9,req.files.pict9.data)
           } else {
           var new_iconname9 = "";
           }

           if(req.files.pict10){
             var icon_ext10 = path.extname(req.files.pict10.name);
             var new_iconname10 = time + req.files.pict10.md5 + icon_ext10;
             var target_path10 = 'public/images/upload_img/' + new_iconname10;
             fs.writeFileSync(target_path10,req.files.pict10.data)
             } else {
             var new_iconname10 = "";
             }

             if(req.files.pict11){
               var icon_ext11 = path.extname(req.files.pict11.name);
               var new_iconname11 = time + req.files.pict11.md5 + icon_ext11;
               var target_path11 = 'public/images/upload_img/' + new_iconname11;
               fs.writeFileSync(target_path11,req.files.pict11.data)
               } else {
               var new_iconname11 = "";
               }

               if(req.files.pict12){
                 var icon_ext12 = path.extname(req.files.pict12.name);
                 var new_iconname12 = time + req.files.pict12.md5 + icon_ext12;
                 var target_path12 = 'public/images/upload_img/' + new_iconname12;
                 fs.writeFileSync(target_path12,req.files.pict12.data)
                 } else {
                 var new_iconname12 = "";
                 }
                 if(req.files.pict13){
                   var icon_ext13 = path.extname(req.files.pict13.name);
                   var new_iconname13 = time + req.files.pict13.md5 + icon_ext13;
                   var target_path13 = 'public/images/upload_img/' + new_iconname13;
                   fs.writeFileSync(target_path13,req.files.pict13.data)
                   } else {
                   var new_iconname13 = "";
                   }
                   if(req.files.pict14){
                     var icon_ext14 = path.extname(req.files.pict14.name);
                     var new_iconname14 = time + req.files.pict14.md5 + icon_ext14;
                     var target_path14 = 'public/images/upload_img/' + new_iconname14;
                     fs.writeFileSync(target_path14,req.files.pict14.data)
                     } else {
                     var new_iconname14 = "";
                     }
                     if(req.files.pict15){
                       var icon_ext15 = path.extname(req.files.pict15.name);
                       var new_iconname15 = time + req.files.pict15.md5 + icon_ext15;
                       var target_path15 = 'public/images/upload_img/' + new_iconname15;
                       fs.writeFileSync(target_path15,req.files.pict15.data)
                       } else {
                       var new_iconname15 = "";
                       }

       Title.create({
        titleId:titleId,
        titleName:req.body.title.slice(0,255),
        postedBy:req.user.id,
        date:req.body.date.slice(0,30),
        weather:req.body.weather,
        share:"false",
        updateAt:now
      }).then(()=>{
        console.log(`${req.body.title}が保存されました`)
        const subTtl1 = {titleId:titleId,postedBy:req.user.id,subtitle:req.body.subtitle1.slice(0,255),times:req.body.times1,pict:req.body.pict1,impression:req.body.impression1.slice(0,1500),location:req.body.location1.slice(0,100),pict:new_iconname1};
        const subTtl2 = {titleId:titleId,postedBy:req.user.id,subtitle:req.body.subtitle2.slice(0,255),times:req.body.times2,pict:req.body.pict2,impression:req.body.impression2.slice(0,1500),location:req.body.location2.slice(0,100),pict:new_iconname2};
        const subTtl3 = {titleId:titleId,postedBy:req.user.id,subtitle:req.body.subtitle3.slice(0,255),times:req.body.times3,pict:req.body.pict3,impression:req.body.impression3.slice(0,1500),location:req.body.location3.slice(0,100),pict:new_iconname3};
        var subTitleBox = [];
         subTitleBox.push(subTtl1);
         subTitleBox.push(subTtl2);
         subTitleBox.push(subTtl3);
         subTitleBox.filter((i)=>{return i.subtitle !== ""})
         subTitle.bulkCreate(subTitleBox).then(()=>{
             res.redirect('/users')
       })
     })
   })
   