// const url = "https://mamcollegejammu.in/";
import fs from 'fs';

let Url_set = new Set();
import {filterLinks,sendRequest,writeFile,appendURL,readFile,sendNextURL, ResumeFile} from './sendRequest.js';
let i=1;
export const crawlWebPage=(url)=>{
  let data;
  ResumeFile("Resume.txt")
  .then(result=>{
    if(result=="next") startCrawler(url,0)
    else{
      data=JSON.parse(result);
      ResumeFile("visited_links.txt")
      .then(result=>{
        if(result=="next") console.log("Empty file visited_links");
        else{
          result = result.split("\n");
          Url_set = new Set(result);
          console.log(
            `Current file scanning: data${data.File_no}.txt \nLast File created: data${data.newFile}.txt \nResuming Crawling Process...`
          );
          i=0;
          levelCrawling(data.File_no,data.newFile);
        }
      })
    }
  })
  .catch(e=>{
    startCrawler(url,0);
  })
}

export const startCrawler=(url,parent)=>{
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  if (!fs.existsSync("html")) {
    fs.mkdirSync("html");
  }
  sendRequest(url)
  .then(body=>{
    writeFile(`html/data${parent}.html`,body)
    return filterLinks(body,url)})
  .then(arr=>{
    Url_set.add(url);
    return writeFile(`data/data${parent}.txt`,`${JSON.stringify(arr)}`);
  })
  .then(()=>{
    appendURL(url);
    if(i==1){
      levelCrawling(0,0);
      i=0;
    }
  })
  .catch(error=>{
    if(error.code=='ENOTFOUND')
      console.log("Invalid URL!!");
    else if(error.code=='ERR_TLS_CERT_ALTNAME_INVALID')
      console.log("Access Denied!!");
    else if(error.code=='ECONNREFUSED')
      console.log("Connect Refused!!");
    else if(error.code=='ETIMEDOUT')
      console.log("Time Out!!");
    else
      console.log(error.message);
  })

}

export const levelCrawling=(next_file,parent)=>{
  readFile(next_file)
  .then(val=>{
    sendNextURL(val,next_file,parent,Url_set);
  })  
  .catch(error=>{
    if(error.code=='ETIMEDOUT')
        console.log("Time Out!!");
      else if(error.code=='ECONNREFUSED')
        console.log("Connection Refused!!")
      else 
        console.log("Invalid URL!!");
    levelCrawling(++next_file,++parent);
  })
}

