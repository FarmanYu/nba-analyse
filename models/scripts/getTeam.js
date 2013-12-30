var Match = require("../db/match");
var Team = require("../db/team");
var request = require("../lib/request").get;
var $ = require("jquery");

/**
 * http://api.sports.sina.com.cn/stats/player?format=json&mid=2013102515&callback=nba_jsonp_dpc_cb_fn_stats_player&dpc=1
 */
var getOption = function(opt){
    var options = {
		hostname : "api.sports.sina.com.cn",
		port : 80,
		path : opt.path + opt.query,
		method : 'GET'
	};
    return options;
}
function getId(betId, teamId){
    return betId + "_" + teamId;
}
var golbalBetId = 0, golbalTimestamp;

function nba_jsonp_dpc_cb_fn_stats_player(json){
    //console.log("======jsonpData was back!=======");
    var data = json.result.data;
    //比赛没开始，存在没有结果的情况.
    if(data.length == 0){
        console.log(golbalBetId +" : have not match data!");
        getter.index ++;
        getter.start.call(getter);
    } else{
        var allData = [];
        var hostData = {};
        hostData.betId = golbalBetId;
        hostData.timestamp = golbalTimestamp;
        hostData.type = "host";
        hostData = $.extend(hostData, data[hostData.type]);
        hostData.teamId = parseInt(hostData.team_info.team_id);
        hostData.teamName = hostData.team_info.team_name;
        hostData._id = getId(golbalBetId, hostData.teamId);
        delete hostData.team_info;
        allData.push(hostData);
        
        var guestData = {};
        guestData.betId = golbalBetId;
        guestData.timestamp = golbalTimestamp;
        guestData.type = "guest";
        guestData = $.extend(guestData, data[guestData.type]);
        guestData.teamId = parseInt(guestData.team_info.team_id);
        guestData.teamName = guestData.team_info.team_name;
        guestData._id = getId(golbalBetId, guestData.teamId);
        delete guestData.team_info;
        allData.push(guestData);
        
        var teamIntance = new Team();
        teamIntance.save(allData, function(err, result){
            console.log(result.length + " line is insert...");
            getter.index ++;
            getter.start.call(getter);
        });
    }
    
    
}
var getter = {
    start : function(){
        var self = this;
        var len = this.allmatchs.length - 1;
        var index = this.index;
        
        if(index > len){
            console.log("script run end!!!");
            return;
        }
       
        var betId = this.allmatchs[index] ? this.allmatchs[index].betId : -1;
        golbalTimestamp = this.allmatchs[index].timestamp;
        golbalBetId = betId;
        console.log("-----------index: "+ index + " betid:"+ betId +" was start--------------");
        
        
        var opt = {
            path : "/stats/player?",
            query : "format=json&mid=" + betId +"&callback=nba_jsonp_dpc_cb_fn_stats_player&dpc=1"
        };
        var options = getOption(opt);
        request(options, function(jsonp){
            eval(jsonp);
        });
        
        /*
        var teamIntance = new Team();
        teamIntance.hasTeamDataBybetId(betId, function(hasTeam){
            if(hasTeam || betId == -1){
                //console.log(self.allmatchs[self.index]);

                getter.index ++;
                getter.start.call(getter);
                
            } else{
                var opt = {
                    path : "/stats/player?",
                    query : "format=json&mid=" + betId +"&callback=nba_jsonp_dpc_cb_fn_stats_player&dpc=1"
                };
                var options = getOption(opt);
                request(options, function(jsonp){
                    eval(jsonp);
                });
            }
        });
        */
        
    }
}

var matchIntance = new Match();
matchIntance.getAllData(function(err, allmatchs){
    getter.allmatchs = allmatchs;
    getter.index = 0;
    getter.start();
}, {
     timestamp : { 
        $gt: (new Date("2013-12-19 00:00:00").getTime()),
        $lt: (new Date("2013-12-21 23:59:59").getTime())
     }
    }
 
);




