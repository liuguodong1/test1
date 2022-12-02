const express=require("express");

const router=express.Router();

// 首页展示路由
router.get("/",(req,res)=>{

    res.render("index")
})

// 注册页面路由
router.get("/resign",(req,res)=>{
    res.render("resign")
})
module.exports=router;