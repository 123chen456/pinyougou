app.controller("contentController",function ($scope, contentService) {
    /**
     * 根据id查询
     * @type {Array}
     */
    $scope.contentList=[];
    $scope.findByCategoryId=function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
            $scope.contentList[categoryId]=response;   //数组里面放集合 不直接赋值 （多种广告）避免覆盖
        })
    }
})

