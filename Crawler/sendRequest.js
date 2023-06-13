import fs from 'fs';
import request from 'request';
import {startCrawler,levelCrawling} from "./stream_test.js";

export const sendRequest = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        return resolve(body);
      } else {
        return reject(error);
      }
    });
  });
};

export const filterLinks = (body,url) => {
    const regex = /<a\s+href=(["'])(.*?)\1/g;
    const matches = body.match(regex);
    const arr = [];
    if (matches) {
      const links = matches.map(
        (match) => match.match(/href=(["'])(.*?)\1/)[2]
      );
      links.forEach((l, i) => {
        arr[i] = new URL(l, url).href;
      });
    }
    return arr;
};

export const writeFile=(filename,content)=>{
    return new Promise((resolve, reject) => {
        const WriteStream = fs.createWriteStream(filename);

        WriteStream.on("finish", () => {return resolve(filename);})
        WriteStream.on("error", (error) => {return reject(error);});
        WriteStream.write(content);
        WriteStream.end();
    })
 }

export const appendURL=(url)=>{
  return new Promise((resolve,reject)=>{
    fs.appendFile("visited_links.txt", `${url}\n`,(err)=>{
      if(err) reject(err);
      else resolve();
    });
  })
}

export const readFile=(next_file)=>{
  return new Promise((resolve, reject) => {
    fs.readFile(`data/data${next_file}.txt`, "utf-8", (err, data) => {
      if(err) return reject(err);
      else{
        console.log(`File name: data${next_file}.txt`);
        let arr = JSON.parse(data);
        return resolve(arr);
      }
    })
  })
}

export const ResumeFile=(filename)=>{
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if(err) return reject(err);
      else{
        if (data.length == 0) {
          // console.log("Empty File Resume!!");
          return resolve("next");
        }else{
          return resolve(data);
        }
      }
    })
  })
}

export const sendNextURL=(arr,next_file,parent,Url_set)=>{
  let obj = {};
    let i=-1,link;

    setInterval(() => {
      i++;
      link=arr[i];
      if (!Url_set.has(link)) {
        console.log("next link: ", link);
        obj = { File_no: next_file, lastURL: link, newFile: parent+1};
        fs.writeFile("Resume.txt", JSON.stringify(obj), (err) => {
          if(err) console.log("error: resume file write",err);
          else startCrawler(link,++parent);
        });
      }
      if (i + 1 == arr.length) {
        levelCrawling(++next_file,++parent);
      }
    },10000);
}
