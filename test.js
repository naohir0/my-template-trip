'use strict';
const request = require('supertest');
const app = require('./app');
const passportStub = require('passport-stub');
const User = require('./models/user');
const Title = require('./models/title');
const List = require('./models/list');

describe('/',(done)=>{
   it('トップページにログインのリンクが含まれる',()=>{
     request(app)
     .get('/')
     .expect('Content-Type','text/html; charset=utf-8')
     .expect(/<a href="\/auth\/github"/)
     .expect(200,done)
   })
})

describe('ログイン',()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({username:'testuserA',id:'11111'});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });
  it('ログインして自分の名前とIDが表示される',(done)=>{
    request(app)
     .get('/users')
     .expect(/現在 testuserA でログイン中です/)
     .expect('Content-Type','text/html; charset=utf-8')
     .expect(200,done)
  })
})

describe('/diary',()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({username:'testuser',id:'11111'});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });
  it('作成者以外は日記を編集できない',(done)=>{
    User.upsert({username:'testuser',userId:'0000'}).then(()=>{
      request(app)
       .get('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/edit')
       .expect(404,done)
    })
  });
  it('作成者以外は日記を編集できない',(done)=>{
    User.upsert({username:'testuser',userId:'0000'}).then(()=>{
      request(app)
      .post('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/edit?edit=12')
      .expect(404,done)
    })
  });
  it('作成者以外は日記を削除できない',(done)=>{
    request(app)
     .get('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/delete?delete=12')
     .expect(404,done)
  });
})

describe('本人の投稿',()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({username:'naohir0',id:'61265237'});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });
  it('作成者は日記を編集ページを表示できる',(done)=>{
      request(app)
       .get('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/edit')
       .expect(/投稿フォーム/)
       .expect(200,done)
  });
  it('クエリーパラメーターが異なる場合は日記を編集できない',(done)=>{
      request(app)
      .post('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/edit?edit=10')
      .expect(400,done)
  });
  it('クエリーパラメーターが異なる場合は日記を削除できない',(done)=>{
      request(app)
      .get('/diary/de8beae0-ce65-48b2-aef2-ee066bea817b/delete?delete=10')
      .expect(400,done)
  });
  it('作成者は予定を編集ページを表示できる',(done)=>{
    request(app)
     .get('/list/0ed67de5-4644-4c42-b6a5-40bb3cae251e/edit')
     .expect(/投稿フォーム/)
     .expect(200,done)
});
it('クエリーパラメーターが異なる場合は予定を編集できない',(done)=>{
    request(app)
    .post('/list/de8beae0-ce65-48b2-aef2-ee066bea817b/edit?edit=12')
    .expect(400,done)
});
it('クエリーパラメーターが異なる場合は予定を削除できない',(done)=>{
    request(app)
    .get('/list/de8beae0-ce65-48b2-aef2-ee066bea817b/delete?delete=12')
    .expect(400,done)
});
it('本人は日記を削除できる',(done)=>{
    request(app)
    .get('/diary/4fc70bf8-6f42-495b-9329-db9aad44cd6c/delete?delete=12')
    .expect(302)
    .end((err,res)=>{
      if(err){return console.log('ERROR 日記削除実行')}
      request(app)
      .get('/users')
      .expect(/テスト削除日記/)
      .expect(200)
      .end((err,res)=>{
        if(err){
          console.log('ERROR 日記削除完了')
          return done(err)
        } else {
          return done();
        }
      })
    })
});
it('本人は予定を削除できる',(done)=>{
   request(app)
   .get('/list/dcaff428-1972-4c2f-93a4-50557cd29e56/delete?delete=10')
   .expect(302)
   .end((err,res)=>{
     if(err){return console.log('ERROR 予定削除実行')}
     request(app)
     .get('/list')
     .expect(/所在地 大洗/)
     .expect(/テスト削除/)
     .expect(/45/)
     .expect(200)
     .end((err,res)=>{
       if(err){
         console.log('ERROR 予定削除完了')
         return done(err)
       } else {
         return done()
       }
     })
   })
})
 });

 describe('/list',()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({username:'testuser',id:'11111'});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });
   it('作成者以外は予定編集ページを開くことができない',(done)=>{
     request(app)
     .get('/list/0ed67de5-4644-4c42-b6a5-40bb3cae251e/edit')
     .expect(404,done)
   });
   it('作成者以外は予定を編集できない',(done)=>{
     request(app)
     .get('/list/0ed67de5-4644-4c42-b6a5-40bb3cae251e/edit?edit=10')
     .expect(404,done)
   });
   it('作成者以外は予定を削除できない',(done)=>{
     request(app)
     .get('/list/0ed67de5-4644-4c42-b6a5-40bb3cae251e/delete?delete=10')
     .expect(404,done)
   })
 })

 //削除用日記：de8beae0-ce65-48b2-aef2-ee066bea817b/

