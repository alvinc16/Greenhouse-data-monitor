var mysql = require('mysql');
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
var i = 0;
function write_sql(){
    var date = new Date();
    var date5 = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+ date.getHours() +":"+ date.getMinutes()+":"+date.getSeconds()
    var airT = getRandom2(10,40);
    var airHR = getRandom1(20,80);
    var soilT = getRandom2(10,40);
    var soilHR = getRandom1(20,80);
    var CO2 = getRandom1(20,80);
    var Llght  = getRandom1(0,5000);
    var sql = "INSERT INTO `Greenhouse`.`House1`(`time`, `airT`, `airHR`, `soilT`, `soilHR`, `CO2`, `Llght`) VALUES ('"+date5+"',"+ airT +','+airHR+','+soilT+','+soilHR+','+CO2+','+Llght+');';
    connection.query(sql,function (error,result) {
        // console.log(error);
        if (!error && result){
            console.log("写入成功",i++);
        }
    })
}
//求n-m之间的随机整数 10-30之间的随机整数
function getRandom1(n,m){
    return Math.floor(Math.random()*(m-n+1))+n;
}
//求n-m之间的随机数，加小数
function getRandom2(n,m){
    return Math.random()*(m-n+1)+n;
}
setInterval(write_sql,1000);
