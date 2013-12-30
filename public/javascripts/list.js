
function listCtrl($scope, $http, $location, basketList) {
	var nowTime = new Date();
	$scope.teamId = "all";
	$scope.year = nowTime.getFullYear();
	$scope.mouth = nowTime.getMonth() + 1;
	if ($scope.mouth < 10) {
		$scope.mouth = "0" + $scope.mouth;
	}
	$scope.hostType = "all";
	$scope.listData = [];
	$scope.showList = function (data) {
		$scope.listData = data;
	}
	$scope.getMatchList = function () {
		var o = {};
		o.year = $scope.year;
		o.mouth = $scope.mouth;
		o.hostType = $scope.hostType;
		o.teamId = $scope.teamId;
		basketList.matchList($scope.showList, o);
	}
	$scope.getMatchName = function (teamId) {
		for (var i = 0; i < $scope.teams.length; i++) {
			if ($scope.teams[i].id == teamId) {
				return $scope.teams[i].name;
				break;
			}
		}
	}
	$scope.getMatchList();
}
