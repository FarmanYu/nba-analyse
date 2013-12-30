var Member = require("../db/member");
var Team = require("../db/team");

/*
var dbintance = new Team();
dbintance.save({
    betId : 11111111,
    _id : 11111111
}, function(err, result){
    console.log(result.length + "is insert...");
})*/
/*
var dbintance = new Team();
dbintance.getTeamDataBybetId(2013100500, function(err, result){
    console.log(err, result);
});
*/

var teamIntance = new Team();
teamIntance.getTeamDataById("2013121301_1", function(err, result){
    console.log(result);
});