var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var querystring = require('querystring');
//连接数据库
var connection = mysql.createConnection({
    host     :'localhost',
    user     :'root',
    password :'19980604',
    database :'Greenhouse',
    timezone: "SYSTEM",
});
connection.connect(function (err) {
    if (err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

//创建服务器
var app = http.createServer(function (req,res) {
    // res.setHeader("content-type","text/html;charset=utf-8");
    var url_obj = url.parse(req.url);
    var path = '.' + url_obj.pathname;
    console.log(req.url);
    console.log(path);
    if(req.url === "/"){
        render('./index.html',res);
        return;
    }
    else if(req.url === '/main.html'){
        res.setHeader('content-type','text/html;charset=utf-8');
        res.write("请从登录页面进入,嘿嘿！");
        res.end();
    }
    else if (req.url === '/1519379791'){
        fs.readFile('./main.html','binary',function (err,data) {
            if(!err){
                res.write(data,'binary');
                res.end();}})
    }
    else if(url_obj.pathname === '/login' && req.method === 'POST'){
        var user_info = '';
        req.on('data',function (chunk) {
            user_info += chunk;
        });
        req.on('end',function (err) {
            // console.log(user_info);
            res.setHeader('content-type','text/html;charset=utf-8');
            var user_obj = querystring.parse(user_info);
            // var user_obj = JSON.parse(user_info);
            console.log(user_obj);
            if(!err){
                var sql = 'SELECT * FROM admin WHERE username="'+user_obj.username+'" AND password="'+user_obj.password+'"';
                connection.query(sql,function (error,result) {
                    if (!error && result.length !== 0){
                        res.write('{"status":0,"message":"登录成功"}');
                    }else{
                        console.log(error,result);
                        res.write('{"status":1,"message":"用户名或密码不正确"}');
                    }
                    res.end();
                })
            }

        })
    }
    else if(url_obj.pathname === '/chart' && req.method === 'GET'){
        res.setHeader('content-type','text/html;charset=utf-8');
        var sql_data = "SELECT * FROM House1 ORDER BY time DESC LIMIT 10;";
        connection.query(sql_data,function (error,result) {
            console.log("请求ing");
            // console.log(result);
            // console.log(result[2].time);
            var date1 = [];
            var data_time = [];
            var data_airT = [];
            var data_airHR = [];
            var data_soilT = [];
            var data_soilHR = [];
            var data_CO2 = [];
            var data_Light = [];
            for (var i=0;i<result.length;i++){
                var x = result.length - i -1;
                date1[i] = new Date(result[x].time);
                data_airT[i] = result[x].airT;
                data_airHR[i] = result[x].airHR;
                data_soilT[i] = result[x].soilT;
                data_soilHR[i] = result[x].soilHR;
                data_CO2[i] = result[x].CO2;
                data_Light[i] = result[x].Llght;
                data_time[i] = date1[i].getHours() +":"+ date1[i].getMinutes()+":"+ date1[i].getSeconds();
            }
            // console.log(data_time);
            var chart_json = {
                data_json : [
                    {"data" : data_airT,  "name" : "空气温度"},
                    {"data" : data_airHR, "name" : "空气湿度"},
                    {"data" : data_soilT, "name" : "土壤温度"},
                    {"data" : data_soilHR,"name" : "土壤湿度"},
                    {"data" : data_CO2,   "name" : "二氧化碳浓度"},
                    {"data" : data_Light, "name" : "光照强度"},
                ],
                xcontent : data_time
            }
            chart_string = JSON.stringify(chart_json);
            // console.log(chart_string);
            res.write(chart_string);
            res.end();
        })
    }
    else render(path,res);//其他get请求响应，返回请求的文件


    //if(req.url)
});
app.listen(3000);


//response 数据
function render(path,res){
    fs.readFile(path,'binary',function (err,data) {
        if(!err){
            res.write(data,'binary');
            res.end();
        }
    })
}