var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload=multer({dest:'./public/images/'});
const MongoClient = require('mongodb').MongoClient;
var objectId=require('mongodb').ObjectId;
var db=null;
// console.log = function() {}

MongoClient.connect('mongodb://localhost:27017/nodeblog', {useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  if (err) throw err
  
  
  db = client.db('nodeblog')
  
  db.collection('posts').find().toArray(function (err, result) {
    if (err) throw err

 //   console.log("----",result)
  })
})



router.get('/delete/:id/', function(req, res, next) {
  // console.log("reached here........", req.params.id)
   var posts=db.collection('posts');
   id=req.params.id;
  posts.find().toArray(function(err,post){
     if(err)
     { console.log(err)}
    console.log("id is ",id);
     post = post.filter( obj => id == obj._id);
  
  console.log("new id is ",post[0]);
     db.collection('posts').deleteOne(post[0]);
     console.log("the post  with name  ",post[0].title, "is deleted successfully from database ");
     res.redirect('http://localhost:3000/');
 });
 });
 

router.get('/showcategory/category/:category/', function(req, res, next) {
 // console.log("reached here........", req.params.id)
  var posts=db.collection('posts');
  id=req.params.category;
 posts.find().toArray(function(err,post){
    if(err)
    { console.log(err)}
 
    post = post.filter( obj => id == obj.category);
    console.log('post data is ',post[0]);
  res.render('showCategory',{
    'posts':post,
   
  });
});
});


//edit a post
router.get('/show/:id/edit/', function(req, res, next) {
  // console.log("reached here........", req.params.id)
   var posts=db.collection('posts');
   id=req.params.id;
  posts.find().toArray(function(err,post){
     if(err)
     { console.log(err)}
  
     post = post.filter( obj => id == obj._id);
     var categories=db.collection('categories');
  categories.find().toArray(function(err,categories){
    if(err)
    console.log(err)
  
 
   res.render('edit',{
     'post':post,
     'categories':categories
    
   });
 });
 });
});

//comments
router.get('/show/:id/comments/', function(req, res, next) {
  // console.log("reached here........", req.params.id)
   var posts=db.collection('posts');
   id=req.params.id;
  posts.find().toArray(function(err,post){
     if(err)
     {console.log(err)}
  
     post = post.filter( obj => id == obj._id);
     
 


 /*-------------------Displaying comments-------------------*/
//getting the train name of the id
//var posts=db.collection('posts');
//id=req.params.id;
var tname;
posts.find().toArray(function(err,posta){
  if(err)
  { console.log(err)}

  posta = posta.filter( obj => id == obj._id);
  tname=posta[0].title;







 var comments=db.collection('comments');
comments.find().toArray(function(err,comment){
   if(err)
   { console.log(err)}

   comment = comment.filter( obj => tname == obj.trainName);
  // console.log('comment data is ',comment[0]);
 res.render('comment',{
   'comments':comment,
   'post':post
 });
});
});
});

});











/*--------------------------------------------------------------Displaying Comments Till Here---------------------------------------------------- */

 
// DELETING COMMENTS 

router.get('/show/:id1/comments/delete/:id2/', function(req, res, next) {
  var id1,id2;
  var data={
    show:{
      "l1":req.params.id1,
      "l2":req.params.id2
    }
  }

console.log("probable comment id1 is ",data.show.l1);
console.log("probable comment id2 is ",data.show.l2);
var id=data.show.l2;
var comments=db.collection('comments');
comments.find().toArray(function(err,comment){
  if(err)
  { console.log(err)}
 //console.log("id is ",id);
  comment = comment.filter( obj => id == obj._id);

console.log("new comment id is ",comment[0]);
  db.collection('comments').deleteOne(comment[0]);
  console.log("the post  with body  ",comment[0].yourComment, "is deleted successfully from database ");
 // res.redirect('http://localhost:3001/');
});
var id1=data.show.l1;
res.redirect('back');
});









 /*  console.log("reached here........", req.params.id)
   var posts=db.collection('posts');
   id=req.params.id;
  posts.find().toArray(function(err,post){
     if(err)
     { console.log(err)}
  
     post = post.filter( obj => id == obj._id);
     var categories=db.collection('categories');
  categories.find().toArray(function(err,categories){
    if(err)
    console.log(err)
  
 
   res.render('edit',{
     'post':post,
     'categories':categories
    
   });
 });
 });*/






