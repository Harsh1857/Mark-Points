var express = require('express');
var router  = express.Router();
var db      = require('../database');
var mongo   = require('mongodb'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mark Point' });
});


router.get('/save', function(req, res, next) {
    var mark_text = req.query.markText;
    if(mark_text == "")
        return res.send(false);
    
    var obj = new Object();
    obj.mark_text  = decodeURIComponent(req.query.markText);
    obj.left_pos   = req.query.leftPos;
    obj.top_pos    = req.query.topPos;
    obj.face       = req.query.face;
    obj.created_at = new Date();
    
    db.get.collection("mark_points").insert(obj);
    return res.send(true);
    
});


router.get('/render', function(req, res , next) {
    
    var output = new Array();
    
    db.get.collection('mark_points').find({face : req.query.face}).toArray(function(err, result) {
        return res.send(result);
    });
});

router.get('/getPoint', function(req, res, next) {
    
    db.get.collection('mark_points').findOne({_id : new mongo.ObjectID(req.query.pointId)}, function(err, result) {
        return res.send(result);
    });
});

router.get('/remove', function(req, res, next) {
    db.get.collection('mark_points').remove({_id : new mongo.ObjectID(req.query.pointId)}, function(err, result) {
        return res.send("Success");
    });
});

module.exports = router;
