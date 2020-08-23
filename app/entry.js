'use strict';
import $ from 'jquery';

$('.diary_alter').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    const titleId = button.data('title-id');
    $.post(`/title/${titleId}/alter/d`,{
      data:titleId
    }, (data)=>{
      const titleName = data.titleName;
      const titleDate = data.titleDate;
      const titleWeather = data.titleWeather;
      const updateAt = data.updateAt;
      const insertAt = data.insertAt;
      const subTitleBox = data.subTitleLine.split('/n');
      const subTimesBox = data.subTimesLine.split('/n');
      const subImpressionBox = data.subImpressionLine.split('/n');
      const subLocationBox = data.subLocationLine.split('/n');
      const subPictBox = data.subPictLine.split('/n');
      if(titleName){
        $('.diary-title').text(`${titleName}`)
        $('.diary-updateAt').text(`日記作成日🕐：${updateAt}`)
        $('.diary-insertAt').text(`日記更新日🕜：${insertAt}`)
        $('.diary-date').text(`旅行日🕞：${titleDate}`)
        $('.diary-weather').text(`天気：${titleWeather}`)
        $('.bl_listDisplay').removeClass('hidden_display')
        $('.bl_listDisplay_img__diary').removeClass('hidden_display')
      } else {
        $('.bl_listDisplay').addClass('hidden_display')
        $('.bl_listDisplay_img__diary').addClass('hidden_display')
      }
      
      for(let i=0; i<subTitleBox.length;i++){
       if(subTitleBox[i]){
         $(`.sub-title${i+1}`).text(`${subTitleBox[i]}`)
         $(`.sub-impression${i+1}`).text(`${subImpressionBox[i]}`)
         $(`.sub-times${i+1}`).text(`訪問時刻：${subTimesBox[i]}`)
         $(`.sub-location${i+1}`).text(`場所：${subLocationBox[i]}`)
         $(`.sub-img${i+1}`).attr('src',`./images/upload_img/${subPictBox[i]}`)
         $(`.sub-img${i+1}`).removeClass('hidden-img')
         $(`.sub-title${i+1}`).removeClass('hidden_display')
         $(`.sub-impression${i+1}`).removeClass('hidden_display')
         $(`.sub-times${i+1}`).removeClass('hidden_display')
         $(`.sub-location${i+1}`).removeClass('hidden_display')
       } else {
         $(`.sub-title${i+1}`).text("")
         $(`.sub-impression${i+1}`).text("")
         $(`.sub-times${i+1}`).text("")
         $(`.sub-location${i+1}`).text("")
         $(`.sub-img${i+1}`).attr('src','')
         $(`.sub-img${i+1}`).addClass('hidden-img')
         $(`.sub-title${i+1}`).addClass('hidden_display')
         $(`.sub-impression${i+1}`).addClass('hidden_display')
         $(`.sub-times${i+1}`).addClass('hidden_display')
         $(`.sub-location${i+1}`).addClass('hidden_display')
       }
      }
    })
  })
})

$('.del-diaryItem-temp').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    button.next().filter('.confirm-cont').removeClass('confirm-del-hidden')
  })
})
$('.cancel-del-diaryItem').click(()=>{
  $('.confirm-cont').addClass('confirm-del-hidden')
})

$('.add-making-diarysubItem').each((i,e)=>{
    const button = $(e);
    button.click(()=>{
      button.next().next().removeClass('hide-making-diarysubItem');
      button.next().next().next().removeClass('hide-making-diarysubItem');
      button.addClass('hide-add-making-diarysubItem');
      button.next().removeClass('hide-remove-making-diarysubItem');
    })
})

$('.remove-making-diarysubItem').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    button.next().addClass('hide-making-diarysubItem');
    button.next().next().addClass('hide-making-diarysubItem');
    button.prev().removeClass('hide-add-making-diarysubItem');
    button.addClass('hide-remove-making-diarysubItem');
  })
})

