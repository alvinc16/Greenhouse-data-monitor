/**
 *如果是默认参数，就可以不传
 * @param method 请求的方法
 * @param url 请求的地址
 * @param data 发送的数据
 * @param success 数据请求成功以后，需要处理的业务逻辑 也就是一个函数块
 */

function ajax(obj) {
    var xhr = null;
    try{
        xhr = new XMLHttpRequest();
    }catch (e) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (obj.method === 'get'){
        obj.method = "get";
        if(obj.data){
            obj.url = obj.url + "?" + obj.data;
        }
        xhr.open(obj.method,obj.url,true);
        xhr.send();
    }else if(obj.method === "post"){
        xhr.open(obj.method,obj.url,true);
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xhr.send(obj.data);
    }else {
        console.log("请求方式不正确");
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200){
            var data = JSON.parse(xhr.responseText);
            obj.success && obj.success(data);
        }
    }
}