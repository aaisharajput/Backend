const express = require("express");
const session = require("express-session");
const fs=require("fs");
const ejs=require("ejs");
const methods=require("./codes/methods");
const app = express();
const port = 3000;
const multer=require("multer");

const storage=multer.diskStorage({
                    destination: function (req, file, callback) {
                        callback(null, 'img/');
                    },
                    filename: function (req, file, callback) {
                        callback(null, file.originalname);
                    }
});
const upload=multer({storage:storage})
app.use(express.json());
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({secret:"code Quotient",resave:false,saveUninitialized:true,}));

app.use(express.static('./'));
app.use(express.static('./codes'));
app.use(express.static('./img'));

app.get("/",(req,res)=>{res.redirect("/home");}); 

app.get("/verifymail/:token",methods.verify_token,function(req,res){res.redirect("/home");})

app.get("/forgetmail/:email",methods.verify_email,function(req,res){
    const {email} =req.params;
    res.render("change_pswd",{change_msg:"",email:email,route:'1'});
})

app.route("/change_password1").get((req,res)=>{res.redirect("/login",{message:""});})
.post(methods.changePswdforgot,(req,res)=>{res.render("change_pswd",{change_msg:"Password Successfully Changed.",email:"",route:'1'});});

app.route("/login",{message:""}).post(methods.log_in,(req,res)=>{res.redirect("/home");})
.get(methods.chkAuthenticationLogin,function(req,res){res.redirect("/home");});

app.route("/signup").get(methods.chkAuthenticationSignup,function(req,res){res.redirect("/home");})
.post(methods.sign_up,methods.send_mail,function(req,res){res.render("verify_first",{msg:""});});

app.route("/home").get(methods.chkAuthenticationIndex,function(req,res){res.render("index",{login:true,user:req.session.user.user});})
.post(methods.chkAuthenticationIndex,function(req,res){res.render("index",{login:true,user:req.session.user.user});})

app.post("/getdetails",methods.loadMoreProduct,function(req,res){res.json(0);});

app.post("/admin_product",methods.loadAdminProduct);

app.post("/single_product",methods.singleProduct);

app.route("/change_password").get(methods.redirectLogin,(req,res)=>{res.render("change_pswd",{change_msg:"",email:"",route:''});})
.post(methods.changePswd,function(req,res){res.render("change_pswd",{change_msg:"Password Successfully Changed.",email:"",route:''});});

app.route("/forgot_password").get((req,res)=>{res.render("forgot_pswd",{change_msg:"",err_msg:""});})
.post(methods.forgotPswd,function(req,res){res.render("forgot_pswd",{change_msg:"Link is send on your registered email to change the password.",err_msg:""});});

app.route("/cart").get(methods.redirectLogin,(req,res)=>{res.render("cart",{login:true,user:req.session.user.user});})
.post(methods.cardItems);

app.route("/addToCart").get((req,res)=>{res.json({"redirect":"/home"});})
.post(methods.addProductToCart,(req,res)=>{res.json({str:"Added"});})

app.route("/plus_minus_product").get((req,res)=>{res.json({"redirect":"/home"});})
.post(methods.plusMinusProduct,(req,res)=>{res.json({str:"Added"});})

app.route("/logout").post(function(req,res){req.session.destroy();res.redirect("/");})
.get(function(req,res){res.redirect("/home");});

app.route("/adminlogout").post(function(req,res){req.session.destroy();res.redirect("/login");})
.get(function(req,res){res.redirect("/admin");});

app.post("/delete",methods.deleteProduct,function(req,res){res.json(0);})

app.post("/admin_delete",methods.deleteAdminProduct,function(req,res){res.json(0);})

app.post("/admin_update_product",upload.single("img"),methods.updateAdminProduct,function(req,res){res.json({msg:"Updated Successfully!!"})})

app.post("/new_product",upload.single("img"),methods.addAdminProduct,function(req,res){res.render("admin",{user:req.session.user.user,msg:"Added Successfully!!"});})

app.route("/admin").get(methods.chkAdmin,function(req,res){res.render("login",{message:"Only admin can access this page!!"});})
.post(methods.loadAdminProduct);
app.get("*",function(req,res){res.send("Error: 404");})

app.listen(port,()=>{console.log("port no.: ",port);});