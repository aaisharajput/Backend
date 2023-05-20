const express = require("express");
const session = require("express-session");
const fs=require("fs");
const ejs=require("ejs");
const app = express();
const port = 3000;

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"code Quotient",
    resave:false,
    saveUninitialized:true,
}));



app.get("/",(req,res)=>
{
    if(req.session.islogin)
        res.sendFile(__dirname+"/home.html");
    else
        res.redirect("/login");
}); 



app.route("/login").post((req,res)=>
{ 
    fs.readFile("./user_pswd.json","utf-8",function(err,data){
        if(err) res.send("error occured");
        else{
            let details;
                details=JSON.parse(data);
            
                let ele=details.find(x => x.email ==req.body.email);
                if(ele==undefined){
                    res.send("Email is not registered, signup first");
                }
                else if(ele.pwd!=req.body.pwd){
                    res.send("incorrect password!!");
                }else{
                    req.session.islogin=true;
                    req.session.user=ele.user;
                    req.session.email=req.body.email;
                    res.redirect("/home");                    
                } 

        }
    })
})
.get(function(req,res){
    if(req.session.islogin)
        res.redirect("/home");
    else
        res.sendFile(__dirname+"/login.html");
});



app.route("/signup").get(function(req,res){
    if(req.session.islogin)
        res.redirect("/home");
    else
        res.sendFile(__dirname+"/signup.html");
})
.post(function(req,res){
    console.log(req.body);
    fs.readFile("./user_pswd.json","utf-8",function(err,data){
        if(err) res.send("error occured");
        else{
            let details;
            if(data.length===0){
                details=[];
            }else
                details=JSON.parse(data);

            
            let ele=details.find(x => x.email ==req.body.email);
            if(ele==undefined){
                details.push(req.body);
                fs.writeFile("./user_pswd.json",JSON.stringify(details),function(err){
                    res.redirect('/login')
                });
              }
              else{
                res.send("Account already exist");                
              }
          
        }
    })
   
});



app.route("/home").get(function(req,res){
    if(req.session.islogin){
        res.render("home",{user:req.session.user,email:req.session.email});
    }else
        res.redirect("/login");

})
.post(function(req,res){
    if(req.session.islogin)
        res.sendFile(__dirname+"/home.html");
    else
        res.redirect("/login");
})



app.post("/getdetails",function(req,res){
    console.log(req.session.name)
    res.json(req.session.name);
});


app.post("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
});



app.listen(port,()=>{
    console.log("port no.: ",port);
});