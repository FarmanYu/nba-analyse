var Member = require("../db/member");
var request = require("../lib/request").get;
var $ = require("jquery");

/**
 *  list :   http://nba.sports.sina.com.cn/players.php?dpc=1
 *  detail : http://nba.sports.sina.com.cn/player.php?id=3730
 */
var getOption = function(opt){
    var options = {
		hostname : "nba.sports.sina.com.cn",
		port : 80,
		path : opt.path + opt.query,
		method : 'GET'
	};
    return options;
}
var getter = {
    list : function(opt){
        var options = getOption(opt);
        var self = this;
        request(options, function(html){
            console.log("get menber list html success..");
            var memberlist = $(html).find("#table980middle table");
            var memberStr = memberlist.html();
            
            /**
             * playerId      球员ID
             * playerName    球员名称
             * height        身高
             * weight        体重
             * position      比赛位置
             * teamId        所处球队ID
             * teamName      所在球队名称
             */
            if(memberStr != ""){
                
                var memberTRS = memberlist.find("tr");
                var teamId, teamName;
                var MemberData = [];
                if(memberTRS.size() > 0){
                    console.log("members parse success!");
                }
                memberTRS.each(function(idx, item){
                    if($(item).attr("id") != "playerslist"){
                        teamId = self.getTeamID(item);
                        teamName = self.getTeamName(item);
                    } else{
                        var players = $(item).find("a");
                        players.each(function(idx, aItem){
                            var href = $(aItem).attr("href");
                            var text = $(aItem).html();
                        
                            var memberItem = {};
                            memberItem.teamId = teamId;
                            memberItem.teamName = teamName;
                            memberItem.playerName = text;
                            memberItem.playerId = self.getPlayerId(href);
                            memberItem._id = self.getPlayerId(href);
                            
                            MemberData.push(memberItem);
                        });
                        
                    }
                });
                var memberIntance = new Member();
                memberIntance.save(MemberData, function(err, result){
                    console.log(result.length + " player was success....");
                    
                    memberIntance = new Member();
                    memberIntance.getAllData(function(err, allmember){
                        getter.allmember = allmember;
                        getter.index = 0;
                        getter.detail();
                    });
                });
            } else{
                console.log("has no result!");
            }
            

        });
    },
    detail : function(){
        var len = this.allmember.length;
        if(this.index > (len - 1)){
            return;
        }
        var self = this;
        var index = this.index;
        var id = this.allmember[index].playerId;
        console.log("-------------index:" + index + " | "+ id +" is start!!!---------------------");
        
        var opt = {
            path : "/player.php?",
            query : "id=" + id
        };
        var options = getOption(opt);
        
        request(options, function(html){
            console.log("get member html success!....");
            var text = $(html).find("#left div").eq(0).text();
            var infoTable = $(html).find("#left div").eq(1);
            var info = self.getHeightAndWidght(infoTable);
            
            var MemberData = {};
            MemberData.weight = info.weight;
            MemberData.height = info.height;
            MemberData.age = self.getAge(infoTable);
            
            MemberData.position = self.getPosition(text);

            var memberIntance = new Member();
            memberIntance.updateByIdSetInfo(id, MemberData);
            self.index++;
            self.detail.call(self);
        });
    },
    getTeamID : function(dom){
        var a = $(dom).find("td a");
        var href = a.attr("href");
        var teamIds = href.match(/\d+$/);
        return parseInt(teamIds[0]);
    },
    getTeamName : function(dom){
        var a = $(dom).find("td a");
        return a.html();
    },
    getPlayerId : function(text){
        var playerIds = text.match(/\d+$/);
        return parseInt(playerIds[0]);
    },
    getAge : function(dom){
        var trinfo = $(dom).find("tr").eq(0);
        var age = $(trinfo).find("td").eq(4).text().trim().match(/^\d+/);
        return parseInt(age[0]);
    },
    getHeightAndWidght: function(dom){
        var trinfo = $(dom).find("tr").eq(2);
        var height = trinfo.find("td").eq(1).text().trim();
        var weight = trinfo.find("td").eq(3).text().trim();

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
    }
}


// 获取球员列表数据
var test = {
    path : "/players.php?",
    query : "dpc=1"
};
getter.list(test);


//更新数据
/**
var memberIntance = new Member();
memberIntance.getAllData(function(err, allmember){
    getter.allmember = allmember;
    getter.index = 0;
    getter.detail();
});
*/


    



