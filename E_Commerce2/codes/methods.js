const fs=require("fs");
const sendEmail=require("./mail");

function chkAuthentication(req,res,next){

}            


function loadMoreProduct(req,res,next){
    read_file_product(res,function(details){
                
        let p_data =[],indx=req.body.counter;
        if(details.length>=indx){
            for(let j=indx-5;j<indx;j++){
                p_data.push(details[j]);
            }
            res.json(p_data);
            
        }else{
            next();
            return;
        }

    })
}

function read_file_product(res,callback){
    fs.readFile("./product_details.txt","utf-8",function(err,data){
        if(err) res.send("error occured "+err);
        else{
            let details;
            if(data.length===0){
                details=[];
            }else{
                details=JSON.parse(data);
                
                callback(details)
            }
                
        }
        })
}


function read_file_user(res,callback){
    fs.readFile("./user_pswd.json","utf-8",function(err,data){
        if(err) res.send("error occured "+err);
        else{
            let details;
            if(data.length===0){
                details=[];
            }else
                details=JSON.parse(data);
                
                callback(details)
        }
        })
}



function verify_token(req,res,next){
    const {token} =req.params;
    read_file_user(res,function(details){
        let chk=false;
        for(let i=0;i<details.length;i++){
            let user=details[i];
            if(user.token===parseInt(token)){
                chk=true;
                    req.session.islogin=true;
                    req.session.user=user;
                    req.session.verified=true;
                    user.verified=true;
                    break;
            }
        }

        if(chk){
            write_file(details,function(err){
                if(err) res.send("Error Occured. "+err);
                    next();
                    return;
            })
        }else{
            res.send("User not found");
        }
        
    });
    
}


function sign_up(req,res,next){
read_file_user(res,function(details){

    let ele=details.find(x => x.email ==req.body.email);
    if(!ele){
                req.body.verified=false;
                req.body.token=Date.now();
                delete req.body.cnf;
                details.push(req.body);
                
                write_file(details,function(err){
                    if(err) res.send("Error Occured. "+err);
                        next();
                        return;
                })
      }
      else{
        res.render("signup",{message:"Account already exist!!"});               
      }
});
}


function log_in(req,res,next){
    
    read_file_user(res,function(details){
        let ele=details.find(x => x.email == req.body.email);
        if(ele==undefined){
            res.render("login",{message:"Email is not registered, signup first"});
        }else if(ele.verified){
            if(ele.pwd!=req.body.pwd){
                res.render("login",{message:"incorrect password!!"});
            }else{
                req.session.islogin=true;
                req.session.user=ele;
                next();
                return;                   
            } 
        }else{
            req.body.token=ele.token;
            send_mail(req,res,()=>{
                res.render("verify_first",{msg:"You not verified your email."});
            });
        }
    });

}

function send_mail(req,res,next){
    sendEmail.sendMail(req.body.email,req.body.token,function(err){
        if(err){
            res.render("signup",{message:"Something went wrong. Verification process stopped."}); 
        }else{
            next();
            return;
        }
        
    });
}

function verify_email(req,res,next){
    const {email} =req.params;
    read_file_user(res,function(details){
        let ele=details.find(x => x.email == email);
            if(ele){
                next();
            }else{
                res.send("User not found!!");
            }

        
    });
    
}

function changePswdforgot(req,res,next){
    pswd_chng_forgot(req,res,()=>{
        read_file_user(res,(data)=>{
            let ele=data.find(x => x.email ==req.body.email);
            ele.pwd=req.body.pwd;
            write_file(data,(err)=>{
                if(err) res.send("Error Occured. "+err);
                next();
                return;
            })
        })
       
    });
}

function pswd_chng_forgot(req,res,callback){
    sendEmail.pswdChangedMail(req.body.email,function(err){
        if(err){
            res.render("change_pswd",{change_msg:err,email:"",route:'1'});
        }else{
            callback();
        }
        
    });
}

function changePswd(req,res,next){
    pswd_chng_mail(req,res,()=>{
        read_file_user(res,(data)=>{
            let ele=data.find(x => x.email ==req.session.user.email);
            ele.pwd=req.body.pwd;
            write_file(data,(err)=>{
                if(err) res.send("Error Occured. "+err);
                next();
                return;
            })
        })
       
    });
}

function pswd_chng_mail(req,res,callback){
    sendEmail.pswdChangedMail(req.session.user.email,function(err){
        if(err){
            res.render("change_pswd",{change_msg:err,email:"",route:''});
        }else{
            callback();
        }
        
    });
}

function forgotPswd(req,res,next){
    read_file_user(res,(data)=>{
        let ele=data.find(x => x.email == req.body.email);
        if(ele){
            sendEmail.pswdForgotMail(req.body.email,(err)=>{
                if(err){
                    res.render("forgot_pswd",{change_msg:"",err_msg:err});
                }else{
                    next();
                    return;
                }
            })
        }else{
            res.render("forgot_pswd",{change_msg:"",err_msg:"Email is not registered. Signup First."})
        }
    })
}

function write_file(data,callback){
    fs.writeFile("./user_pswd.json",JSON.stringify(data),callback);
}

module.exports={chkAuthentication,loadMoreProduct,sign_up,send_mail,verify_token,log_in,changePswd,forgotPswd,verify_email,changePswdforgot};