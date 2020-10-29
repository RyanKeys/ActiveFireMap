//CSV download dependencies
const https = require("https");
const fs = require("fs");
const csv = require("csv-parser");
const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

// API endpoint that returns a  list of json objects as 'fires'
//TODO change routes to pass different csv files
app.get("/api/fires", (req, res) => {
  https.get(
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv",
    (response) => {
      const file = fs.createWriteStream("global.csv");
      response.pipe(file);
    }
  );
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
