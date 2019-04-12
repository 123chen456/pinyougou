 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
        var id= $location.search()['id'];//获取参数值
	    if (id==null){
	        return ;
        }
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}



	//增加商品
	$scope.add =function () {
        //提取出富文本编辑器中的内容赋到entity里(内容为html语句)
        $scope.entity.goodsDesc.introduction=editor.html();
        goodsService.add( $scope.entity).success(function (response) {
			if(response.flag){
				alert("增加成功")
				$scope.entity={};
                $scope.reloadList();//重新加载
                editor.html("");//清空富文本编辑器
			}else{
				alert(response.message);
			}
        })
    }

	//上传图片
	$scope.uploadFile=function () {
		uploadService.uploadFile().success(function (response) {
			if (response.flag){//上传成功 取出url
				$scope.image_entity.url =response.message;//设置文件地址
			}else{
				alert(response.message);
			}
        }).error(function () {
			alert("上传文件错误")
        })
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}};//定义页面实体结构

    //添加图片列表
	$scope.add_image_entity=function () {
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }
    //从列表中移除图片
	$scope.remove_image_entity=function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index,1);
    }

    //读取一级分类
    $scope.selectItemCat1List=function(){
        itemCatService.findByParentId(0).success(
            function(response){
                $scope.itemCat1List=response;
                $scope.itemCat2List={};
                $scope.itemCat3List={};
                $scope.entity.goods.typeTemplateId="";
            }
        );
    }
    //读取二级目录  $scope.$watch的第一个参数是要监听的变量数据，回调函数里边的第一个参数是新数据，第二个参数是旧数据。
    //如果监听的变量数据是一个对象，那么$scope.$watch还需要加入第三个参数true。
	$scope.$watch('entity.goods.category1Id',function (newValue,oldValue) {
	    if(newValue!=null){
            itemCatService.findByParentId(newValue).success(
                function(response){
                    $scope.itemCat2List=response;
                    $scope.itemCat3List={};
                    $scope.entity.goods.typeTemplateId="";
                }
            );
        }else{
	        return null;
        }

    })
	//读取三级目录
    $scope.$watch('entity.goods.category2Id',function (newValue,oldValue) {
        if (newValue!=null){
            itemCatService.findByParentId(newValue).success(
                function(response){
                    $scope.itemCat3List=response;
                    $scope.entity.goods.typeTemplateId="";
                }
            );
        }else{
            return null;
        }

    })
	//读取三级分类后 读取模板ID
    $scope.$watch('entity.goods.category3Id', function(newValue, oldValue) {
        if (newValue!=null) {
            itemCatService.findOne(newValue).success(
                function (response) {
                    $scope.entity.goods.typeTemplateId = response.typeId; //更新模板ID
                }
            );
        }else{
            return null;
        }
    });

    //模板ID选择后  更新品牌列表
    $scope.$watch('entity.goods.typeTemplateId', function(newValue, oldValue) {
        if(newValue!=null && newValue!=""){
            typeTemplateService.findOne(newValue).success(
                function(response){
                    $scope.typeTemplate=response;//获取类型模板
                    $scope.typeTemplate.brandIds= JSON.parse( $scope.typeTemplate.brandIds);//品牌列表
                    $scope.entity.goodsDesc.customAttributeItems=JSON.parse( $scope.typeTemplate.customAttributeItems);//扩展属性
                }
            );
            //查询规格列表
            typeTemplateService.findSpecList(newValue).success(
                function(response){
                    $scope.specList=response;
                }
            );
        }else{
            return null;
        }

    });

    /**
	 * 规格组合复选框
     * @param $event
     * @param name
     * @param value
     */
	$scope.updateSpecAttribute=function ($event,name, value) {
		var object=$scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,"attributeName",name);
		if (object!=null){
			if ($event.target.checked){//选中
                object.attributeValue.push(value);
			}else{//取消选中
                object.attributeValue.splice( object.attributeValue.indexOf(value) ,1);//移除选项
                //如果选项都取消了，将此条记录移除
				if (object.attributeValue.length==0){
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object),1);
                }
			}
		}else{
            $scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
    }


    //创建SKU列表
    $scope.createItemList=function(){
        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0' } ];//初始
        var items=  $scope.entity.goodsDesc.specificationItems;
        for(var i=0;i< items.length;i++){
            $scope.entity.itemList = addColumn( $scope.entity.itemList,items[i].attributeName,items[i].attributeValue );
        }
    }

    
    //添加列值
    addColumn=function(list,columnName,conlumnValues){
        var newList=[];//新的集合
        for(var i=0;i<list.length;i++){
            var oldRow= list[i];
            for(var j=0;j<conlumnValues.length;j++){
                var newRow= JSON.parse( JSON.stringify( oldRow )  );//深克隆
                newRow.spec[columnName]=conlumnValues[j];
                newList.push(newRow);
            }
        }
        return newList;
    }

    //显示状态
    $scope.status=['未审核','已审核','审核未通过','关闭'];

    $scope.itemCatList=[];//商品分类列表
    //加载商品分类列表
    $scope.findItemCatList=function(){
        itemCatService.findAll().success(
            function(response){
                for(var i=0;i<response.length;i++){
                    $scope.itemCatList[response[i].id]=response[i].name;
                }
            }
        );
    }
    //根据状态查询
    $scope.$watch('searchEntity.auditStatus',function (newValue,oldValue) {
        $scope.reloadList();
    })

});	
