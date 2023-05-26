const express = require("express");
const session = require("express-session");
const fs=require("fs");
const ejs=require("ejs");

const methods=require("./codes/methods");
const app = express();
const port = 3000;


app.use(express.json());
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"code Quotient",
    resave:false,
    saveUninitialized:true,
}));

app.use(express.static('./'));
app.use(express.static('./codes'));
app.use(express.static('./img'));

app.get("/",(req,res)=>
{
    res.redirect("/home");
}); 

app.get("/verifymail/:token",methods.verify_token,function(req,res){
    res.redirect("/home");
})

app.get("/forgetmail/:email",methods.verify_email,function(req,res){
    const {email} =req.params;
    res.render("change_pswd",{change_msg:"",email:email,route:'1'});
})

app.route("/change_password1").get((req,res)=>{
    res.redirect("/login");
})
.post(methods.changePswdforgot,(req,res)=>{
    res.render("change_pswd",{change_msg:"Password Successfully Changed.",email:"",route:'1'});
});

app.route("/login").post(methods.log_in,(req,res)=>
{ 
    res.redirect("/home"); 
})
.get(function(req,res){
    if(req.session.islogin)
        res.redirect("/home");
    else
        res.render("login",{message:""});
});



app.route("/signup").get(function(req,res){
    if(req.session.islogin)
        res.redirect("/home");
    else
    res.render("signup",{message:""}); 
})
.post(methods.sign_up,methods.send_mail,function(req,res){
    res.render("verify_first",{msg:""});
});



app.route("/home").get(function(req,res){
    if(req.session.islogin)
        res.render("index",{login:true,user:req.session.user.user});
    else{
        res.render("index",{login:false});
    }
})
.post(function(req,res){
    if(req.session.islogin)
        res.render("index",{login:true,user:req.session.user.user});
    else{
        res.render("index",{login:false});
    }
})



app.post("/getdetails",methods.loadMoreProduct,function(req,res){ 
    res.json(0);
});

app.route("/change_password").get((req,res)=>{
    if(req.session.islogin)
        res.render("change_pswd",{change_msg:"",email:"",route:''});
    else
        res.redirect("/login");
})
.post(methods.changePswd,function(req,res){
    res.render("change_pswd",{change_msg:"Password Successfully Changed.",email:"",route:''});
});


app.route("/forgot_password").get((req,res)=>{
    res.render("forgot_pswd",{change_msg:"",err_msg:""});
})
.post(methods.forgotPswd,function(req,res){
    res.render("forgot_pswd",{change_msg:"Link is send on your registered email to change the password.",err_msg:""});
});

app.route("/logout").post(function(req,res){
    req.session.destroy();
    res.redirect("/");
})
.get(function(req,res){
    res.redirect("/home");
});

app.get("*",function(req,res){
    res.send("Error: 404");
})

app.listen(port,()=>{
    console.log("port no.: ",port);
});