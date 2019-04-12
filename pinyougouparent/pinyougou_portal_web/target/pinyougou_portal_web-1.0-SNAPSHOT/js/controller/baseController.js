app.controller('baseController',function ($scope) {
    //分页控件配置   里面的每个值被修改了都会重新加载
    $scope.paginationConf={
        currentPage:1, //当前页码
        totalItems:0,  //总条数
        itemsPerPage:10,	//默认每页显示数量
        perPageOptions: [10, 20, 30, 40, 50],
        onChange:function () {	//更改页码触发事件
            $scope.reloadList()//重新加载
        }

    }

    //重新加载列表数据  searchEntity.specName
    $scope.reloadList=function () {
        //切换页码
        //$scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
        $scope.delList=[];      //页码改变，id数组清空
        $scope.select_all=false;//页码改变，父复选框清除样式
    }

    //批量删除(定义一个id数组,判断复选框的状态,往数组里添加值,删除值,进行提交)
    $scope.delList=[];
    $scope.updateDelList=function ($event,id) {
        if($event.target.checked){//为true,则放入数组中
            $scope.delList.push(id);
        }else{
            var index=$scope.delList.indexOf(id); //获取下标在数组中的索引,默认从0开始
            $scope.delList.splice(index,1); //根据索引进行删除
        }
    }

    //全选操作(判断是否进行全选,全选则将分页查询出来的本页数据!!!!!!($scope.list)遍历取出id,放入id数组内)
    $scope.selectAll=function ($event) {
        $scope.delList=[];//清空数组
        if($event.target.checked){
            for (var i=0;i<$scope.list.length;i++){
                $scope.delList.push($scope.list[i].id)
            }
        }
    }

    //根据传入的参数 提取出json字符串中的特定属性(将字符串转为对象,然后对象[属性名])进行提取
    $scope.jsonStringPickType=function (jsonString,key) {
        var json=JSON.parse(jsonString);//将json字符串转换为json对象
        var value="";
        for(var i=0;i<json.length;i++){
            if(i>0){
                value+=","
            }
            value+=json[i][key];
        }
        return value;
    }

})