'use strict';
import $ from 'jquery';

$('.diary_alter').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    const titleId = button.data('title-id');
    const dataLoadingId = button.data('loadingid');
    $.post(`/title/${titleId}/alter/d`,{
      data:titleId
    }, (data)=>{
      const titleName = data.titleName;
      const titleDate = data.titleDate;
      const titleWeather = data.titleWeather;
      const topImg = data.topImg;
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
        $(`.bl_listDisplay_img__diary`).attr('src',`../images/getFromS3_img/${dataLoadingId}${topImg}`)
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
         $(`.sub-img${i+1}`).attr('src',`../images/getFromS3_img/${dataLoadingId}${subPictBox[i]}`)
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
  const dataLoadingId = button.data('loadingid');
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
        $('.list-pict').attr('src',`../images/getFromS3_img/${dataLoadingId}${listItemPict}`);
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
          $(`.list-comment-title${i+1}`).text(`${i+1}　${listCommentTitleBox[i]}`)
          $(`.list-comment-cont${i+1}`).text(`　${listCommentContBox[i]}`)
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
  const dataLoadingId = button.data('loadingid');
  button.click(()=>{
    const titleId = button.data('title-id');
    $.post(`/title/${titleId}/alter/d`,{
      data:titleId
    }, (data)=>{
      const titleName = data.titleName;
      const titleDate = data.titleDate;
      const titleWeather = data.titleWeather;
      const titleContributor = data.contributor;
      const topImg = data.topImg;
      const updateAt = data.updateAt;
      const insertAt = data.insertAt;
      const subTitleBox = data.subTitleLine.split('/n');
      const subTimesBox = data.subTimesLine.split('/n');
      const subImpressionBox = data.subImpressionLine.split('/n');
      const subLocationBox = data.subLocationLine.split('/n');
      const subPictBox = data.subPictLine.split('/n');

      if(titleName){
         $('.shared-diary-title').text(`${titleName}`)
         $('.shared-diary-updateAt').text(`日記作成日：${updateAt}`)
         $('.shared-diary-insertAt').text(`日記更新日：${insertAt}`)
         $('.shared-diary-date').text(`旅行日：${titleDate}`)
         $('.shared-diary-weather').text(`天気：${titleWeather}`)
         $('.shared-diary-postedBy').text(`投稿者：${titleContributor}`)
         $(`.bl_listDisplay_img__diary`).attr('src',`../images/getFromS3_img/${dataLoadingId}${topImg}`)
         $('.bl_listDisplay_img__diary').removeClass('hidden_display')
         $('.bl_listDisplay').removeClass('hidden_display')
      } else {
        $('.bl_listDisplay_img__diary').addClass('hidden_display')
        $('.bl_listDisplay').removeClass('hidden_display')
      }
      
      for(let i=0; i<subTitleBox.length;i++){
       if(subTitleBox[i]){
         $(`.shared-sub-title${i+1}`).text(`${subTitleBox[i]}`)
         $(`.shared-sub-impression${i+1}`).text(`${subImpressionBox[i]}`)
         $(`.shared-sub-times${i+1}`).text(`訪問時刻：${subTimesBox[i]}`)
         $(`.shared-sub-location${i+1}`).text(`場所：${subLocationBox[i]}`)
         $(`.shared-sub-img${i+1}`).attr('src',`../images/getFromS3_img/${dataLoadingId}${subPictBox[i]}`)
         $(`.shared-sub-img${i+1}`).removeClass('hidden-img')
         $(`.shared-sub-title${i+1}`).removeClass('hidden_display')
         $(`.shared-sub-impression${i+1}`).removeClass('hidden_display')
         $(`.shared-sub-times${i+1}`).removeClass('hidden_display')
         $(`.shared-sub-location${i+1}`).removeClass('hidden_display')
       } else {
        $(`.shared-sub-title${i+1}`).text("")
        $(`.shared-sub-impression${i+1}`).text("")
        $(`.shared-sub-times${i+1}`).text("")
        $(`.shared-sub-location${i+1}`).text("")
        $(`.shared-sub-img${i+1}`).attr('src','')
        $(`.shared-sub-img${i+1}`).addClass('hidden-img')
        $(`.shared-sub-title${i+1}`).addClass('hidden_display')
        $(`.shared-sub-impression${i+1}`).addClass('hidden_display')
        $(`.shared-sub-times${i+1}`).addClass('hidden_display')
        $(`.shared-sub-location${i+1}`).addClass('hidden_display')
       }
      }
    })
  })
})

$('.btn_loading').each((i,e)=>{
  const button = $(e);
  button.click(()=>{
    button.prop("disabled", true);
    $(`.loading_title`).text("ローディング中... しばらくお待ちください");
    $(`.loading_title_attention`).text("(ネットワークの状況により、完了まで3分以上かかることがあります)");
    $.getJSON('/loadingPaging/loadingData').done((data)=>{
      var state = data.state;
      var loadingId = data.loadingId;
      var encodedLoadingId = data.encodedLoadingId;
      $(`.loading_title`).text(state);
      $(`.loading_title_attention`).text("");
      button.prop("disabled", false);
      button.text("もう一度ローディング");
      $('.form_hidden').removeClass('form_hidden');
      $('.loadingFinForm').attr("action", `/users/?id=${loadingId}`);
      button.addClass('form_hidden');
      $('.btn_done').text("完了");
    })
  })
})