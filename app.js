var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var multer=require('multer');
var moment=require('moment');
var expressValidator=require('express-validator');
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');
//var db=require('monk')('localhost/nodeblog');

var app = express();
var upload=multer({dest:'./public/images/'});
//var mongo=require('mongodb');
const MongoClient = require('mongodb').MongoClient;

//const mongoose=require('mongoose');
const url = 'mongodb://localhost:27017/nodeblog';
//const connect=mongoose.connect(url);
var bodyParser = require('body-parser');
var db='mongodb://localhost:27017/nodeblog';
//app.use(bodyParser());
app.use(bodyParser.json());

/*
MongoClient.connect(url, (err, database) => {
  // ... start the server
  console.log("connected successfully to the confusion database\n");
},(err)=>{
  console.log(err);
});
*/
MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });


app.locals.moment=require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express validator
app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace=param.split('.'),
    root=namespace.shift(),
    formParam=root;
    while(namespace.length){
      formParam+='['+namespace.shift()+']';
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    };
  }
}))
//express session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
})); 
//connect flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use((req,res,next)=>{
  res.locals.message=require('express-messages')(req,res);
  next();
})

//make our db assesible to our router
app.use(function(req, res, next){
	req.db = db;
	next();
});


app.use('/', indexRouter);
app.use('/posts', postsRouter);

app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.locals.truncateText=function(text,length)
{
  var truncatedText=text.substring(0,length);
  return truncatedText;
}


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



















