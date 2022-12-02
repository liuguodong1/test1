const express=require("express");

const router=express.Router();

const path=require("path");
const fs=require("fs/promises");

var multiparty=require("multiparty");

const mongo=require('mongodb');

var MongoClient =  mongo.MongoClient;

// Connection url
var url = 'mongodb://localhost:27017/2207';


// 管理员数据信息
const USERS = [
    {
        username: "admin",
        password: "123123",
        nickname: "超级管理员"
    },
    {
        username: "刘国栋",
        password: "123",
        nickname: "saber的master"
    }
]



var loginResult;

// 配置后台管理首页路由
router.get("/",(req,res)=>{
    res.render("admin_login")
})

// 配置登录后台系统路由
router.post("/login",(req,res)=>{
    // 获取登录信息
    const username=req.body.username;
    const password=req.body.password;
           
    // 判断管理员身份
    loginResult=USERS.find(item=>{
        return item.username==username && item.password==password
    });
   
    // 有这个管理员信息，允许登录
    if(loginResult){
           res.redirect("/admin/list")
    }else{
        res.send("用户名或者密码错误")
    }

})



// 配置访问后台管理系统首页路由
router.get("/list",(req,res,next)=>{
                next();
    });
    

// 添加商品路由

 router.post('/list/upload',(req, res)=> {

    // 实例化
    var form = new multiparty.Form();
 //   配置上传图片的存放路径
   form.uploadDir ="./public/upload"

    form.parse(req, function(err, fields, files) {

      
    // 上传商品图片的标题
        const imgName=fields.imgName[0];

    // 上传商品图片的路径(处理成相对路径)
    var res1=files.imgPath[0].path.replace(/\\/g,"/");

    var index=res1.indexOf("/");

    
    const  imgPath="http://localhost:3000"+res1.substring(index);
    
    // 上传图片价格
    const price=fields.price[0];

// 连接数据库，把新的商品信息添加进去
MongoClient.connect(url, function(err, db) {
        
           if(err){
              console.log("连接失败");
           }else{
              
      
              //  向数据库中插入数据
          db.collection("users").insert({
            title:imgName,
            pic:imgPath,
            price:price
          });
          console.log("添加成功");
  //  上传完新商品信息之后重新渲染商品列表页面
    res.redirect("/admin/list");

           }
         // 关闭数据库
         db.close();
        })
    })
  
  })



// 删除商品路由
router.get('/list/delete',(req,res)=>{

    const id=req.query.id;
// 拼接id
const where={"_id":mongo.ObjectId(id)};



MongoClient.connect(url, function(err, db) {
     if(err){
        console.log("连接失败");
     }else{
        console.log("连接成功");

        // 根据商品id查找商品图片路径
     db.collection("users").find(where).toArray((err,data)=>{
            if(err){
                console.log("查询失败");
            }else{
              
            //   查询到商品图片路径进行本地删除
            
            const index=data[0].pic.indexOf("upload");
             const imgpath=data[0].pic.substring(index);
             console.log(imgpath);
     fs.rm(path.resolve(__dirname, `../public/`+imgpath), { recursive: true })
     .then(r => {
         console.log("删除本地成功");
        
     })
            }
        })

    
    db.collection("users").remove(where,(err)=>{
        if(err){
            console.log("删除失败");
        }else{

            console.log("删除数据库成功");
            res.redirect("/admin/list")
         
            
        }
    })
     }
   // 关闭数据库
   db.close();
  })
})

 // 访问数据库获取数据进行渲染中间件
router.use((req,res)=>{
 
  MongoClient.connect(url, function(err, db) {
           
    if(err){
       console.log("连接失败数据库");
    }else{
       console.log("连接数据库成功");

       //  向数据库中插入数据find({sex:1})括号里可以加查询条件
   db.collection("users").find({}).toArray((err,data)=>{
       if(err){
           console.log("查询失败");
       }else{
   
         res.render("admin_List",{login:loginResult,product:data})
       }
   })
    }
  // 关闭数据库
  db.close();
 })  
})

// 暴露路由
module.exports=router;