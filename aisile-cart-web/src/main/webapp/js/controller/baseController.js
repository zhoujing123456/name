/**
 * 
 */
app.controller('baseController',function($scope){
	
	$scope.ids=[];   //封装的批删id的集合
	//复选框选中状态封装成一个数组传到后台进行批量删除
    $scope.updateChecked=function($event,id){
		if($event.target.checked){
			$scope.ids.push(id);
		}else{
			$scope.ids.splice($scope.ids.indexOf(id),1);
		}
		/*if($event.target.checked){
			$scope.ids.push(id);
		} else{
			var idx=$scope.ids.indexOf(id);
			$scope.ids.splice(idx,1);
		}*/
		
	}  
    
    
    
  
	
	
})