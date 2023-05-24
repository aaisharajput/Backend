const express = require("express");
const session = require("express-session");
const fs=require("fs");
const ejs=require("ejs");
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



app.route("/login").post((req,res)=>
{ 
    fs.readFile("./user_pswd.json","utf-8",function(err,data){
        if(err) res.send("error occured");
        else{
            let details;
                details=JSON.parse(data);
            
                let ele=details.find(x => x.email ==req.body.email);
                if(ele==undefined){
                    res.render("login",{message:"Email is not registered, signup first"});
                }
                else if(ele.pwd!=req.body.pwd){
                    res.render("login",{message:"incorrect password!!"});
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
        res.render("login",{message:""});
});



app.route("/signup").get(function(req,res){
    if(req.session.islogin)
        res.redirect("/home");
    else
    res.render("signup",{message:""}); 
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
                res.render("signup",{message:"Account already exist!!"});               
              }
          
        }
    })
   
});



app.route("/home").get(function(req,res){
    if(req.session.islogin)
        res.render("index",{login:true,user:req.session.user});
    else{
        res.render("index",{login:false});
    }
})
.post(function(req,res){
    if(req.session.islogin)
        res.render("index",{login:true,user:req.session.user});
    else{
        res.render("index",{login:false});
    }
})



app.post("/getdetails",function(req,res){
    fs.readFile("./product_details.txt","utf-8",function(err,data){
        if(err) res.send("error occured");
        else{
            let details;
            if(data.length===0){
                details=[];
            }else{
                details=JSON.parse(data);
                
                let p_data =[],indx=req.body.counter;
                if(details.length>=indx){
                    for(let j=indx-5;j<indx;j++){
                        p_data.push(details[j]);
                    }
               
                    res.json(p_data);
                }else{
                    res.json(0);
                }
                    
            }
          
        }
    })
});


app.route("/logout").post(function(req,res){
    req.session.destroy();
    res.redirect("/");
})
.get(function(req,res){
    res.redirect("/home");
});



app.listen(port,()=>{
    console.log("port no.: ",port);
});