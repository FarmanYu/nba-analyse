var Match = require("../models/db/match");
var Member = require("../models/db/member");
var Team = require("../models/db/team");
var util = require("../models/lib/util");
var teamScore = require("../models/model/teamScore");
var TeamMatch = require("../models/model/teamMatch");
var urlParse = require("url").parse;
var queryString = require("querystring");

/**
 * 首页
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
/**
 * 比赛数据
 */
exports.list = function(req, res){
  
  var query = urlParse(req.url).query;
  var params = queryString.parse(query);
  var filter = {Type: 2};
  var teamId = parseInt(params.teamId, 10);
  var year = parseInt(params.year, 10);
  var month = parseInt(params.mouth, 10);
  
  if(!isNaN(teamId)){
     switch(params.hostType){
        case "all":
            filter.$or = [{hostId:teamId}, {guestId : teamId}];
            break;
        case "guest":
            filter.guestId = teamId;
            break;
        case "host":
            filter.hostId = teamId;
            break;
     }
  }
  var limitDay, limitMonth, limitYear,
      MaxDay, MaxMonth, MaxYear;
  switch(month){
      case 1:
        limitDay = 31;
        limitMonth = 12;
        limitYear = year-1;
        MaxDay = 31;
        MaxMonth = 1;
        MaxYear = year;
        break;
     case 12:
        limitDay = 1;
        limitMonth = 12;
        limitYear = year;
        MaxDay = 1;
        MaxMonth = 1;
        MaxYear = year+1;
        break;
    default:
        limitDay = 1;
        limitMonth = month;
        limitYear = year;
        MaxDay = 31;
        MaxMonth = month;
        MaxYear = year;
        break;
  }
  var LimitTime = limitYear + "-" + util.formatTime(limitMonth) + "-" + util.formatTime(limitDay);
  var MaxTime   = MaxYear   + "-" + util.formatTime(MaxMonth)   + "-" + util.formatTime(MaxDay);

  filter.timestamp = {
    $gt : new Date(LimitTime).getTime(),
    $lt : new Date(MaxTime).getTime()
  };
  console.log(filter);
  var matchIntance = new Match();
  matchIntance.getAllData(function(err, result){
     res.send({"data" : result});
  }, filter);
}
/**
 * 获取最新比赛数据
 */
exports.getMatch = function(req, res){
    var query = urlParse(req.url).query;
    var params = queryString.parse(query);
    
    var start = parseInt(params.start) || (new Date().getTime());
    var count = parseInt(params.count) || 10;
    var now  = util.dateFormat("Y-m-d", start);
    start = new Date(now + " 23:59:59").getTime();
    var filter = {Type: 2};
    filter.timestamp = {
        $gt : start
    };
    console.log(filter);
    console.log(count);
    
    var matchIntance = new Match();
    matchIntance.getMatchsByFilter(filter, {sort:{timestamp:1}, limit:count}, function(err, result){
     res.send({"data" : result});
    });
    
}
 
/**
 * 球员数据
 */
exports.player = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var id = parseInt(params.id);
   var memberDBIntance = new Member();
   memberDBIntance.getMembersByTeamId(id, function(err, result){
       res.send({"data" : result});
   });
};
/**
 * 球队数据
 */
exports.query = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var teamId = parseInt(params.teamId);
   var type   = params.type;
   var count  = parseInt(params.count) || 10;
   var filter = {teamId : teamId, type: type};
   var sort = { limit: count, sort : {betId : -1}};
   
   var teamDBIntance = new Team();
   teamDBIntance.getTeamDataByFilter(function(err, result){
      res.send({"data" : result});
   }, filter, sort);
};
/**
 * 球队数据
 */
exports.getTeamData = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var betId = parseInt(params.betId);
   var type  = params.type;
   
   var teamDBIntance = new Team();
   teamDBIntance.getTeamDataByFilter(function(err, result){
       res.send({"data" : result});
   },{ betId : betId, type : type});
}

/**
 * 获取球队最近10场比赛
 * @params
 * {type} 主客场
 * {teamId} 球队
 * @return 
 * data : [
 *    {
 *      "host": {},
 *      "guest" : {}
 *    } 
 * ]
 */
exports.getTeamMatchs = function(req, res){
   var query  = urlParse(req.url).query;
   var params = queryString.parse(query);
   var teamId = parseInt(params.teamId);
   var type   = params.type || "";
   var getTimeStamp = parseInt(params.time);
   var timestamp = isNaN(getTimeStamp) ? (new Date().getTime()) : getTimeStamp;
   var count  = parseInt(params.count) || 10;
   
   var getTeamIntance = new TeamMatch();
   getTeamIntance.getTeamMatchByTeamInfo({
      teamId : teamId,
      type : type,
      timestamp : timestamp,
      count : count
   }, function(msg, result){
      if(result.length > 0){
        res.send(result);
      } else{
        res.send(msg);
      }
   });
}

/**
 * 修复球员信息异常
 * 因为后端存在网络请求，无法传递callback，所以目前为单个异步处理
 */
exports.scorefix = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var betId = parseInt(params.betId);
   var teamId  = parseInt(params.teamId);
   var playerId  = parseInt(params.playerId);
   
   var fixedIntance = teamScore.Fixed({
        betId : betId,
        teamId : teamId,
        playerId : playerId
   }, function(){
        res.send("success");
   });
}
/**
 * 获取球员数据
 */
exports.getPlayInfo = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var playerId  = parseInt(params.id);
}