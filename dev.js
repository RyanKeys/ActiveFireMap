//CSV download dependencies
const https = require("https");
const fs = require("fs");
const file = fs.createWriteStream("global.csv");
const csv = require("csv-parser");
//unused because init on start
//TODO determine when to update the data (delete and download csv again)
https.get(
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_Global_24h.csv",
  (response) => {
    response.pipe(file);
  }
);

const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

// API endpoint that returns a  list of json objects
app.get("/api/fires", (req, res) => {
  var fires = [];
  fs.createReadStream("global.csv")
    .pipe(csv())
    .on("data", (line) => {
      fires.push(line);
    })
    .on("end", () => {
      res.json(fires);
    });
});

app.listen(port);

console.log("App is listening on port " + port);
