app.service('brandService',function ($http) {
    //添加品牌
    this.add=function (entity) {
        return $http.post('../brand/add.do',entity)
    }
    //修改品牌
    this.update=function (entity) {
        return $http.post('../brand/update.do',entity)
    }
    //根据id查出品牌
    this.findOne=function (id) {
        return $http.get('../brand/findOneById.do?id='+id);
    }
    //删除品牌
    this.del=function (delList) {
        return $http.get('../brand/delBrand.do?ids='+delList)
    }
    //条件查询
    this.searchMethod=function (page,rows,searchEntity) {
        return $http.post('../brand/search.do?page='+page+'&rows='+rows,searchEntity)
    }
    //下拉列表数据
    this.selectOptionList=function(){
        return $http.get('../brand/selectOptionList.do');
    }

});