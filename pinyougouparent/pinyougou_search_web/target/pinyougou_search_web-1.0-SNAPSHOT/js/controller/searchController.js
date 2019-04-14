app.controller("searchController",function($scope, $location, searchService){
	
	$scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':'','pageNo':1,'pageSize':40,'sort':'','sortField':''};//搜索对象
	//{"keywords":"三星","category":"手机","brand":"","spec":{"网络":"移动4G","机身内存":"32G"}}
	
	$scope.search=function(){
		$scope.searchMap.pageNo= parseInt($scope.searchMap.pageNo);//修改一下pageNo类型否则后台可能会按字符串处理
		searchService.search($scope.searchMap).success(
			function(response){
				$scope.resultMap=response;
				//查询后显示第一页(该方案不行) 应加到搜索按钮前面 ng-click="searchMap.pageNo=1;search()">搜索</button>
				//$scope.searchMap.pageNo=1;
				//构建分页栏
				buildPageLabel();
			}
		)
	}
	
	buildPageLabel=function(){
		//构建分页栏
		$scope.pageLabel=[];//新增分页栏属性	
		
		var firstPage=1;//开始页码
		var lastPage=$scope.resultMap.totalPages;//得到最后页码
		
		$scope.firstDot=true;//前面有点
		$scope.lastDot=true;//后面有点
		
		if($scope.resultMap.totalPages > 5){//如果页码数量大于5
			if($scope.searchMap.pageNo <= 3){//如果当前页码小于3，显示前5页
				lastPage=5;
				$scope.firstDot=false;
			}else if($scope.searchMap.pageNo >= $scope.resultMap.totalPages-2){//显示后5页
				firstPage=$scope.resultMap.totalPages-4;
				$scope.lastDot=false;
			}else{//显示以当前页为中心的5页
				firstPage=$scope.searchMap.pageNo-2;
				lastPage=$scope.searchMap.pageNo+2;
			}
		}else{
			$scope.firstDot=false;
			$scope.lastDot=false;
		}
		//循环产生页码标签	
		for(var i=firstPage;i<=lastPage;i++){
			$scope.pageLabel.push(i);
		}
	}
	
	//根据页码查询
	$scope.queryByPage=function(pageNo){
		//页码验证
		if(pageNo<1 || pageNo>$scope.resultMap.totalPages){
			return;
		}		
		$scope.searchMap.pageNo=pageNo;			
		$scope.search();
	}
	
	//判断当前页为第一页
	$scope.isTopPage=function(){
		if($scope.searchMap.pageNo==1){
			return true;
		}else{
			return false;
		}
	}
	//判断当前页是否未最后一页
	$scope.isEndPage=function(){
		if($scope.searchMap.pageNo==$scope.resultMap.totalPages){
			return true;
		}else{
			return false;
		}
	}
	
	//排序查询
	$scope.sortSearch=function(sortField,sort){
		$scope.searchMap.sortField=sortField;	
		$scope.searchMap.sort=sort;	
		$scope.search();
	}
	
	//价格排序--模仿京东--自己写的
	var sortOrder = "DESC";
	$scope.priceSortSearch=function(){
		$scope.searchMap.sortField='price';
		if(sortOrder=='ASC'){
			sortOrder = 'DESC';
			$("#updown").html("↓");
		}else{
			sortOrder = "ASC";
			$("#updown").html("↑");
		}
		$scope.searchMap.sort=sortOrder;	
		$scope.search();
	}

	//添加搜索项
	$scope.addSearchItem=function(key,value){
		if(key=='category' || key=='brand' || key=='price'){//如果点击的是分类或者是品牌
			$scope.searchMap[key]=value;
		}else{
			$scope.searchMap.spec[key]=value;
		}
		$scope.search();//查询
	}
	
	//撤销搜索项
	$scope.removeSearchItem=function(key){
		if(key=='category' || key=='brand' || key=='price'){//如果点击的是分类或者是品牌
			$scope.searchMap[key]="";
		}else{
			delete $scope.searchMap.spec[key];
		}	
		$scope.search();//查询
	}
	
	
	//判断关键字是不是品牌
    // $scope.searchMap.keywords：三星小米手机
    // $scope.resultMap.brandList联想 三星 华为 OPPO 小米 苹果 魅族 360 VIVO 诺基亚 锤子
	$scope.keywordsIsBrand=function(){
		for(var i=0;i<$scope.resultMap.brandList.length;i++){
			if($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text)>=0){//如果包含
				return true;
			}			
		}		
		return false;
	}
	//加载查询字符串
	$scope.loadkeywords=function(){
		$scope.searchMap.keywords=  $location.search()['keywords'];
		$scope.search();
	}

})