//adding new comments
router.post('/show/:id/comments/',function(req,res,next){
  console.log("request name is ", req.body.name);
 // var id = _id;
  console.log("id of train comment 1 is ",id);
  var trainName=req.body.trainName;
  var name=req.body.name;
  var age=req.body.age;
  var yourComment=req.body.yourComment;
  var email=req.body.email;
  var otherTags=req.body.otherTags;
  //var date=new Date();
  console.log("id of train comment 2 is ",id);
  //form validation
//  req.checkBody('name','please fill title').notEmpty();
//  req.checkBody('comment','please fill body').notEmpty();
 // req.checkBody('email','please fill body').notEmpty();
//  console.log("request error is -------------",req.validationErrors())
//  var errors=req.validationErrors();
 /* if(errors){
    console.log("some error but id is ",id)
    res.render('comment',{
      "errors":errors
    });
  }*/
//  else
//  {
    //var posts=db.get('posts')
    console.log("id of train comment 3 is ",id);
    var comments=db.collection('comments');
      comments.insertOne({
        "trainName":trainName,
        "name":name,
        "age":age,
        "yourComment":yourComment,
        "email":email,
        "otherTags":otherTags
      },
      
      function(err,comment)
      {
        if(err){
          res.send(err);
          console.log("id of train comment 4 is ",id);
        }
        else{
          req.flash('success','Comment added');
          console.log("id of train comment 5 is ",id);
          res.redirect('back');
        }
      })
  }
  
 // }
  );
  





















//new by me today////////////////////////////////////////////////////////////////////////
router.post('/show/:id/edit/',upload.single('mainimage'),function(req,res,next){
  var title=req.body.title;
  var category=req.body.category;
  var body=req.body.body;
  var author=req.body.author;
  var date=new Date();


  console.log("id receibed is ",id);
  //checking upload 
  if(req.file)
  {
    console.log("yes");
    var mainimage=req.file.filename
  }
  else
  {
    console.log("no image received but id is",id);
    var mainimage;
    //we will search the db for image of that particular id
    var posts=db.collection('posts');
   
   
  posts.find().toArray(function(err,post){
     if(err)
     { console.log(err)}
    console.log("id is ",id);
     post = post.filter( obj => id == obj._id); 
      mainimage=post[0].mainimage;
      console.log("id is for no ----------- ",post[0]._id);
      console.log("main id image is",mainimage);
  })

}
  //form validation
  req.checkBody('title','please fill title').notEmpty();
  req.checkBody('body','please fill body').notEmpty();
  
  var errors=req.validationErrors();
  if(errors){
    res.render('edit',{
      "errors":errors
    });
  }else
  {
    //schecking whole database
  
    db.collection('posts').find().toArray(function(err,post){
      if(err)
      { console.log(err)}
     console.log("id is ",id);
      post = post.filter( obj => id == obj._id);
   
  //    var identi={id:post[0]._id};
      //new data is 
      var newvalues={
      "title":title,
      "body":body,
      "category":category,
      "date":date,
      "author":author,
      "mainimage":mainimage};
      db.collection('posts').updateOne({"_id":objectId(id)}, {$set:newvalues}, function(err, res) {
        if (err) {
          console.log("some problem while editing")
          throw err};
        console.log("1 document updated with ",id);
      
      });

  });
  req.flash('success','post updated sucessfully');
  res.redirect('/');
  }
})
  




















/*Trying myself */
router.get('/show/:id', function(req, res, next) {
 // console.log("reached here........", req.params.id)
  var posts=db.collection('posts');
  id=req.params.id;
 posts.find().toArray(function(err,post){
    if(err)
    { console.log(err)}
 
    post = post.filter( obj => id == obj._id);

  res.render('show',{
    'post':post,
   
  });
});
});
/* Till here  */
/* GET users listing. */
router.get('/add', function(req, res, next) {
  var categories=db.collection('categories');
  categories.find().toArray(function(err,categories){
    if(err)
    console.log(err)
    
  res.render('addpost',{
    'title':'Add post',
    'categories':categories
  });
});
});
















