const express = require("express");
const fs = require("fs");
const app = express();
const multer=require("multer");
const upload=multer({dest:'public/'});
app.set("view engine","ejs");
const port = 3000;

app.use(express.static("js_file"));
app.use(express.static("public"));
app.use(express.json());

app.get("/",function(req,res){
    res.sendFile(__dirname+"/to_do_list.html");
});


app.post("/pushtodo",upload.single("pics"), function (req, res) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else todos=JSON.parse(data);
        req.body.pics=req.file.filename;
        todos.push(req.body);
        fs.writeFile("./db.txt",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/savetodo", function (req, res) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
            let ele=todos.find(x => x.id ==req.body.id); 
            if(req.body.chk){
                ele.checked=true;
            }
            else{
                ele.checked=false;
            }
        } 

        fs.writeFile("./db.txt",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/edittodo", function (req, res) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
            let ele=todos.find(x => x.id ==req.body.id); 
            ele.task_list=req.body.val;
        } 

        fs.writeFile("./db.txt",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/deletetodo", function (req, res) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
            let ele=todos.findIndex(x => x.id ==req.body.id); 
            fs.unlink(__dirname+"/public/"+todos[ele].pics, function(err){
                if(err)
                    console.log(err);
            });
            todos.splice(ele,1);
        } 

        fs.writeFile("./db.txt",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.get("/gettodo", function (req, res) {
    fs.readFile("./db.txt", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
        } 

        res.json(todos);
    }
  });

});


app.listen(port, () => {
  console.log(`port no.:${port}`);
});
