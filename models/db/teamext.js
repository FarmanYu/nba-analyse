/**
 *    teamId   球队ID
 *    msg      球队名称
 *
 */

var db_connect = require("../lib/db");
var collection_name = "teamext";
var util = require("../lib/util");
var $ = require("jquery");

function Teamext() {}
Teamext.prototype.save = function (info, callback) {
    var now = new Date();
    var _info = {
        teamId : 0,
        msg : "",
        time : util.dateFormat("Y-m-d h:i:s", now),
        timestamp : (now.getTime())
    };
    info = $.extend(_info, info);
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}

		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}
            //创建索引
            collection.ensureIndex({teamId:1});
			collection.insert(info, callback);
			db.close();

		});

	});
}
Teamext.prototype.getMsgById = function (id, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}

		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}

			collection.find({teamId:id},{sort:{timestamp:-1}}).toArray(function(error, msgs) {
				db.close();
				callback(error, msgs);
			});

		});

	});
}
Teamext.prototype.delMsgByIds = function (ids, callback) {
	db_connect.open(function (err, db) {
		if (err) {
			console.log(err);
		}

		db_connect.collection(collection_name, function (err, collection) {
			if (err) {
				console.log(err);
			}
            
            collection.remove({teamId:ids.teamId, _id: ids.id}, function(error, count){
                db.close();
                console.log(count);
                callback(error, count);
            });

		});

	});
}
module.exports = Teamext;
