app.controller('brandController',function ($scope,$controller,brandService) {
    $controller('baseController',{$scope:$scope});//伪继承

    //分页
    /*$scope.findPage=function (page, rows) {
        $http.get('../brand/findPage.do?page='+page+'&rows='+rows+"&t="+new Date().getTime()).success(function (response) {
            $scope.list=response.rows;
            $scope.paginationConf.totalItems=response.tatal;//更新总记录数量
        });
    }*/

    //保存品牌
    $scope.save=function () {
        var object=null;
        if ($scope.entity.id!=null){
            object=brandService.update($scope.entity);
        }else{
            object=brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if (response.flag){
                    $scope.reloadList();
                }else{
                    alert(response.message);
                }
            }
        )
    }

    //修改品牌(先根据id查询出来brand,然后点击保存时调用save()方法,通过请求参数字符串拼接 执行add()或者update()方法)
    $scope.findOne=function (id) {
        brandService.findOne(id).success(function (response) {
            $scope.entity=response;
        })
    }



    $scope.del=function () {
        if($scope.delList.length==0){
            alert("请选择")
        }else{
            if(confirm("确定删除")){
                brandService.del($scope.delList).success(function (response) {
                    if (response.flag){
                        $scope.reloadList();
                        $scope.delList=[];//清空数组
                    }else{
                        $scope.delList=[];//清空数组
                        alert(response.message);
                    }
                })
            }
        }
    }

    $scope.searchEntity={};//初始化一下 否则为null
    //条件查询(分页)
    $scope.search=function (page,rows) {
        brandService.searchMethod(page,rows,$scope.searchEntity).success(function (response) {
            $scope.list=response.rows;
            $scope.paginationConf.totalItems=response.tatal;//更新总记录数量
        });
    }

})