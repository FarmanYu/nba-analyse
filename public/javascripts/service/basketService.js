// JavaScript Document
angular.module('dataServices', []).factory('basketList', function ($http, $rootScope) {
	var basketList = {};
	basketList.matchList = function (callback, parame) {
		// var parame = $.param(parame);
		$http({
			method : 'get',
			url : '/list?hostType=' + parame.hostType + '&teamId=' + parame.teamId + '&year=' + parame.year + '&mouth=' + parame.mouth
			// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			callback(data.data);

		}).error(function (data, status, headers, config) {
			alert("异常");
		});
	}
	return basketList;
}).factory('basketAnalysis', function ($http, $rootScope) {
	var basketAnalysis = {};
	basketAnalysis.playerList = function (callback, teamId) {
		$http({
			method : 'get',
			url : '/player?id=' + teamId
			// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			callback(data.data);

		}).error(function (data, status, headers, config) {
			alert("异常");
		});
	}
	basketAnalysis.gameContent = function (callback, teamId, count, type) {
		/* $http({
		method: 'get',
		url:'/getteammatch?type='+parame.type+'&teamId='+parame.teamId+'&count='+parame.count+"time="+1386720000000
		// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
		console.log(data);
		callback(data);

		}).error(function (data, status, headers, config) {
		alert("异常");
		});*/
		var nowTime = new Date("2013-12-18").getTime();
		$http({
			method : 'get',
			url : '/getteammatch?type=' + type + '&teamId=' + teamId + '&count=' + count + "&time=" + nowTime
			// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			var dataArr = [];
			dataArr.push(data);
			callback(data);

		}).error(function (data, status, headers, config) {
			alert("异常");
		});
	}
	basketAnalysis.getTeamData = function (callback, betId, type, index) {
		$http({
			method : 'get',
			url : '/getteamdata?type=' + type + '&betId=' + betId
			// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			callback(data.data, index);

		}).error(function (data, status, headers, config) {
			alert("异常");
			callback("", index);
		});
	}
	basketAnalysis.playerError = function (betId, teamId, playerId) {
		$http({
			method : 'get',
			url : '/scorefix?betId=' + betId + '&teamId=' + teamId + '&playerId=' + playerId
			// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			// callback(data.data,index);

		}).error(function (data, status, headers, config) {
			alert("异常");
		});
	}
	return basketAnalysis;
})
