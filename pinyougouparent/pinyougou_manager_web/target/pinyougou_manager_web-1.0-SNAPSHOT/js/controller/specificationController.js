 //控制层 
app.controller('specificationController' ,function($scope,$controller,specificationService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		specificationService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		specificationService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		specificationService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 entity.specificationOptionList
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.specificationOptionList[0].id!=null){//如果有ID
			serviceObject=specificationService.update( $scope.entity ); //修改  
		}else{
			serviceObject=specificationService.add( $scope.entity );//增加
		}				
		serviceObject.success(
			function(response){
				if(response.flag){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){
		//获取选中的复选框			
		specificationService.dele( $scope.delList ).success(
			function(response){
				if(response.flag){
					$scope.reloadList();//刷新列表
                    alert("删除成功")
					$scope.delList=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象
	
	//搜索
	$scope.search=function(page,rows){			
		specificationService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}


    //新增规格(在点击新建时初始化 该数组，点击增加时 添加{}一个空对象 页面添加一行)
    $scope.addTableRow=function () {
        $scope.entity.specificationOptionList.push({});
    }

    //删除规格(点击删除时 传入索引($index) 在数组中删除该对象)
    $scope.deleTableRow=function (id) {
        var index=$scope.entity.specificationOptionList.indexOf(id); //获取下标在数组中的索引,默认从0开始
        $scope.entity.specificationOptionList.splice(index,1); //根据索引进行删除
    }


});	
