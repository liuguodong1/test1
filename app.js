// 引入模块
const express=require("express");

const path=require("path");

// 引入jq
var $=require("jquery");



const app=express();

// 设置静态文件目录
app.use(express.static(path.resolve(__dirname,"public")))
// 设置ejs模板
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
// 设置post请求解析
app.use(express.urlencoded({extended:true}))
// 解析json格式的数据
app.use(express.json());


/* 前端展示页路由*/

// ①首页展示
app.use("/",require("./routes/sy"))




/**后台管理系统路由 */


// ①后台管理首页登录注册路由
app.use("/admin",require("./routes/admin"));







// 启动服务器
app.listen(3000,()=>{
    console.log("服务器启动成功");
    
})

