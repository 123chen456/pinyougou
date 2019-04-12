app.service('contentService',function ($http) {
    this.findByCategoryId=function (categoryId) {
        return $http.get("../content/findByCategoryId.do?categoryId="+categoryId)
    }
    this.delete =function (delList) {
        return $http.get("../content/delContent.do?ids="+delList);
    }
})