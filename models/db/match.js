/*
 *   betId :  时间年月日+主场id
 *   Time :  2013-05-07 9:00
 *   hostId :  主场Id
 *   guestId :  客场Id
 *   hostScore : 主场得分
 *   GuestScore : 客场ID
 *   Desc   :  分析描述    
 *   Type   : 比赛类型 A：常规赛  B：季后赛
 *
 *
 */

var db_connect = require("../lib/db");
var collection_name = "match";

function Match(info){

}
Match.prototype.save = function(info, callback){
    
    db_connect.open(function(err, db){
      if(!err) {
        db_connect.collection(collection_name, function(err, collection) {
           if(!err){
              //创建索引
              collection.ensureIndex({betId:1});
              collection.insert(info, function(err, result){
                callback(err, result);
              });
              //db.close();
            }
            
        });
      }
    });
    
}
Match.prototype.getMatchsByFilter = function(filter, sort, callback ){
    sort = sort ? sort : {sort:{timestamp:-1}};
    if(!filter){
        db_connect.open(function(err, db){
          if(err) return;
          db_connect.collection(collection_name, function(err, collection) {
            if(err) return;
            collection.find().toArray(function(error, matchs){
               db.close();
               callback(error, matchs);
            });
          });
        });
    } else{
        db_connect.open(function(err, db){
          if(err) return;
          db_connect.collection(collection_name, function(err, collection) {
            if(err) return;
            collection.find(filter, sort).toArray(function(error, matchs){
               db.close();
               callback(error, matchs);
            });
          });
        });
    }
}
Match.prototype.getAllData = function(callback, filter){
    if(!filter){
        db_connect.open(function(err, db){
          if(err) return;
          db_connect.collection(collection_name, function(err, collection) {
            if(err) return;
            collection.find().toArray(function(error, matchs){
               db.close();
               callback(error, matchs);
            });
          });
        });
    } else{
        db_connect.open(function(err, db){
          if(err) return;
          db_connect.collection(collection_name, function(err, collection) {
            if(err) return;
            collection.find(filter).toArray(function(error, matchs){
               db.close();
               callback(error, matchs);
            });
          });
        });
    }
}
module.exports = Match;