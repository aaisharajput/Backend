const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static("js_file"));
app.use(express.json());

app.get("/",function(req,res){
    res.sendFile(__dirname+"/to_do_list.html");
});



app.post("/pushtodo", function (req, res) {
    fs.readFile("./to_do_data.json", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else todos=JSON.parse(data);

        todos.push(req.body);

        fs.writeFile("./to_do_data.json",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/savetodo", function (req, res) {
    fs.readFile("./to_do_data.json", "utf-8", function (err, data) {
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

        fs.writeFile("./to_do_data.json",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/edittodo", function (req, res) {
    fs.readFile("./to_do_data.json", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
            let ele=todos.find(x => x.id ==req.body.id); 
            ele.task_list=req.body.val;
        } 

        fs.writeFile("./to_do_data.json",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.post("/deletetodo", function (req, res) {
    fs.readFile("./to_do_data.json", "utf-8", function (err, data) {
    if(err) res.end("error occured!!");
    else {
        let todos;
        if(data.length===0) todos=[];
        else{
            todos=JSON.parse(data);
            let ele=todos.findIndex(x => x.id ==req.body.id); 
            todos.splice(ele,1);
        } 

        fs.writeFile("./to_do_data.json",JSON.stringify(todos),function(err){
            res.end();
        })
    }
  });
});

app.get("/gettodo", function (req, res) {
    fs.readFile("./to_do_data.json", "utf-8", function (err, data) {
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
