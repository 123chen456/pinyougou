//定义模块
var app = angular.module("pinyougou", []);

/*
$sec服务写成过滤器
 */
app.filter('trustHtml',['$sce',function ($sce) {
    return function (data) {
        return $sce.trustAsHtml(data);  //将html文本转换为可以执行的html
    }
}])


