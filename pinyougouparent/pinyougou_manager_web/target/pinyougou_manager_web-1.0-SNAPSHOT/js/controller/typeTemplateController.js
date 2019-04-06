 //控制层 
app.controller('typeTemplateController' ,function($scope,$controller,typeTemplateService,brandService,specificationService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		typeTemplateService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		typeTemplateService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		typeTemplateService.findOne(id).success(
			function(response){
				$scope.entity= response;

				//需要将查询出来的字符串转换为json对象
                $scope.entity.brandIds=  JSON.parse($scope.entity.brandIds);//转换品牌列表
                $scope.entity.specIds=  JSON.parse($scope.entity.specIds);//转换规格列表
                $scope.entity.customAttributeItems= JSON.parse($scope.entity.customAttributeItems);//转换扩展属性

            }
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=typeTemplateService.update( $scope.entity ); //修改  
		}else{
			serviceObject=typeTemplateService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.flag){
					alert("成功");
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
		typeTemplateService.dele( $scope.delList ).success(
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
		typeTemplateService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	//初始化品牌列表
    $scope.brandList={data:[]};//品牌列表

    //读取品牌列表
    $scope.findBrandList=function(){
        brandService.selectOptionList().success(
            function(response){
                $scope.brandList={data:response};
            }
        );
    }
    //初始化规格列表
    $scope.specificationList={data:[]};//品牌列表
	$scope.findSpecificationList=function () {
		specificationService.findSpecificationList().success(
			function (response) {
                $scope.specificationList={data:response};
        	}
        )
    }



    //新增规格(在点击新建时初始化 该数组，点击增加时 添加{}一个空对象 页面添加一行)
    $scope.addTableRow=function () {
        $scope.entity.customAttributeItems.push({});
    }

    //删除规格(点击删除时 传入索引($index) 在数组中删除该对象)
    $scope.deleTableRow=function (id) {
        var index=$scope.entity.customAttributeItems.indexOf(id); //获取下标在数组中的索引,默认从0开始
        $scope.entity.customAttributeItems.splice(index,1); //根据索引进行删除
    }


});	
