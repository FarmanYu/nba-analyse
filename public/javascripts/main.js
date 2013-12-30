// JavaScript Document
var webApp = angular.module("basketBall", ["directives", "dataServices"]);
webApp.controller("mainCtrl", function ($scope, $http, $location, basketList) {
	$scope.teams = [{
			"id" : 1,
			"name" : "老鹰"
		}, {
			"id" : 2,
			"name" : "凯尔特人"
		}, {
			"id" : 3,
			"name" : "黄蜂"
		}, {
			"id" : 4,
			"name" : "公牛"
		}, {
			"id" : 5,
			"name" : "骑士"
		}, {
			"id" : 6,
			"name" : "小牛"
		}, {
			"id" : 7,
			"name" : "掘金"
		}, {
			"id" : 8,
			"name" : "活塞"
		}, {
			"id" : 9,
			"name" : "勇士"
		}, {
			"id" : 10,
			"name" : "火箭"
		}, {
			"id" : 11,
			"name" : "步行者"
		}, {
			"id" : 12,
			"name" : "快船"
		}, {
			"id" : 13,
			"name" : "湖人"
		}, {
			"id" : 14,
			"name" : "热火"
		}, {
			"id" : 15,
			"name" : "雄鹿"
		}, {
			"id" : 16,
			"name" : "森林狼"
		}, {
			"id" : 17,
			"name" : "篮网"
		}, {
			"id" : 18,
			"name" : "尼克斯"
		}, {
			"id" : 19,
			"name" : "魔术"
		}, {
			"id" : 20,
			"name" : "76人"
		}, {
			"id" : 21,
			"name" : "太阳"
		}, {
			"id" : 22,
			"name" : "开拓者"
		}, {
			"id" : 23,
			"name" : "国王"
		}, {
			"id" : 24,
			"name" : "马刺"
		}, {
			"id" : 25,
			"name" : "雷霆"
		}, {
			"id" : 26,
			"name" : "爵士"
		}, {
			"id" : 27,
			"name" : "奇才"
		}, {
			"id" : 28,
			"name" : "猛龙"
		}, {
			"id" : 29,
			"name" : "灰熊"
		}, {
			"id" : 30,
			"name" : "山猫"
		}
	];
}).config(
	['$routeProvider', function ($routeProvider) {
			$routeProvider.
			when('/list', {
				templateUrl : 'view/list.html'
			}).
			when('/detail/:betId', {
				templateUrl : 'view/detail.html'
			}).
			when('/analysis/:hostId/:guestId', {
				templateUrl : 'view/analysis.html'
			}).
			when('/teams/:hostId/:guestId', {
				templateUrl : 'view/teams.html'
			}).
			otherwise({
				redirectTo : '/list'
			});
		}
	])
