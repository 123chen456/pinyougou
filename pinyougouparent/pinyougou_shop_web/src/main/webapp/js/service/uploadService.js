app.service('uploadService',function ($http) {
    this.uploadFile=function () {
        //新建form对象
        var formData=new FormData();
        //添加页面中input中type为file的到form中
        formData.append("file",file.files[0]);
        return $http({
            method:'POST',
            url:"../upload.do",
            data:formData,
            headers:{'Content-Type':undefined},//设置为undefined,浏览器会帮我们自动设置为multipart/form-data
            transformRequest:angular.identity  //序列化我们的formdata object.
        });
    }
});