var Team = require("../db/team");
var Member = require("../db/meber");
var Match = require("../db/match");
var $ = require("jquery");

function Player(){}; 
Player.prototype = {
    getTeamById : function(opt, callback){
        var self = this;
        this.id = opt.id;
        var memberIntance = new Member();
        memberIntance.getMemberById(opt.id, function(err, result){
            var teamId = result.teamId;
            var filter = {
               Type: 2,
               timestamp : {
                  $lt: (new Date().getTime())
               },
               $or : [{hostId:teamId}, {guestId : teamId}]
            };
            self.getMatchsByTeamInfo(filter, {sort:{timestamp:-1}, limit:20}, callback);
        });
    },
    getMatchsByTeamInfo : function(filter, sort, callback){
        var self = this;
        var matchDBIntance = new Match();
        matchDBIntance.getMatchsByFilter(filter, sort, function(err, matchs){
            var matchIds = [];
            matchs.forEach(function(match){
                matchIds.push(match.betId);
            });
            self.getMatchsWithPlayId(matchIds, callback);
        });
    },
    getMatchsWithPlayId : function(ids, callback){
        var teamDBIntance = new Team();
        teamDBIntance.getTeamDataByMatchIds(ids, function(err, result){
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
module.exports = player;