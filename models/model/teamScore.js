var Team = require("../db/team");
var Member = require("../db/member");
var request = require("../lib/request").get;
var $ = require("jquery");

function calcPlayScore(msgs, playerId) {
    if(!playerId){
        console.log("has not playerId");
        return;
    }
    var inside_made = 0,
        inside_fail = 0,
        outer_made  = 0,
        outer_fail  = 0,
        three_made  = 0,
        three_fail  = 0,
        total       = 0;

    for (var p in msgs) {
        var msg = msgs[p];
        if (msg.person_id == playerId) {
            var str = msg.description;
            //内线得分
            if (str.indexOf("上篮") != -1 || str.indexOf("扣篮") != -1) {
                if (msg.msg_type == 1) {
                    inside_made++;
                } else {
                    inside_fail++;
                }
            //三分
            } else if (str.indexOf("跳投") != -1 && str.indexOf("三分") != -1) {
                if (msg.msg_type == 1) {
                    three_made++;
                } else {
                    three_fail++;
                }
            //中投
            } else {
                if (msg.msg_type == 1) {
                    outer_made++;
                } else {
                    outer_fail++;
                }
            }
            total++;
        }
    }
    return {
        inside_made : inside_made,
        inside_total : (inside_made + inside_fail),
        three_made : three_made,
        three_total : (three_made + three_fail),
        outer_made : outer_made,
        outer_total: (outer_made + outer_fail),
        total_mode : (inside_made + three_made + outer_made),
        total_total : total
    }
}
var getOption2 = function(opt){
    var options = {
		hostname : "nba.sports.sina.com.cn", //"http://nba.sports.sina.com.cn/player.php?id=4923"
		port : 80,
		path : opt.path + opt.query,
		method : 'GET'
	};
    return options;
}
var detail = {
    getAge : function(dom){
        var trinfo = $(dom).find("tr").eq(0);
        var age = $(trinfo).find("td").eq(4).text().trim().match(/^\d+/);
        return parseInt(age[0]);
    },
    getHeightAndWidght: function(dom){
        var trinfo = $(dom).find("tr").eq(2);
        var height = trinfo.find("td").eq(1).text().trim();
        var weight = trinfo.find("td").eq(3).text().trim();
        console.log(height);
        console.log(weight);
        var ret = {
            height : parseFloat(height.match(/^\d+\.\d+/)[0]),
            weight : parseFloat(weight.match(/^\d+/)[0]),
        }
        return ret;
    
    },
    getPosition : function(text){
        var positionText = text.replace(/\s+/g, "");
        var positionArr = positionText.split("|");
        var position = positionArr[3];
        return position;
    },
    getName : function(text){
        var positionText = text.replace(/\s+/g, "");
        var positionArr = positionText.split("|");
        var position = positionArr[4];
        return position;
    }
};

var GbetId, GteamId, GplayerId;
function jQuery17107460152705809892_1386511547443(json){
    var msg = json.result.data.pbp_msgs;
    console.log("========= " + GbetId + "|" + GteamId +"|" + GplayerId + " start========");
    //存在没比赛，为空的情况.
    if(msg.length == 0){
        console.log("have no msg.")
    } else{
        
        var teamIntance = new Team();
        teamIntance.getTeamDataByFilter(function(err, result){
        if(result.length > 0){
            var item = result[0];
            var TeamId = item._id;
            var onData = item.on || [];
            if(onData.length > 0){
               /* 
                var playerScore;
                onData.forEach(function(player){
                    if(player.player_id == GplayerId){
                        var score = calcPlayScore(msg, GplayerId);
                        playerScore = $.extend(player, score);
                        playerScore.matchId = GbetId;
                    }
                });
                var teamIntance = new Team();
                teamIntance.updateMemberData({id : TeamId, match : playerScore}, function(result){
                        console.log("script end.");
                });*/
                console.log(GplayerId);
                var memberIntance = new Member();
                memberIntance.getPositionByIds([GplayerId], function(err, memPositions){
                    console.log(memPositions);
                    //如果球员表里有这个球员
                    if(memPositions.length > 0){
                        var playerScore;
                        memPositions.forEach(function(memPosition){
                            onData.forEach(function(player){
                                if(GplayerId == player.player_id){
                                    var score = calcPlayScore(msg, GplayerId);
                                    playerScore = $.extend(player, score);
                                    playerScore.deafultposition = memPosition.position;
                                    playerScore.matchId = GbetId;
                                }
                            });
                            
                        });
                    
                        console.log(playerScore);
                        var teamIntance = new Team();
                        teamIntance.updateMemberData({id : TeamId, match : playerScore}, function(result){
                                console.log("script end.");
                        });
                    } else {
                        console.log("to get member...");
                        var opt = {
                            path : "/player.php?",
                            query : "id=" + GplayerId
                        };
                        var options = getOption2(opt);
  
                        request(options, function(html){
                            console.log("get member html success!....");
                            var text = $(html).find("#left div").eq(0).text();
                            var infoTable = $(html).find("#left div").eq(1);
                            var info = detail.getHeightAndWidght(infoTable);
                            
                            var MemberData = {};
                            MemberData.weight = info.weight;
                            MemberData.height = info.height;
                            MemberData.teamId = TeamId;
                            MemberData.age = detail.getAge(infoTable);
                            MemberData._id = GplayerId;
                            MemberData.playerId = GplayerId;
                            MemberData.position = detail.getPosition(text);
                            MemberData.playerName = detail.getName(text);
                            
                            console.log(MemberData);
                            
                            var memberIntance = new Member();
                            memberIntance.save(MemberData, function(err, result){
                                console.log("member "+ GplayerId +" save success!!")
                            });
                            
                        });
                    }
                });
                
             } else{
                console.log("have not on...");
             }

        } else{
            console.log("have no result..");
        }            
        },{betId : GbetId, teamId: GteamId});
        
    }
}
var getOption = function(opt){
    var options = {
		hostname : "api.sports.sina.com.cn",
		port : 80,
		path : opt.path + opt.query,
		method : 'GET'
	};
    return options;
}

var FixedData = function(config, callback){
    if(config.betId && config.teamId && config.playerId){
        GbetId  = config.betId;
        GteamId = config.teamId;
        GplayerId = config.playerId;
        var opt = {
            path : "/pbp/?",
            query : "callback=jQuery17107460152705809892_1386511547443&mid="+ GbetId +"&format=json&source=show&eid=0&_=" + (new Date().getTime())
        };
        
        var options = getOption(opt);
        request(options, function(jsonp){
            eval(jsonp);
            callback();
        });
    } else{
        console.log("need arguments.");
    }
}
exports.Fixed = FixedData;