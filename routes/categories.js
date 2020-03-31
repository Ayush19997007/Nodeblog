var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload=multer({dest:'uploads/'})
const MongoClient = require('mongodb').MongoClient;
var db=null;

MongoClient.connect('mongodb://localhost:27017/nodeblog', {useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  if (err) throw err
  db = client.db('nodeblog')
  
  db.collection('posts').find().toArray(function (err, result) {
    if (err) throw err

   // console.log(result)
  })
})
/* GET users listing. */
router.get('/add', function(req, res, next) {
  var categories=db.collection('categories');
  categories.find().toArray(function(err,categories){
    if(err)
    console.log(err)
    
  res.render('addcategory',{
    'title':'Add category',
    
  });
});
});
router.post('/add',function(req,res,next){
var name=req.body.name;
//form validation
req.checkBody('name','please fill name').notEmpty();


var errors=req.validationErrors();
if(errors){
  res.render('addpost',{
    "errors":errors
  });
}else
{
  //var posts=db.get('posts')
  var categories=db.collection('categories');
    categories.insert({
      "name":name,
    },
    function(err,post)
    {
      if(err){
        res.send(err);
      }
      else{
        req.flash('success','category added');
        res.location('/');
        res.redirect('back');
      }
    })
}
});
module.exports = router;
