const request = require('request-promise');
const cheerio = require('cheerio');
const bodyparser = require('body-parser')
const express = require("express");

const app = express()

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.get("/", async function (req, res) {
    var fullData = [];
    await request("https://nta.ac.in", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
  
        const datarow = $(".latestPart");
        datarow.find("p").each((i, data) => {
          const item1 = $(data).find("content").text();
          const item2 = $(data).find("a").attr("href");
          fullData.push({
            notice: item1.trim(),
            link: "https://nta.ac.in" + item2,
          });
        });
  
        res.send(fullData);
      }else{
        res.send({"data":"error"});
      }
    });
  });

app.listen(3000, function(error){
    if (error) throw error
    console.log("Server created Successfully on PORT", 3000)
});