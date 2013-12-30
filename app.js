
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var teammsg = require('./routes/teammsg');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('env', 'development');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/list', routes.list);
app.get('/getmatch', routes.getMatch);
app.get('/player', routes.player);
app.get('/query', routes.query);
app.get('/getteamdata', routes.getTeamData);
app.get('/scorefix', routes.scorefix);
app.get('/getteammatch', routes.getTeamMatchs);
app.get('/getplayinfo', routes.getPlayInfo);
app.get('/teammsgpost', teammsg.save);
app.get('/teammsgread', teammsg.get);
app.get('/teammsgdel', teammsg.del);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
