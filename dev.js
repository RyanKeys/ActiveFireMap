//CSV download dependencies
const https = require("https");
const fs = require("fs");
const csv = require("csv-parser");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();
const key = process.env.API_KEY;
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// API endpoint that returns a  list of json objects as 'fires'
//TODO change routes to pass different csv files
app.get("/api/fires", (req, res) => {
  https.get(
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_Global_24h.csv",
    (response) => {
      const file = fs.createWriteStream("global.csv");
      response.pipe(file);
    }
  );
  var fires = [];
  fs.createReadStream("global.csv")
    .pipe(csv())
    .on("data", (fire) => {
      fires.push(fire);
    })
    .on("end", () => {
      res.json(fires);
    });
});

app.get("/api/usa", (req, res) => {
  https.get(
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv",
    (response) => {
      const file = fs.createWriteStream("usa.csv");
      response.pipe(file);
    }
  );
  var fires = [];
  fs.createReadStream("usa.csv")
    .pipe(csv())
    .on("data", (fire) => {
      fires.push(fire);
    })
    .on("end", () => {
      res.json(fires);
    });
});

app.get("/usa", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// API endpoint that returns a  list of json objects as 'fires'
//TODO change routes to pass different csv files

app.listen(port);

console.log("App is listening on port " + port);
