const listCommentTitle = listComs[0].listCommentTitle + '/n' + listComs[1].listCommentTitle + '/n' + listComs[2].listCommentTitle + '/n' + listComs[3].listCommentTitle + '/n' + listComs[4].listCommentTitle;
    const listCommentCont = listComs[0].listCommentCont + '/n' + listComs[1].listCommentCont + '/n' + listComs[2].listCommentCont + '/n' + listComs[3].listCommentCont + '/n' + listComs[4].listCommentCont;


    $('.diary-title').removeClass('hidden_display')
    $('.diary-updateAt').removeClass('hidden_display')
    $('.diary-insertAt').removeClass('hidden_display')
    $('.diary-date').removeClass('hidden_display')
    $('.diary-weather').removeClass('hidden_display')

    $('.diary-title').addClass('hidden_display')
    $('.diary-updateAt').addClass('hidden_display')
    $('.diary-insertAt').addClass('hidden_display')
    $('.diary-date').addClass('hidden_display')
    $('.diary-weather').addClass('hidden_display')