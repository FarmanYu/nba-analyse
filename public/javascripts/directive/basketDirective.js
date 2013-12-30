// JavaScript Document
var directives = angular.module('directives',[]);
directives.directive("ngStatisticsTotal",function(){
   	 return function(scope, elem, attrs){
			scope.total = function(obj){
				//var totals=scope.$parent.game.totals;
				if(scope.$index == 0){
				     scope.$parent.inside_made = 0;
					 scope.$parent.inside_total = 0;
					 scope.$parent.outer_made_total = 0;
					 scope.$parent.outer_total = 0;
					 scope.$parent.outer_total_bio = 0;
					 scope.$parent.inside_total_bio=0;
					 scope.$parent.three_made=0;
	                 scope.$parent.three_total=0;
				}				
				if(scope.$parent.game.position=="所有"){
					 scope.toji(obj)
				}else if(scope.$parent.game.position=="中锋/前锋"){
					 if(obj.deafultposition.split("/")[0].indexOf("中锋")!=-1 || obj.deafultposition.split("/")[0].indexOf("前锋")!=-1){
						  scope.toji(obj)
					  }
				}else if(scope.$parent.game.position=="后卫"){
					 if(obj.deafultposition.split("/")[0].indexOf("后卫")!=-1){
						  scope.toji(obj)
					  }
				}

						
			}
			scope.toji=function(obj){
				  /*if(obj.inside_made==undefined){
				      $scope.game.playerError(data.betId,data.teamId,data.on[j].player_id);	 
				 }*/
				 
				  scope.$parent.inside_made+=obj.inside_made;
				  scope.$parent.inside_total+=obj.inside_total;
				  scope.$parent.outer_made_total+=obj.outer_made;
				  scope.$parent.outer_total+=obj.outer_total;
				  scope.$parent.three_made+=obj.three_made;
				  scope.$parent.three_total+=obj.three_total;
				  scope.$parent.outer_total_bio=(scope.$parent.outer_made_total/scope.$parent.outer_total).toFixed(2);
				  scope.$parent.inside_total_bio=(scope.$parent.inside_made/scope.$parent.inside_total).toFixed(2);
				  scope.$parent.three_total_bio=(scope.$parent.three_made/scope.$parent.three_total).toFixed(2);
		    }
		}
})


directives.directive("ngStatisticsTotalS",function(){
   	 return function(scope, elem, attrs){
			scope.total = function(obj){
				//var totals=scope.$parent.game.totals;
				if(scope.$index == 0){
					 scope.$parent.inside_made_s = 0;
					 scope.$parent.inside_total_s = 0;
					 scope.$parent.outer_made_total_s = 0;
					 scope.$parent.outer_total_s = 0;
					 scope.$parent.outer_total_bio_s = 0;
					 scope.$parent.inside_total_bio_s=0;
					 scope.$parent.three_made_s=0;
	                 scope.$parent.three_total_s=0;
				}				
				if(scope.$parent.game.position=="所有"){
					 scope.toji(obj)
				}else if(scope.$parent.game.position=="中锋/前锋"){
					 if(obj.deafultposition.split("/")[0].indexOf("中锋")!=-1 || obj.deafultposition.split("/")[0].indexOf("前锋")!=-1){
						  scope.toji(obj)
					  }
				}else if(scope.$parent.game.position=="后卫"){
					 if(obj.deafultposition.split("/")[0].indexOf("后卫")!=-1){
						  scope.toji(obj)
					  }
				}

						
			}
			scope.toji=function(obj){
				  scope.$parent.inside_made_s+=obj.inside_made;
				  scope.$parent.inside_total_s+=obj.inside_total;
				  scope.$parent.outer_made_total_s+=obj.outer_made;
				  scope.$parent.outer_total_s+=obj.outer_total;
				  scope.$parent.three_made_s+=obj.three_made;
				  scope.$parent.three_total_s+=obj.three_total;
				  scope.$parent.outer_total_bio_s=(scope.$parent.outer_made_total_s/scope.$parent.outer_total_s).toFixed(2);
				  scope.$parent.inside_total_bio_s=(scope.$parent.inside_made_s/scope.$parent.inside_total_s).toFixed(2);
				  scope.$parent.three_total_bio_s=(scope.$parent.three_made_s/scope.$parent.three_total_s).toFixed(2);
		    }
		}
})