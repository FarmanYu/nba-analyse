
function teamsCtrl($scope, $http, $location, basketAnalysis) {
	var path = $location.$$path;
	$scope.hostId = path.split("/")[2];
	$scope.guestId = path.split("/")[3];
	$scope.teamId = path.split("/")[2];

	$scope.player = {
		"list" : [],
		"teamPeople" : "all",
		"list_callback" : function (data) {
			$scope.player.list = data;
		},
		"refreshPlayerList" : function () {
			basketAnalysis.playerList($scope.player.list_callback, $scope.teamId);
		}
	};
	basketAnalysis.playerList($scope.player.list_callback, $scope.hostId);

	var x = 0;
	$scope.team = {
		"count" : 10,
		"type" : "host",
		"player_list" : [],
		"joins" : "on",
		"gameDatas" : [],
		"refreshGameDatas" : function (data) {
			var newData = $scope.transformation.player(data);
			$scope.transformation.numberOfShots(newData);
		},
		"query" : function () {
			basketAnalysis.gameContent(this.refreshGameDatas, $scope.teamId, this.count, this.type);
		},
		"refreshGame" : function (data) {
			var newData = $scope.transformation.player(data);
			//$scope.teams[x-1].data=newData;
			$scope.transformation.additional(newData);

		},
		"queryAll" : function () {
			if (x > 30) {
				x = 0;
			}
			var teams = $scope.teams;
			x++;
			basketAnalysis.gameContent($scope.team.refreshGame, x, $scope.team.count, $scope.team.type);
		},
		"playerError" : function (betId, teamId, playerId) { //异常处理，球员数据不存在
			basketAnalysis.playerError(betId, teamId, playerId);
		}
	}
	$scope.transformation = {
		"getTargetType" : function (type) {
			if (type == "host") {
				return "guest";
			} else {
				return "host";
			}
		},
		"Contrast_1_categories" : [],
		"Contrast_1_series_guard" : [],
		"Contrast_1_series_forwards" : [],
		"Contrast_2_series_guard" : [],
		"Contrast_2_series_forwards" : [],
		"Contrast_1_series_total" : [],
		"Contrast_2_series_total" : [],
		"guard_inside_made" : [],
		"guard_inside_total" : [],
		"guard_outer_made" : [],
		"guard_outer_total" : [],
		"guard_three_made" : [],
		"guard_three_total" : [],
		"forwards_inside_made" : [],
		"forwards_inside_total" : [],
		"forwards_outer_made" : [],
		"forwards_outer_total" : [],
		"forwards_three_made" : [],
		"forwards_three_total" : [],
		"free_total" : [],
		"numberOfShots" : function (data) { //出手次数总和

			var total = {
				"self" : {},
				"target" : {}
			};
			var selfGuard = selfForwards = targetGuard = targetForwards = 0; //出手
			var selfGuardScore = selfForwardsScore = targetGuardScore = targetForwardsScore = 0; //得分
			var selfGuard_insideMade = selfGuard_insideTotal = selfGuard_outerMade = selfGuard_outerTotal = selfGuard_threeMade = selfGuard_threeTotal = 0;
			var targetGuard_insideMade = targetGuard_insideTotal = targetGuard_outerMade = targetGuard_outerTotal = targetGuard_threeMade = targetGuard_threeTotal = 0;
			var selfForwards_insideMade = selfForwards_insideTotal = selfForwards_outerMade = selfForwards_outerTotal = selfForwards_threeMade = selfForwards_threeTotal = 0;
			var targetForwards_insideMade = targetForwards_insideTotal = targetForwards_outerMade = targetForwards_outerTotal = targetForwards_threeMade = targetForwards_threeTotal = 0;
			var guardFree = forwardsFree = 0;
			var targetType = this.getTargetType($scope.team.type);
			for (var i = 0; i < data.length; i++) {
				if (data[i] == null) {
					console.log("有比赛未抓到");
				} else {
					var selfData = data[i][$scope.team.type];
					var targetData = data[i][targetType];
					total.self.name = selfData.teamName;
					total.target.name = "对手";
					for (var j = 0; j < selfData.on.length; j++) {
						if (selfData.on[j].deafultposition == undefined) {

							//alert("位置参数没有");
							console.log(selfData.on[j]);
							$scope.team.playerError(selfData.betId, selfData.teamId, selfData.on[j].player_id);
						} else {
							var position = selfData.on[j].deafultposition.split("/")[0];
							if (position == "后卫") {
								selfGuard += selfData.on[j].inside_total + selfData.on[j].outer_total + selfData.on[j].three_total + parseInt(selfData.on[j].free.split("-")[1] / 2);
								selfGuardScore += selfData.on[j].points;
								selfGuard_insideMade += selfData.on[j].inside_made;
								selfGuard_insideTotal += selfData.on[j].inside_total;
								selfGuard_outerMade += selfData.on[j].outer_made;
								selfGuard_outerTotal += selfData.on[j].outer_total;
								selfGuard_threeMade += selfData.on[j].three_made;
								selfGuard_threeTotal += selfData.on[j].three_total;
								guardFree += parseInt(selfData.on[j].free.split("-")[0]);
							} else {
								selfForwards += selfData.on[j].inside_total + selfData.on[j].outer_total + selfData.on[j].three_total + parseInt(selfData.on[j].free.split("-")[1] / 2);
								selfForwardsScore += selfData.on[j].points;
								selfForwards_insideMade += selfData.on[j].inside_made;
								selfForwards_insideTotal += selfData.on[j].inside_total;
								selfForwards_outerMade += selfData.on[j].outer_made;
								selfForwards_outerTotal += selfData.on[j].outer_total;
								selfForwards_threeMade += selfData.on[j].three_made;
								selfForwards_threeTotal += selfData.on[j].three_total;
								forwardsFree += parseInt(selfData.on[j].free.split("-")[0]);
							}
						}

					}
					for (var j = 0; j < targetData.on.length; j++) {
						if (targetData.on[j].deafultposition == undefined) {
							//alert("位置参数没有");
							console.log(targetData.on[j]);
							$scope.team.playerError(targetData.betId, targetData.teamId, targetData.on[j].player_id);
						} else {
							var position = targetData.on[j].deafultposition.split("/")[0];
							if (position == "后卫") {
								targetGuard += targetData.on[j].inside_total + targetData.on[j].outer_total + targetData.on[j].three_total + parseInt(targetData.on[j].free.split("-")[1] / 2);
								targetGuardScore += targetData.on[j].points;
								targetGuard_insideMade += targetData.on[j].inside_made;
								targetGuard_insideTotal += targetData.on[j].inside_total;
								targetGuard_outerMade += targetData.on[j].outer_made;
								targetGuard_outerTotal += targetData.on[j].outer_total;
								targetGuard_threeMade += targetData.on[j].three_made;
								targetGuard_threeTotal += targetData.on[j].three_total;
							} else {
								targetForwards += targetData.on[j].inside_total + targetData.on[j].outer_total + targetData.on[j].three_total + parseInt(targetData.on[j].free.split("-")[1] / 2);
								targetForwardsScore += targetData.on[j].points;
								targetForwards_insideMade += targetData.on[j].inside_made;
								targetForwards_insideTotal += targetData.on[j].inside_total;
								targetForwards_outerMade += targetData.on[j].outer_made;
								targetForwards_outerTotal += targetData.on[j].outer_total;
								targetForwards_threeMade += targetData.on[j].three_made;
								targetForwards_threeTotal += targetData.on[j].three_total;
							}
						}

					}
				}

			}
			//投篮
			$scope.transformation.Contrast_1_categories.push(total.self.name);
			$scope.transformation.Contrast_1_categories.push(total.self.name + "的" + total.target.name);
			$scope.transformation.Contrast_1_series_guard.push(selfGuard / data.length, targetGuard / data.length);
			$scope.transformation.Contrast_1_series_forwards.push(selfForwards / data.length, targetForwards / data.length);
			$scope.transformation.Contrast_1_series_total.push(selfGuard / data.length + selfForwards / data.length, targetGuard / data.length + targetForwards / data.length);
			//比分
			$scope.transformation.Contrast_2_series_guard.push(selfGuardScore / data.length, targetGuardScore / data.length);
			$scope.transformation.Contrast_2_series_forwards.push(selfForwardsScore / data.length, targetForwardsScore / data.length);
			$scope.transformation.Contrast_2_series_total.push(selfGuardScore / data.length + selfForwardsScore / data.length, targetGuardScore / data.length + targetForwardsScore / data.length);
			//后卫得分
			$scope.transformation.guard_inside_made.push(selfGuard_insideMade / data.length, targetGuard_insideMade / data.length);
			$scope.transformation.guard_inside_total.push(selfGuard_insideTotal / data.length, targetGuard_insideTotal / data.length);
			$scope.transformation.guard_outer_made.push(selfGuard_outerMade / data.length, targetGuard_outerMade / data.length);
			$scope.transformation.guard_outer_total.push(selfGuard_outerTotal / data.length, targetGuard_outerTotal / data.length);
			$scope.transformation.guard_three_made.push(selfGuard_threeMade / data.length, targetGuard_threeMade / data.length);
			$scope.transformation.guard_three_total.push(selfGuard_threeTotal / data.length, targetGuard_threeTotal / data.length);
			//内线得分
			$scope.transformation.forwards_inside_made.push(selfForwards_insideMade / data.length, targetForwards_insideMade / data.length);
			$scope.transformation.forwards_inside_total.push(selfForwards_insideTotal / data.length, targetForwards_insideTotal / data.length);
			$scope.transformation.forwards_outer_made.push(selfForwards_outerMade / data.length, targetForwards_outerMade / data.length);
			$scope.transformation.forwards_outer_total.push(selfForwards_outerTotal / data.length, targetForwards_outerTotal / data.length);
			$scope.transformation.forwards_three_made.push(selfForwards_threeMade / data.length, targetForwards_threeMade / data.length);
			$scope.transformation.forwards_three_total.push(selfForwards_threeTotal / data.length, targetForwards_threeTotal / data.length);
			//罚球
			console.log(total.self.name + "的罚球" + ":" + (guardFree + forwardsFree) / data.length);
			$('.Contrast_1').highcharts({
				chart : {
					type : 'column'
				},
				title : {
					text : '球队内外线得分对比'
				},
				subtitle : {
					text : 'Source: WorldClimate.com'
				},
				xAxis : {
					categories : $scope.transformation.Contrast_1_categories
				},
				yAxis : {
					min : 0,
					title : {
						text : 'Rainfall (mm)'
					}
				},
				tooltip : {
					headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat : '</table>',
					shared : true,
					useHTML : true
				},
				plotOptions : {
					column : {
						pointPadding : 0.2,
						borderWidth : 0
					}
				},
				series : [{
						name : '外线得分',
						data : $scope.transformation.Contrast_2_series_guard
					}, {
						name : '内线得分',
						data : $scope.transformation.Contrast_2_series_forwards
					}, {
						name : '得分总和',
						data : $scope.transformation.Contrast_2_series_total
					}
				]
			})
			$('.Contrast_2').highcharts({
				chart : {
					type : 'column'
				},
				title : {
					text : '球队内外线球权对比'
				},
				subtitle : {
					text : 'Source: WorldClimate.com'
				},
				xAxis : {
					categories : $scope.transformation.Contrast_1_categories
				},
				yAxis : {
					min : 0,
					title : {
						text : 'Rainfall (mm)'
					}
				},
				tooltip : {
					headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat : '</table>',
					shared : true,
					useHTML : true
				},
				plotOptions : {
					column : {
						pointPadding : 0.2,
						borderWidth : 0
					}
				},
				series : [{
						name : '外线出手次数',
						data : $scope.transformation.Contrast_1_series_guard
					}, {
						name : '内线出手次数',
						data : $scope.transformation.Contrast_1_series_forwards
					}, {
						name : '总出手次数',
						data : $scope.transformation.Contrast_1_series_total
					}
				]
			})
			$('.Contrast_0').highcharts({
				chart : {
					type : 'column'
				},
				title : {
					text : '内外线得失分'
				},
				subtitle : {
					text : 'Source: WorldClimate.com'
				},
				xAxis : {
					categories : $scope.transformation.Contrast_1_categories
				},
				yAxis : {
					min : 0,
					title : {
						text : 'Rainfall (mm)'
					}
				},
				tooltip : {
					headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat : '</table>',
					shared : true,
					useHTML : true
				},
				plotOptions : {
					column : {
						pointPadding : 0.2,
						borderWidth : 0
					}
				},
				series : [{
						name : '后卫内线',
						data : $scope.transformation.guard_inside_made
					}, {
						name : '后卫内线',
						data : $scope.transformation.guard_inside_total
					}, {
						name : '后卫中投',
						data : $scope.transformation.guard_outer_made
					}, {
						name : '后卫中投',
						data : $scope.transformation.guard_outer_total
					}, {
						name : '后卫3分',
						data : $scope.transformation.guard_three_made
					}, {
						name : '后卫3分',
						data : $scope.transformation.guard_three_total
					}
				]
			})

			$('.Contrast_6').highcharts({
				chart : {
					type : 'column'
				},
				title : {
					text : '内外线得失分'
				},
				subtitle : {
					text : 'Source: WorldClimate.com'
				},
				xAxis : {
					categories : $scope.transformation.Contrast_1_categories
				},
				yAxis : {
					min : 0,
					title : {
						text : 'Rainfall (mm)'
					}
				},
				tooltip : {
					headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat : '</table>',
					shared : true,
					useHTML : true
				},
				plotOptions : {
					column : {
						pointPadding : 0.2,
						borderWidth : 0
					}
				},
				series : [{
						name : '前/中锋内线',
						data : $scope.transformation.forwards_inside_made
					}, {
						name : '前/中锋内线',
						data : $scope.transformation.forwards_inside_total
					}, {
						name : '前/中锋中投',
						data : $scope.transformation.forwards_outer_made
					}, {
						name : '前/中锋中投',
						data : $scope.transformation.forwards_outer_total
					}, {
						name : '前/中锋3分',
						data : $scope.transformation.forwards_three_made
					}, {
						name : '前/中锋3分',
						data : $scope.transformation.forwards_three_total
					}, {
						name : '罚球',
						data : $scope.transformation.forwards_free_total
					}
				]
			})
		},
		"teamNames" : [],
		"series_off" : [], //前场篮板
		"series_ass" : [], //助攻
		"series_ste" : [], //抢断
		"series_blo" : [], //盖帽
		"series_turn" : [], //失误
		"additional" : function (data) {
			var off = ass = ste = blo = turn = 0;
			var len = data.length;
			if (len == 0) {
				return false;
			}
			for (var i = 0; i < len; i++) {
				if (data[i] == null) {
					console.log("有比赛未抓到");
				} else {
					if (x == 1 || x == 11 || x == 21) {
						this.teamNames = [];
						this.series_off = []; //前场篮板
						this.series_ass = []; //助攻
						this.series_ste = []; //抢断
						this.series_blo = []; //盖帽
						this.series_turn = []//失误
					}
					var obj = data[i][$scope.team.type];
					off += obj.total.off;
					ass += obj.total.ass;
					ste += obj.total.ste;
					blo += obj.total.blo;
					turn += obj.total.turn;
				}
			}
			var teamName = data[0][$scope.team.type].teamName;
			$scope.transformation.teamNames.push(teamName);
			this.series_off.push(off / len);
			this.series_ass.push(ass / len);
			this.series_ste.push(ste / len);
			this.series_blo.push(blo / len);
			this.series_turn.push(turn / len);
			if (x <= 10) {
				additional($(".Contrast_3"), this.teamNames, this.series_off, this.series_ass, this.series_ste, this.series_blo, this.series_turn);
			} else if (x > 10 && x <= 20) {
				additional($(".Contrast_4"), this.teamNames, this.series_off, this.series_ass, this.series_ste, this.series_blo, this.series_turn);
			} else if (x > 20) {
				additional($(".Contrast_5"), this.teamNames, this.series_off, this.series_ass, this.series_ste, this.series_blo, this.series_turn);
			}
			if (x <= 30) {
				$scope.team.queryAll();
			}
		},
		"player" : function (data) { //球员晒算（最近）
			var newData = [];
			var player = $scope.player.teamPeople;
			if (player == "all") {
				newData = data;
			} else {

				if ($scope.team.joins == "on") {

					for (var i = 0; i < data.length; i++) {
						var flog = false;
						var teams = data[i][$scope.team.type].on;
						for (var j = 0; j < teams.length; j++) {
							if (teams[j].player_id == player) {
								flog = true;
							}
						}
						if (flog) {
							newData.push(data[i]);
						}
					}

				} else if ($scope.team.joins == "off") {
					for (var i = 0; i < data.length; i++) {
						var flog = false;
						var teams = data[i][$scope.team.type].off;
						if (teams != undefined) {
							for (var j = 0; j < teams.length; j++) {
								if (teams[j].player_id == player) {
									flog = true;
								}
							}
						}
						if (flog) {
							newData.push(data[i]);
						}
					}
				}

				//this.numberOfShots(newData);
			}
			return newData;
		}
	}
}

function additional(ele, name, off, ass, ste, blo, turn) {
	ele.highcharts({
		chart : {
			type : 'column'
		},
		title : {
			text : 'Monthly Average Rainfall'
		},
		subtitle : {
			text : 'Source: WorldClimate.com'
		},
		xAxis : {
			categories : name
		},
		yAxis : {
			min : 0,
			title : {
				text : 'Rainfall (mm)'
			}
		},
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [{
				name : '前场篮板',
				data : off
			}, {
				name : '助攻',
				data : ass
			}, {
				name : '抢断',
				data : ste
			}, {
				name : '盖帽',
				data : blo
			}, {
				name : '失误',
				data : turn
			}
		]
	})

}
