var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var fileUpload = require('express-fileupload');

var User = require('./models/user');
var Title = require('./models/title');
var List = require('./models/list');

User.sync().then(()=>{
  Title.belongsTo(User,{foreignKey:'postedBy'});
  Title.sync();
  List.belongsTo(User,{foreignKey:'postedBy'});
  List.sync();
})

var passport = require('passport');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ||'e20bb981c66d2b9bba37';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'c30a76ceddb966d9fb9686f56e485530863e33df';

passport.serializeUser(function (user,done){
  return done(null,user)
});
passport.deserializeUser(function (obj,done){
  return done(null,obj)
});

passport.use(new GitHubStrategy({
   clientID:GITHUB_CLIENT_ID,
   clientSecret:GITHUB_CLIENT_SECRET,
   callbackURL:process.env.HEROKU_URL ? process.env.HEROKU_URL + '/auth/github/callback' : 'http://localhost:8000/auth/github/callback'
},function(accessToken, refreshToken, profile, done){
   process.nextTick(function(){
     User.upsert({
      userId:profile.id,
      username:profile.username
     }).then(()=>{
       console.log(`個人情報UPSERT完了です`)
       return done(null,profile)
     })
   })
}))


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logoutRouter = require('./routes/logout');
var diaryRouter = require('./routes/diary');
var titleRouter = require('./routes/showDiary');
var listRouter = require('./routes/list');
var listAlterRouter = require('./routes/showList');
var sharedDiaryShowRouter = require('./routes/shared_diary_show');
var shareDiaryies = require('./routes/share');
var loadingRouter = require('./routes/loading');
var diaryCreateLaodingRouter = require('./routes/diaryCreateLoading');
var diaryEditLoading = require('./routes/diaryEditLoading');
var listCreateLaoding = require('./routes/listCreateLoading');
var listEditLoading = require('./routes/listEditLoading');
var loadingPagingRouter = require('./routes/loadingPaging');

var app = express();

app.use(session({ secret: 'e55be81b307c1c09', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
    
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logout',logoutRouter);
app.use('/diary',diaryRouter);
app.use('/title',titleRouter);
app.use('/list',listRouter);
app.use('/list',listAlterRouter);
app.use('/shared',sharedDiaryShowRouter);
app.use('/share',shareDiaryies);
app.use('/loading',loadingRouter);
app.use('/diaryCreating',diaryCreateLaodingRouter);
app.use('/diaryEditing',diaryEditLoading);
app.use('/listCreating',listCreateLaoding);
app.use('/listEditing',listEditLoading);
app.use('/loadingPaging',loadingPagingRouter);

app.get('/auth/github',
passport.authenticate('github',{scope:['user:email']}),
function (req,res){});

app.get('/auth/github/callback',
  passport.authenticate('github',{failureRedirect:'/'}),
  function (req,res){return res.redirect('/loadingPaging')})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
