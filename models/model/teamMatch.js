var Team = require("../db/team");
var Match = require("../db/match");
var $ = require("jquery");

function TeamMatch(){}; 
TeamMatch.prototype = {
    getTeamMatchByTeamInfo : function(opt, callback){
        var self = this;
        var teamId = opt.teamId;
        var type = opt.type;
        var timestamp = opt.timestamp;
        var count = opt.count;;
        
        var filter = {
           Type: 2,
           timestamp : {
              $lt: timestamp
           }
        };
        if(type == "host"){
            filter.hostId = teamId;
        } else if(type == "guest"){
            filter.guestId = teamId;
        } else{
            filter.$or = [{hostId:teamId}, {guestId : teamId}];
        }
        self.getMatchsByTeamInfo(filter, {sort:{timestamp:-1}, limit:count}, callback);

    },
    getMatchsByTeamInfo : function(filter, sort, callback){
        var self = this;
        var matchDBIntance = new Match();
        matchDBIntance.getMatchsByFilter(filter, sort, function(err, matchs){
            var matchIds = [];
            matchs.forEach(function(match){
                matchIds.push(match.betId);
            });
            self.getTeamsbyMatchId(matchIds, callback);
        });
    },
    getTeamsbyMatchId : function(ids, callback){
        var teamDBIntance = new Team();
        teamDBIntance.getTeamDataByMatchIds(ids, function(err, result){
            console.log(result.length);
            var matchData = [];
            result.forEach(function(team){
                ids.forEach(function(macthId, idx){
                    if(macthId == team.betId){
                        matchData[idx] = matchData[idx] || {};
                        matchData[idx][team.type] = team;
                    }
                });
            });
            callback(err, matchData);
        });
    }
};
module.exports = TeamMatch;