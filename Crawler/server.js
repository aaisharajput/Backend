
import { crawlWebPage } from "./stream_test.js";

var url = process.argv[2];
if (url == undefined) {
  console.log("URL not defined!!");
} else {
    crawlWebPage(url);
}
