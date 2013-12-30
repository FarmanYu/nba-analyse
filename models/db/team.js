/**
 *    betId    比赛ID
 *    teamId   球队ID
 *    teamName 球队名称
 *    type     主/客场
 *    On       上场球员  id数组
 *    Off       未上场球员
 *    Total:
 *    Minutes   比赛时间，正常比赛240分钟，一个加时增加25分钟
 *
 */

var db_connect = require("../lib/db");
var collection_name = "team";
var $ = require("jquery");

function Team() {}
Team.filter = {betId:1,on:1,teamId:1,teamName:1,type:1,total:1};
Team.prototype.save = function (info, callback) {

	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}

		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}

			collection.insert(info, callback);
			db.close();

		});

	});
}
/**
 * 通过id查询球队信息
 */
Team.prototype.getTeamDataById = function (id, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}
		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}
			collection.findOne({_id : id}, function(error, team){
				db.close();
				callback(error, team);
			});
		});
	});
}
/**
 * 通过betid查询球队信息
 */
Team.prototype.getTeamDataBybetId = function (betId, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}
		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}
			collection.find({betId : betId}).toArray(function(error, teams) {
				db.close();
				callback(error, teams);
			});
		});
	});
}
Team.prototype.getTeamDataByMatchIds = function (ids, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}
		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}
			collection.find({betId:{$in : ids}}).toArray(function(error, teams) {
				db.close();
				callback(error, teams);
			});
		});
	});
}
/**
 * 更新team时间戳
 */
Team.prototype.updateTimeStampById = function (id, timestamp, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}
		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}

			collection.findOne({
				_id : id
			}, function (error, team) {
				collection.update({_id:id}, {$set: {timestamp : timestamp}});
                db.close();
				callback(error, timestamp);
                
			});
		});
	});
}
/**
 * 通过filter
 */
Team.prototype.getTeamDataByFilter = function (callback, filter, sort) {
	sort = sort || {sort : {betId : -1}};
	if (!filter) {
		db_connect.open(function (err, db) {
			if (err)return;
			db_connect.collection(collection_name, function (err, collection) {
				if (err)return;
				collection.find().toArray(function (error, teams) {
					db.close();
					callback(error, teams);
				});
			});
		});
	} else {
		db_connect.open(function (err, db) {
			if (err)
				return;
			db_connect.collection(collection_name, function (err, collection) {
				if (err)
					return;
				collection.find(filter, Team.filter, sort).toArray(function (error, teams) {
					db.close();
					callback(error, teams);
				});
			});
		});
	}
}
Team.prototype.updateMemberData = function (option, callback) {
	var id = option.id;
	var match = option.match;

	db_connect.open(function (err, db) {
		if (err)
			return;
		db_connect.collection(collection_name, function (err, collection) {
			if (err)
				return;
			collection.findOne({
				_id : id
			}, function (error, team) {
                   if(team){
                       var teamOn = team.on;
                       var hasPlay = false;
                       var index = -1;
                       teamOn.forEach(function(item, idx){
                          if(item.player_id == match.player_id){
                            hasPlay = true;
                            index = idx;
                          }
                       });
                       if(hasPlay){
                           teamOn[index] = match;
                           collection.update({_id:id}, {$set: {on : teamOn}});
                           console.log(id  + " update match success....");
                       } else{
                          console.log("have not player..");
                       }
                       db.close();
                       callback(match);
                   } else{
                       db.close();
                       console.log(id  + " update fail");
                   }


			});
		});
	});
}
module.exports = Team;
