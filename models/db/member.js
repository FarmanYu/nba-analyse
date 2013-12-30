/**
 *   playerId      球员ID
 *   playerName    球员名称
 *   height        身高
 *   widght        体重
 *   position      比赛位置
 *   teamId        所处球队ID
 *   teamName      所在球队名称
 */

var db_connect = require("../lib/db");
var collection_name = "member";

function Member(){}
Member.filterData = {height:1,playerId:1,playerName:1,position:1,teamId:1,teamName:1,weight:1, age:1};
Member.prototype.save = function(info, callback){
    
    db_connect.open(function(err, db){
      if(!err) {
        db_connect.createCollection(collection_name, function(err, collection) {
           if(!err){
              collection.ensureIndex({playerId:1});
              collection.insert(info, function(err, result){
                  db.close();
                  callback(err, result);
              });
              
            }
            
        });
      }
    });
}
Member.prototype.updateByIdSetInfo = function(playerId, info){
    if(!playerId) return;
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection) {
           if(err) return;
           collection.update({playerId:playerId}, {$set: info});
           console.log(info);
           console.log(playerId + " update success....");
           db.close();
        });
    });
}
Member.prototype.addMatchById = function(options){
    var playerId = options.playId;
    var match = options.match;
    if(!playerId) {
        console.log("have not id!!!!");
        return;
    }
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection) {
           if(err) return;
           
           collection.findOne({playerId : playerId}, function(error, member){
               if(member){
                   var matchs = (member && member.matchs) ?  member.matchs :  [];
                   var hasMatch = false;
                   
                   matchs.forEach(function(item){
                     if(item.matchId == match.matchId){
                        hasMatch = true;
                     }
                   });
                   if(!hasMatch){
                       matchs.push(match);
                       collection.update({playerId:playerId}, {$set: {matchs : matchs}});
                       console.log(playerId + " : " + member.playerName + " update match success....");
                   } else{
                       console.log("this id is reapt.");
                   }
                   db.close();
                   options.success(matchs);
               } else{
                  console.log("have not "+ playerId +" : " + match.player_name +" this member!!");
                  db.close();
                  options.fail();
               }
               
            });
        });
    });
}
Member.prototype.getMatchByIds = function(ids, callback){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection){
           if(err) return;
            collection.find({playerId:{$in: ids}},{matchs:1}).toArray(function(err, info){
               db.close();
               callback(err, info);
            });
            
        });
      
    });
}
Member.prototype.clearMatch = function(){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection) {
           if(err) return;
           
            collection.find({matchs:{}}, {safe:true}, function(error, count){
               console.log(count);
               collection.remove({matchs:true});
            });
        });
    });
}
Member.prototype.getAllData = function(callback){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection) {
           if(err) return;
           collection.find().toArray(function(error, members){
               db.close();
               callback(error, members);
            });
        });
      
    });
}
Member.prototype.getMemberById = function(id ,callback){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection){
           if(err) return;
            console.log(id);
            
            collection.findOne({_id : id}, function(err, member){
               db.close();
               callback(err, member);
            });
            
        });
      
    });
}
Member.prototype.getMembersByTeamId = function(id ,callback){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection){
           if(err) return;

            collection.find({teamId : id}, Member.filterData).toArray(function(err, members){
               db.close();
               callback(err, members);
            });
            
        });
      
    });
}
Member.prototype.getPositionByIds = function(ids, callback){
    db_connect.open(function(err, db){
      if(err) return;
        db_connect.collection(collection_name, function(err, collection){
           if(err) return;

            collection.find({playerId:{$in:ids}},{position:true}).toArray(function(err, positions){
               db.close();
               callback(err, positions);
            });
            
        });
      
    });
}
module.exports = Member;