describe('S３導入後のCURD',()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({id:22222,username:'testuserX'});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });

  //CSRFを外してテストを実行
  it('日記の作成ができる（S3導入後)',(done)=>{
    User.upsert({ userId: 22222, username: 'testuserX' }).then(() => {
    request(app)
    .get('/users/?id=3333')
    .expect(/日記一覧/)
    .expect(/日記の詳細/)
    .expect(200,done)
    .end((err,res)=>{
      request(app)
      .post('/diary/create/?id=3333')
      .send({title:"テスト旅行",date:"2020/13/20",weather:"晴れ",subtitle1:"サブタイトル1",subtitle2:"サブタイトル1",subtitle3:"サブタイトル1",subtitle4:"サブタイトル1",subtitle5:"サブタイトル1",subtitle6:"サブタイトル1",subtitle7:"サブタイトル1",subtitle8:"サブタイトル1",subtitle9:"サブタイトル1",subtitle10:"サブタイトル1",subtitle11:"サブタイトル1",subtitle12:"サブタイトル1",subtitle13:"サブタイトル1",subtitle14:"サブタイトル1",subtitle15:"サブタイトル1",times1:"10:10",times2:"10:10",times3:"10:10",times4:"10:10",times5:"10:10",times6:"10:10",times7:"10:10",times8:"10:10",times9:"10:10",times10:"10:10",times11:"10:10",times12:"10:10",times13:"10:10",times14:"10:10",times15:"",location1:"テスト高原",location2:"",location3:"",location4:"",location5:"",location6:"",location7:"",location8:"",location9:"",location10:"",location11:"",location12:"",location13:"",location14:"",location15:"",impression1:"よかった",impression2:"",impression3:"",impression4:"",impression5:"",impression6:"",impression7:"",impression8:"",impression9:"",impression10:"",impression11:"",impression12:"",impression13:"",impression14:"",impression15:"",})
      .expect(302)
      .then((err,res)=>{
        request(app)
        .get('/users/?id=3333')
        .expect(/テスト旅行/)
        .expect(200,done)
      }) 
    })
   })
  })
  it('日記の編集ができる（S3導入後)',(done)=>{
     request(app)
      Title.findAll({
        where:{date:"2020/13/20"}
      }).then((title)=>{
        const titleId = title[0].titleId;
        request(app)
        .post(`/diary/${titleId}/edit?edit=sRN6BiPkt13m3c3QjLWNvNXzVdB3qsJiFKX8ptEAfH&id=3333`)
        .send({title:"テスト編集旅行",date:"2020/13/20",weather:"晴れ",subtitle1:"サブタイトル1",subtitle2:"サブタイトル1",subtitle3:"サブタイトル1",subtitle4:"サブタイトル1",subtitle5:"サブタイトル1",subtitle6:"サブタイトル1",subtitle7:"サブタイトル1",subtitle8:"サブタイトル1",subtitle9:"サブタイトル1",subtitle10:"サブタイトル1",subtitle11:"サブタイトル1",subtitle12:"サブタイトル1",subtitle13:"サブタイトル1",subtitle14:"サブタイトル1",subtitle15:"サブタイトル1",times1:"10:10",times2:"10:10",times3:"10:10",times4:"10:10",times5:"10:10",times6:"10:10",times7:"10:10",times8:"10:10",times9:"10:10",times10:"10:10",times11:"10:10",times12:"10:10",times13:"10:10",times14:"10:10",times15:"",location1:"テスト高原",location2:"",location3:"",location4:"",location5:"",location6:"",location7:"",location8:"",location9:"",location10:"",location11:"",location12:"",location13:"",location14:"",location15:"",impression1:"よかった",impression2:"",impression3:"",impression4:"",impression5:"",impression6:"",impression7:"",impression8:"",impression9:"",impression10:"",impression11:"",impression12:"",impression13:"",impression14:"",impression15:"",})
        .expect(302)
        .end((err,res)=>{
           if (err) return done(err);
           request(app)
           .get('/users/?id=3333')
           .expect(/テスト旅行/)
           .expect(200,done)
         })
        })
      })
  it('予定の作成ができる（S3導入後)',(done)=>{
     request(app)
     .post('/list/create/?id=3333')
     .send({listName:"テスト予定",listPlace:"予定所在地",listCommentTitle1:"予定１",listCommentTitle2:"",listCommentTitle3:"",listCommentTitle4:"",listCommentTitle5:"",listCommentTitle6:"",listCommentTitle7:"",listCommentTitle8:"",listCommentTitle9:"",listCommentTitle10:"",listCommentCont1:"テストします",listCommentCont2:"",listCommentCont3:"",listCommentCont4:"",listCommentCont5:"",listCommentCont6:"",listCommentCont7:"",listCommentCont8:"",listCommentCont9:"",listCommentCont10:""})
     .expect(302)
     .end((err,res)=>{
       if(err) return done(err);
       request(app)
       .get('/list/?id="3333')
       .expect(/テスト予定/)
       .expect(200,done)
     })
    })

  it('予定の編集ができる（S3導入後)',(done)=>{
     List.findAll({
       where:{listItemPlace:"予定所在地"}
     }).then((list)=>{
       const listItemId = list[0].listItemId;
       request(app)
       .post(`/list/${listItemId}/edit?edit=QxAmQjYmlY2Lza1bbbr2SQAJxY7w9VnjJaVmTxwzfd&id=3333`)
       .send({listName:"テスト編集予定",listPlace:"予定所在地",listCommentTitle1:"予定１",listCommentTitle2:"",listCommentTitle3:"",listCommentTitle4:"",listCommentTitle5:"",listCommentTitle6:"",listCommentTitle7:"",listCommentTitle8:"",listCommentTitle9:"",listCommentTitle10:"",listCommentCont1:"テストします",listCommentCont2:"",listCommentCont3:"",listCommentCont4:"",listCommentCont5:"",listCommentCont6:"",listCommentCont7:"",listCommentCont8:"",listCommentCont9:"",listCommentCont10:""})
       .expect(302)
       .end((err,res)=>{
         if(err) return done(err);
         request(app)
         .get('/list/?id="3333')
         .expect(/テスト編集予定/)
         .expect(200,done)
       })
     })
  })

  it('日記の削除ができる（S3導入後)',(done)=>{
    Title.findAll({
      where:{
        postedBy:22222
        },
      order:[['"updateAt"','DESC']]
    }).then((titles)=>{
        const titleId = titles[0].titleId;
        request(app)
        .get(`/diary/${titleId}/delete/?delete=J8bRiFW7tUqgcHNraAgTkP8116KYuMxLIP9VRlRtpu`)
        .expect(302)
    })
  })
  it('予定の削除ができる（S3導入後)',(done)=>{
    List.findAll({
      where:{
        postedBy:22222
        },
        order:[['"updateAt"','DESC']]
    }).then((list)=>{
      const listId = list[0].listItemId;
      request(app)
      .get(`/list/${listId}/delete/?delete=pGn4DvVbnoZ51MivajgyyaivO1mmGElpCc0k6dvEqn`)
      .expect(302)
    })
  })
})


