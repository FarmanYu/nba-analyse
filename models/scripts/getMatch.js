var Match = require("../db/match");
var db = require("../lib/db");
var util = require("../lib/util");
var request = require("../lib/request").get;
var urlParser = require("url");
var $ = require("jquery");

//http://nba.sports.sina.com.cn/match_result.php?day=0&years=2012&months=02&teams=

var getOption = function(opt){
    var urlQuery = ["day=", (opt.day||0),
                    "&years=", (opt.year||2013),
                    "&months=", (opt.months|| ""),
                    "&teams=" + (opt.teams||"")].join("");
    var options = {
		hostname : "nba.sports.sina.com.cn",
		port : 80,
		path : "/match_result.php?" + urlQuery,
		method : 'GET'
	};
    return options;
}
var getter = {
    start : function(opt){
        var options = getOption(opt);
        var self = this;
        request(options, function(html){
            console.log("get Matchs html success..");
            var matchlist = $(html).find("#table980middle table");
            var macthStr = matchlist.html();
            //有的时段可能数据为空..即非赛季，就是没有数据..
            
            /*
            betId   时间年月日+主场id
            Time   2013-05-07 9:00
            hostId   主场Id
            guestId   客场Id
            hostScore 主场得分
            GuestScore 客场ID
            Desc     分析描述    
            Type    比赛类型 A：常规赛  B：季后赛
            */
            if(macthStr != ""){
                
                var matchTRS = matchlist.find("tr");
                var date, hour, time;
                var macthArray = [];
                if(matchTRS.size() > 0){
                    console.log("matchs parse success!");
                }
                matchTRS.each(function(idx, item){
                    if($(item).attr("bgcolor") == "#FFD200"){
                        var dateStr = $(item).find("td").eq(0).html();
                        date = util.formatTime(dateStr.match(/月(\d+)日/)[1]);
                    } else{
                        var hourStr = $(item).find("td").eq(0).html();
                        var matchItem = {};
                        hour = hourStr.match(/^\d+:\d+/);
                        time = self.getTime(opt, date, hour);
                        matchItem.time = time;
                        matchItem.timestamp = self.getTimestamp(time);
                        matchItem.betId = self.getBetId(item);
                        matchItem._id = matchItem.betId;
                        matchItem.hostId = self.getHostId(item);
                        matchItem.guestId = self.getGuestId(item);
                        matchItem.hostScore = self.getHostScore(item);
                        matchItem.GuestScore = self.getGuestScore(item);
                        matchItem.Type = self.getType(item);
                        matchItem.Desc = "";
                        macthArray.push(matchItem);
                    }
                });
                var matchIntance = new Match();
                matchIntance.save(macthArray, function(err, result){
                    console.log(result.length + " data insert success!!");
                });
            } else{
                console.log("has no result!");
            }
            

        });
    },
    getTimestamp : function(sDate){
        console.log(sDate);
        return new Date(sDate).getTime();
    },
    getBetId : function(dom){
        var scoreTd = $(dom).find("td").eq(3);
        var href = scoreTd.find("a").attr("href");
        var betIds = href.match(/\d+$/);
        return parseInt(betIds[0]);
    },
    getTime:function(opt, date, hour){
        return opt.year + "-" + opt.months + "-" + date + " " + hour;
    },
    getHostId : function(dom){
        var hostTd = $(dom).find("td").eq(4);
        var href = hostTd.find("a").attr("href");
        var HostIds = href.match(/\d+$/);
        return parseInt(HostIds[0]);
    },
    getGuestId : function(dom){
        var GuestIdTD = $(dom).find("td").eq(2);
        var href = GuestIdTD.find("a").attr("href");
        var GuestIds = href.match(/\d+$/);
        return parseInt(GuestIds[0]);
    },
    getHostScore : function(dom){
        var ScoreTD = $(dom).find("td").eq(3);
        var scores = ScoreTD.find("a").html();
        var scoreArr = scores.split("-");
        return parseInt(scoreArr[1], 10);
    },
    getGuestScore : function(dom){
        var ScoreTD = $(dom).find("td").eq(3);
        var scores = ScoreTD.find("a").html();
        var scoreArr = scores.split("-");
        return parseInt(scoreArr[0], 10);
    },
    getType: function(dom){
        var typehtml = $(dom).find("td").eq(1).html().trim();
        var type = 1;
        switch(typehtml){
            case "季前赛" : 
                type = 1;
                break;
            case "常规赛" :
                type = 2;
                break;
            case "季后赛" :
                type = 3;
                break;
        }
        return type;
    }
    
}

var test = {
    year : 2013,
    months : 12
};
getter.start(test);