$('.list_alter').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    const listId = button.data('list-id');
    $.post(`/list/${listId}/alter/d`,{
      data:listId
    },(data)=>{
      const listItemName = data.listItemName;
      const listItemPlace = data.listItemPlace;
      const listItemPict = data.listItemPict;
      const updateAt = data.updateAt;
      const insertAt = data.insertAt;
      const listCommentTitleBox= data.listCommentTitle.split('/n');
      const listCommentContBox = data.listCommentCont.split('/n');
      const listComment_length = listCommentTitleBox.length;
      if(listItemName){
        $('.bl_listDisplay').removeClass('hidden_display');
        $('.list-name').text(listItemName);
        $('.list-updateAt').text(`予定作成日：${updateAt}`);
        $('.list-insertAt').text(`予定更新日：${insertAt}`);
        $('.list-place').text(`所在地：${listItemPlace}`);
        $('.list-pict').attr('src',`./images/upload_list_icon/${listItemPict}`);
        $('.list-comment-title0').text(`やりたいことその1 : ${listCommentTitleBox[0]}`)
      } else {
        $('.bl_listDisplay').addClass('hidden_display');
      }
      if(listItemPict){
        $('.list-pict').removeClass('hidden-img');
      } else {
        $('.list-pict').addClass('hidden-img');
      }
      for(let i=0; i<10;i++){
        if(listCommentTitleBox[i]){
          $(`.list-comment-title${i+1}`).text(`やりたいこと${i+1}：${listCommentTitleBox[i]}`)
          $(`.list-comment-cont${i+1}`).text(`詳細：${listCommentContBox[i]}`)
          $(`.list-comment-title${i+1}`).removeClass('hidden_display')
          $(`.list-comment-cont${i+1}`).removeClass('hidden_display')
        } else {
          $(`.list-comment-title${i+1}`).text('')
          $(`.list-comment-cont${i+1}`).text('')
          $(`.list-comment-title${i+1}`).addClass('hidden_display')
          $(`.list-comment-cont${i+1}`).addClass('hidden_display')
        }
       }
    })
  })
});

$('.del-listItem-temp').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    button.next().removeClass('confirm-del-list-hidden');
  })
});
$('.cancel-del-listItem').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    $('.confirm-del-list').addClass('confirm-del-list-hidden')
  })
});

$('.shared_diary_alter').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    const titleId = button.data('title-id');
    $.post(`/title/${titleId}/alter/d`,{
      data:titleId
    }, (data)=>{
      const titleName = data.titleName;
      const titleDate = data.titleDate;
      const titleWeather = data.titleWeather;
      const updateAt = data.updateAt;
      const insertAt = data.insertAt;
      const subTitleBox = data.subTitleLine.split('/n');
      const subTimesBox = data.subTimesLine.split('/n');
      const subImpressionBox = data.subImpressionLine.split('/n');
      const subLocationBox = data.subLocationLine.split('/n');
      const subPictBox = data.subPictLine.split('/n');

      $('.shared-diary-title').text(`タイトル：${titleName}`)
      $('.shared-diary-updateAt').text(`日記作成日：${updateAt}`)
      $('.shared-diary-insertAt').text(`日記更新日：${insertAt}`)
      $('.shared-diary-date').text(`旅行日：${titleDate}`)
      $('.shared-diary-weather').text(`天気：${titleWeather}`)
      
      for(let i=0; i<subTitleBox.length;i++){
       if(subTitleBox[i]){
         $(`.shared-sub-title${i+1}`).text(`サブタイトル：${subTitleBox[i]}`)
         $(`.shared-sub-impression${i+1}`).text(`感想：${subImpressionBox[i]}`)
         $(`.shared-sub-times${i+1}`).text(`訪問時刻：${subTimesBox[i]}`)
         $(`.shared-sub-location${i+1}`).text(`場所：${subLocationBox[i]}`)
         $(`.shared-sub-img${i+1}`).attr('src',`./images/upload_img/${subPictBox[i]}`)
         $(`.shared-sub-img${i+1}`).removeClass('hidden-img')
       } else {
        $(`.shared-sub-title${i+1}`).text("")
        $(`.shared-sub-impression${i+1}`).text("")
        $(`.shared-sub-times${i+1}`).text("")
        $(`.shared-sub-location${i+1}`).text("")
        $(`.shared-sub-img${i+1}`).attr('src','')
        $(`.shared-sub-img${i+1}`).addClass('hidden-img')
       }
      }
    })
  })
})