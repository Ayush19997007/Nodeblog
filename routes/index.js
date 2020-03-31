var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
const mongoose=require('mongoose');
const MongoClient = require('mongodb').MongoClient;
var db=null;

MongoClient.connect('mongodb://localhost:27017/nodeblog', {useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  if (err) throw err
  db = client.db('nodeblog')
  
  db.collection('posts').find().toArray(function (err, result) {
    if (err) throw err

  //  console.log(result)
  })
})


router.get('/', function(req, res, next) {
 // var db=req.db;
  var posts=db.collection('posts');
  posts.find().toArray(function(err,posts){
    if (err) throw err

    console.log("sUcEss")
  //  console.log(posts)
    res.render('index',{posts:posts});
  });
  });
module.exports = router;
