const subtitleBox1 = data.subtitle1;
      const subtitleBox2 = data.subtitle2;
      const subtitleBox3 = data.subtitle3;
      const subtitle1 = subtitleBox1.split('/n')
      const subtitle2 = subtitleBox2.split('/n')
      const subtitle3 = subtitleBox3.split('/n')
      
      $('.sub-title').text(`サブタイトル：${subtitle1[0]}`)
      $('.sub-impression').text(`感想：${subtitle1[2]}`)
      $('.sub-times').text(`訪問時刻：${subtitle1[1]}`)
      $('.sub-location').text(`場所：${subtitle1[3]}`)
      $('.sub-img').attr('src',`./images/upload_img/${subtitle1[4]}`)
      $('.sub-img').removeClass('hidden-img')
      if(subtitle2[0]){
      $('.sub-title2').text(`サブタイトル：${subtitle2[0]}`)
      $('.sub-impression2').text(`感想：${subtitle2[2]}`)
      $('.sub-times2').text(`訪問時刻：${subtitle2[1]}`)
      $('.sub-location2').text(`場所：${subtitle2[3]}`)
      $('.sub-img2').attr('src',`./images/upload_img/${subtitle2[4]}`)
      $('.sub-img2').removeClass('hidden-img')
      } else {
        $('.sub-title2').text('')
        $('.sub-impression2').text('')
        $('.sub-times2').text('')
        $('.sub-location2').text('')
        $('.sub-img2').addClass('hidden-img')
      }
      if(subtitle3[0]){
      $('.sub-title3').text(`サブタイトル：${subtitle3[0]}`)
      $('.sub-impression3').text(`感想：${subtitle3[2]}`)
      $('.sub-times3').text(`訪問時刻：${subtitle3[1]}`)
      $('.sub-location3').text(`場所：${subtitle3[3]}`)
      $('.sub-img3').attr('src',`./images/upload_img/${subtitle3[4]}`)
      $('.sub-img3').removeClass('hidden-img')
      } else {
        $('.sub-title3').text('')
        $('.sub-impression3').text('')
        $('.sub-times3').text('')
        $('.sub-location3').text('')
        $('.sub-img3').addClass('hidden-img')
      }


      
      const subtitle1 = subs[0].subtitle + '/n' + subs[0].times + '/n' + subs[0].impression + '/n' + subs[0].location + '/n' + subs[0].pict
       const subtitle2 = subs[1].subtitle + '/n' + subs[1].times + '/n' + subs[1].impression + '/n' + subs[1].location + '/n' + subs[1].pict
       const subtitle3 = subs[2].subtitle + '/n' + subs[2].times + '/n' + subs[2].impression + '/n' + subs[2].location + '/n' + subs[2].pict


       h3.sub-title2
  div
    img(src="" width="300" height="220" alt="No Image").sub-img2.hidden-img
   p.sub-impression2
  p.sub-times2
  p.sub-location2
  h3.sub-title3
  div
   img(src="" width="300" height="220" alt="No Image").sub-img3.hidden-img
  p.sub-impression3
  p.sub-times3
  p.sub-location3

  span 訪れた場所 2 : 
          input(type="text", name="subtitle2" value=subTitle2.subtitle) 
          br
          span 訪問時刻 :　　
          input(type="time", name="times2" value=subTitle2.times)
          br
          span 所在地 : 
          input(type="text", name="location2" value=subTitle2.location)
          br
          span 写真 : 
          input(type="file" name="pict2")
          br
          span 感想
          br
          textarea(name="impression2"  rows="6" cols="50") #{subTitle2.impression}
          br
          span 訪れた場所 3 : 
          input(type="text", name="subtitle3" value=subTitle3.subtitle) 
          br
          span 訪問時刻 :　　
          input(type="time", name="times3" value=subTitle3.times)
          br
          span 所在地 : 
          input(type="text", name="location3" value=subTitle3.location)
          br
          span 写真 : 
          input(type="file" name="pict3")
          br
          span 感想
          br
          textarea(name="impression3"  rows="6" cols="50") #{subTitle3.impression}