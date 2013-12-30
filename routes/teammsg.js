var Teamext = require("../models/db/teamext");
var util = require("../models/lib/util");
var urlParse = require("url").parse;
var queryString = require("querystring");

var golbalConf = {
    idwarnnig : "id 不合法！",
    savesuccess : "保存成功.",
    delsuccess : "删除成功"
}

exports.save = function(req, res){
   var id = parseInt(req.param('id'));
   var msg = req.param('msg') || "";
   if(!isNaN(id)){
     var ext = {
        teamId : id,
        msg : msg
     };
     var teamextDBIntance = new Teamext();
     teamextDBIntance.save(ext, function(err, msgInfo){
        res.send(msgInfo.teamId + " " + golbalConf.savesuccess);
     });
   } else{
     res.send(golbalConf.idwarnnig);
   }
}
exports.get = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var teamId  = parseInt(params.teamid);
   
   if(!isNaN(teamId)){
     var teamextDBIntance = new Teamext();
     teamextDBIntance.getMsgById(teamId, function(err, msgs){
        res.send({"data": msgs});
     });
   } else{
     res.send(golbalConf.idwarnnig);
   }
}

exports.del = function(req, res){
   var query = urlParse(req.url).query;
   var params = queryString.parse(query);
   var id  = params.id;
   var teamId  = parseInt(params.teamid);
   
   if(!isNaN(teamId) && id.length > 0){
     var ids = {
        id : id,
        teamId : teamId
     };
     var teamextDBIntance = new Teamext();
     teamextDBIntance.delMsgByIds(ids, function(err, count){
        res.send(count + " "+ golbalConf.delsuccess);
     });
   } else{
     res.send(golbalConf.idwarnnig);
   }
}