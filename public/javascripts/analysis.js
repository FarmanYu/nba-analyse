// JavaScript Document
function analysisCtrl($scope,$http,$location,basketAnalysis){
	var path=$location.$$path;
	$scope.hostId=path.split("/")[2];
	$scope.guestId=path.split("/")[3];
	$scope.teamId=path.split("/")[2];
	$scope.player={
		 "list":[],
		 "table":[],
		 "list_callback":function(data){
		        $scope.player.list=data;
	      },
		  "add":function(player){
			    $scope.player.table.push(player);  
		  },
		  "del":function(index){
			   $scope.player.table.splice(index,1) 
		  },
		  "refreshPlayerList":function(){
			    basketAnalysis.playerList($scope.player.list_callback,$scope.teamId);  
		  },
		  "getHeightStyle":function(h){
			    if(h>=2.13){
				   return "red";	
				}else{
				    return "";	
				}
		  }
	};   
	basketAnalysis.playerList($scope.player.list_callback,$scope.hostId);
	$scope.game={
		"count":10,
		"type":"host",
		"gameContentList":[],
		"opponentData":{},
		"teamPeople":"all",
		"joins":"on",
		"position":"中锋/前锋",
		"showPosition":function(p){
			  var position=p.deafultposition;
		      if($scope.game.position=="中锋/前锋"){
				      if(position.split("/")[0].indexOf("中锋")!=-1 || position.split("/")[0].indexOf("前锋")!=-1  ){
						   return true  
					  }else{
						    return false;  
					  }
			   }else if($scope.game.position=="后卫"){
				      if(position.split("/")[0].indexOf("后卫")!=-1){
						   return true  
					  }else{
						    return false;  
					  }
			    }else{
				     return true;	
				}
		},
		"refreshGameContentList":function(data){
			 $scope.game.gameContentList=data;
		},
		"query":function(){
			   basketAnalysis.gameContent(this.refreshGameContentList,$scope.teamId,this.count,this.type);
		 },
		 "opponent":function(betId,type,index){
			  if(type=="host"){
				  type="guest";  
			  }else if(type=="guest"){
				   type="host";  
			  }
			  basketAnalysis.getTeamData($scope.game.refreshOpponentList,betId,type,index);
		},
		"refreshOpponentList":function(data,index){
			 var inside_made_total=inside_total=outer_made_total=outer_total=three_made_total=three_total=0;
			 var data=data[0];
			 for(var j=0;j<data.on.length;j++){
				 if(data.on[j].inside_made==undefined){
				      $scope.game.playerError(data.betId,data.teamId,data.on[j].player_id);	 
				 }
				 inside_made_total+=data.on[j].inside_made;
				 inside_total+=data.on[j].inside_total;
				 outer_made_total+=data.on[j].outer_made;
				 outer_total+=data.on[j].outer_total;
				 three_made_total+=data.on[j].three_made;
				 three_total+=data.on[j].three_total;
			}
			data.total.inside_made_total=inside_made_total;
			data.total.inside_total=inside_total;
			data.total.outer_made_total=outer_made_total;
			data.total.outer_total=outer_total;
			data.total.three_made_total=three_made_total;
			data.total.three_total=three_total;
			 $scope.game.opponentData=data;
			 $table=$(".opponent_total").eq(index).parents("table");
			 $(".opponent_total").hide();
			 $(".opponent_list").hide();
			 setTimeout(function(){
			    $table.find(".opponent_total").show();
			    $table.find(".opponent_list").show();					 
			 },300);
			 
		},
		"playerError":function(betId,teamId,playerId){   //异常处理，球员数据不存在
			  basketAnalysis.playerError(betId,teamId,playerId);
		},
		"totals":{
		     "inside_made":0	
		 }
	}
	$scope.team={
		"type":"host",
		"count":10,
		 "query":function(){
			    var teams=$scope.teams;
			    var len=teams.length;
				for(var i=0;i<len;i++){
					var teamId=teams[i].id;
					var o={};
			        o.teamId=teamId;
			        o.count=$scope.team.count;
			        o.type=$scope.team.type;
			        var d=basketAnalysis.gameContent(null,o);
					//console.log(d);
				}
		 }
	}
	$scope.inside_made=0;
	$scope.inside_total=0;
	$scope.inside_total_bio=0;
	$scope.outer_made_total=0;
	$scope.outer_total=0;
	$scope.outer_total_bio=0;
	$scope.three_made=0;
	$scope.three_total=0;
	
	$scope.inside_made_s=0;
	$scope.inside_total_s=0;
	$scope.inside_total_bio_s=0;
	$scope.outer_made_total_s=0;
	$scope.outer_total_s=0;
	$scope.outer_total_bio_s=0;
	$scope.three_made_s=0;
	$scope.three_total_s=0;
}