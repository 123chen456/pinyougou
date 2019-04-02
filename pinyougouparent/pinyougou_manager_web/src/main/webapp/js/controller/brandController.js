app.controller('brandController',function ($scope,$http,brandService) {

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

    //重新加载列表数据
    $scope.reloadList=function () {
        //切换页码
        //$scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
        $scope.searchMethod($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
    }

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
    //全选操作(判断是否进行全选,全选则将分页查询出来的本页数据($scope.list)便利取出id,放入id数组内)
    $scope.selectAll=function ($event) {
        $scope.delList=[];//清空数组
        if($event.target.checked){
            for (var i=0;i<$scope.list.length;i++){
                $scope.delList.push($scope.list[i].id)
            }
        }
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
    $scope.searchMethod=function (page,rows) {
        brandService.searchMethod(page,rows,$scope.searchEntity).success(function (response) {
            $scope.list=response.rows;
            $scope.paginationConf.totalItems=response.tatal;//更新总记录数量
        });
    }
})