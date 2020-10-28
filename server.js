const https = require("https");
const fs = require("fs");
const file = fs.createWriteStream("global.csv");
const request = https.get(
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_Global_24h.csv",
  function (response) {
    response.pipe(file);
  }
);
const csv = require("csv-parser");

fs.createReadStream("global.csv")
  .pipe(csv())
  .on("data", (line) => {
    console.log(line);
  })
  .on("end", () => {
    console.log("CSV data displayed successfully");
  });

const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port);
