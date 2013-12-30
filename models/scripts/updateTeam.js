var Member = require("../db/member");
var Team = require("../db/team");
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

var golbalMatchId,
    golbalTeamId;
var saveer = {
    memberMatchData : [],
    index : 0,
    start : function(){
        var self = this;
        if(this.index <= (this.memberMatchData.length - 1)){
            var matchData = this.memberMatchData[this.index];
            var playId = matchData.player_id;
            console.log(playId);
            if(playId && playId !=-1){
                var teamIntance = new Team();
                teamIntance.updateMemberData({id : golbalTeamId, match : matchData}, function(result){
                        self.index ++;
                        self.start.call(self);
                });
            } else{
                self.index ++;
                self.start();
            }
        } else{
            self.end();
        }
    },
    end : function(){
        saveer.memberMatchData = [];
        saveer.index = 0;
        updater.index++;
        updater.start();
    }
}

function jQuery17107460152705809892_1386511547443(json){
    var msg = json.result.data.pbp_msgs;
    //存在没比赛，为空的情况.
    if(msg.length == 0){
        saveer.end();
    } else{
        var teamIntance = new Team();
        teamIntance.getTeamDataById(golbalTeamId, function(err, result){
            console.log(result);
            var onData = result.on || [];
            
            if(onData.length > 0){
                var ids = [];
                onData.forEach(function(player){
                    var playerId = !!(player && player.player_id) ? player.player_id : -1;
                    ids.push(playerId);
                });
                
                var memberIntance = new Member();
                memberIntance.getPositionByIds(ids, function(err, memPositions){
                    if(memPositions.length > 0){
                        memPositions.forEach(function(memPosition){
                            onData.forEach(function(player){
                                var playerId = !!(player && player.player_id) ? player.player_id : -1;
                                if(memPosition._id == playerId){
                                    var score = calcPlayScore(msg, playerId);
                                    var playerScore = $.extend(player, score);
                                    playerScore.deafultposition = memPosition.position;
                                    playerScore.matchId = golbalMatchId;
                                    saveer.memberMatchData.push(playerScore);
                                }
                            });
                            
                        });
                    }
                    saveer.start();
                });
             } else{
                console.log("have not on...");
                saveer.start();
             }
        });
        
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

var updater = {
    start : function(){
        var self = this;
        var index = this.index;
        
        if(index > (self.teams.length - 1)){
            console.log("this script is run end!!");
            return;
        }
        var matchId = self.teams[index].betId;
        golbalMatchId = matchId;
        golbalTeamId = self.teams[index]._id;
        console.log("--------------"+index+ " : "+ matchId +"=="+ golbalTeamId +" was start!-----------------");
        
        
        if(!golbalTeamId){
            console.log("have not match id!");
            return;
        }
        var opt = {
            path : "/pbp/?",
            query : "callback=jQuery17107460152705809892_1386511547443&mid="+ matchId +"&format=json&source=show&eid=0&_=" + (new Date().getTime())
        };
        
        var options = getOption(opt);
        request(options, function(jsonp){
            eval(jsonp);
        });
        
    }
}
var teamIntance = new Team();
teamIntance.getTeamDataByFilter(function(err, result){
    console.log(result.length);
    updater.teams = result;
    updater.index = 0;
    updater.start();
},{
    timestamp : { 
        $gt: (new Date("2013-12-19 00:00:00").getTime()),
        $lt: (new Date("2013-12-21 23:59:59").getTime())
    }
});
console.log("script start.......");