//adding new post
router.post('/add',upload.single('mainimage'),function(req,res,next){
var title=req.body.title;
var category=req.body.category;
var body=req.body.body;
var author=req.body.author;
var date=new Date();

//checking upload 
if(req.file)
{
  console.log("yes");
  var mainimage=req.file.filename
}
else
{
  var mainimage='noimage.jpg'
}
//form validation
req.checkBody('title','please fill title').notEmpty();
req.checkBody('body','please fill body').notEmpty();

var errors=req.validationErrors();
if(errors){
  res.render('addpost',{
    "errors":errors
  });
}else
{
  //var posts=db.get('posts')
  var posts=db.collection('posts');
    posts.insert({
      "title":title,
      "body":body,
      "category":category,
      "date":date,
      "author":author,
      "mainimage":mainimage
    },
    function(err,post)
    {
      if(err){
        res.send(err);
      }
      else{
        req.flash('success','post added');
        res.location('/');
        res.redirect('/');
      }
    })
}

});





//editing comments
router.get('/show/:id1/comments/edit/:id2/', function(req, res, next) {
  var data={
    show:{
      "l1":req.params.id1,
      "l2":req.params.id2
    }
  }

console.log("probable edit comment id1 is ",data.show.l1);
console.log("probable edit comment id2 is ",data.show.l2);
var ids1=data.show.l1;
var ids2=data.show.l2;
var posts=db.collection('posts');
posts.find().toArray(function(err,post){
  if(err)
  { console.log(err)}
  post = post.filter( obj => ids1 == obj._id);

 var comments=db.collection('comments');
comments.find().toArray(function(err,comment){
  if(err)
  { console.log(err)}
 //console.log("id is ",id);
  comment = comment.filter( obj => ids2 == obj._id);

  res.render('editComment',{
    'post':post,
    'comment':comment})
    console.log("new train here id is ",post[0]);    
console.log("new comment here id is ",comment[0]);
});
//res.redirect('back');
});

});




//post of edit comment

router.post('/show/:id1/comments/edit/:id2/',function(req,res,next){
  var data={
    show:{
      "l1":req.params.id1,
      "l2":req.params.id2
    }
  }

console.log("probable post edit comment id1 is ",data.show.l1);
console.log("probable post edit comment id2 is ",data.show.l2);
var ids1=data.show.l1;
var ids2=data.show.l2;
  var trainName=req.body.trainName;
  var name=req.body.name;
  var age=req.body.age;
  var yourComment=req.body.yourComment;
  var email=req.body.email;
  var otherTags=req.body.otherTags;

  console.log("id1 receibed is ",ids1);
  console.log("id2 receibed is ",ids2);
 
  /*form validation
  req.checkBody('title','please fill title').notEmpty();
  req.checkBody('body','please fill body').notEmpty();
  
  var errors=req.validationErrors();
  if(errors){
    res.render('edit',{
      "errors":errors
    });
  }else
  {
    //schecking whole database
  */var comments=db.collection('comments');
    db.collection('comments').find().toArray(function(err,comment){
      if(err)
      { console.log(err)}
    // console.log("id is ",id);
      comment = comment.filter( obj => ids2 == obj._id);
   
  //    var identi={id:post[0]._id};
      //new data is 
      var newvalues={
      "trainName":trainName,
      "name":name,
      "age":age,
      "yourComment":yourComment,
      "email":email,
      "otherTags":otherTags
    };
      db.collection('comments').updateOne({"_id":objectId(ids2)}, {$set:newvalues}, function(err, res) {
        if (err) {
          console.log("some problem while editing")
          throw err};
        console.log("1 document updated with ",ids2);
      
      });

  });
  req.flash('success','comment updated sucessfully');
  res.redirect('http://localhost:3000/posts/show/'+ids1+'/comments/');
//  res.redirect('/')
  
})
  

















module.exports = router;
