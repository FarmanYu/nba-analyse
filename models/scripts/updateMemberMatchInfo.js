/**
 * 球员比赛数据
 * matchs : [{
betId : 比赛id
minutes : 上场时间

inside : 内线出手次数
inside_mode : 内线出手命中次数
outer : 外线出手次数
outer_mode : 外线出手命中次数
three : 三分出手次数
three_mode : 三分出手命中次数
total : 总出手次数
total_mode :  总命中次数

ass: 失误,
help: 助攻,
cap :盖帽
}]
 *
 */
var Member = require("../db/member");
var Team = require("../db/team");
var Match = require("../db/match");
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
var undefined,
    golbalMatchId;
/**
 *  http://api.sports.sina.com.cn/pbp/?callback=jQuery17107460152705809892_1386511547443&mid=2013110127&format=json&source=show&eid=0&_=1386511553967
 */
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
                var memberIntance = new Member();
                memberIntance.addMatchById({
                    playId : playId,
                    match : matchData,
                    success : function(result){
                        self.index ++;
                        self.start.call(self);
                    },  
                    fail : function(){
                        console.log("save fail...");
                        self.index ++;
                       self.start.call(self);
                    }
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
        getter.index++;
        getter.start();
    }
}
function jQuery17107460152705809892_1386511547443(json){
    var msg = json.result.data.pbp_msgs;
    //存在没比赛，为空的情况.
    if(msg.length == 0){
        saveer.end();
    } else{
        var teamIntance = new Team();
        teamIntance.getTeamDataBybetId(golbalMatchId, function(err, result){
            console.log(result.length);
            
            result.forEach(function(item){
                var onData = item.on;
                onData.forEach(function(player){
                    var playerId = !!(player && player.player_id) ? player.player_id : -1;
                    var score = calcPlayScore(msg, playerId);
                    var playerScore = $.extend(player, score);
                    playerScore.matchId = golbalMatchId;
                    playerScore.player_id = playerId;
                    saveer.memberMatchData.push(playerScore);
                });
                
            });
            saveer.start();
            
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

var getter = {
    start : function(){
        var self = this;
        var index = this.index;
        
        if(index > (self.matchs.length - 1)){
            console.log("this script is run end!!");
            return;
        }
        var matchId = self.matchs[index].betId;
        console.log("--------------"+index+ " : "+ matchId+" was start!-----------------");
        golbalMatchId = matchId;
        if(!matchId){
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
var matchIntance = new Match();
    matchIntance.getAllData(function(err, matchs){
        console.log(matchs.length +" matchs get it.");
        getter.matchs = matchs;
        getter.index = 0;
        getter.start();
        
    },
    { timestamp:{ $lt: (new Date().getTime()) }, Type: 2}
    );
