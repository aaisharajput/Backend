const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/get_btn.html");
});

app.get("/getData", function (req, res) {
    fs.readFile("./data.json", "utf-8", function (err, data) {
    if (err) res.end("error occured!!");
    else {
      res.json(JSON.parse(data)); //one response at a time
    }
  });
});

app.listen(port, () => {
  console.log(`port no.:${port}`);
});
