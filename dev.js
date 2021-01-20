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

const key = process.env.REACT_APP_API_KEY;
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
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_USA_contiguous_and_Hawaii_24h.csv",
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

app.get("/api/location/:address", (req, res) => {
  https.get(
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv",
    (response) => {
      const file = fs.createWriteStream("usa.csv");
      response.pipe(file);
    }
  );
  var fires = [];
  var fireRequests = [];

  fs.createReadStream("usa.csv")
    .pipe(csv())
    .on("data", (fire) => {
      fires.push(fire);
    })
    //On write finish, send 100 items to google Distance calculator.
    //TODO Iterate through all items and append to list if within radius range.
    .on("end", () => {
      //for fire in list only take the latitude and longitude as a string and append to fireRequests.
      for (var i = 0; i < 100; i++) {
        fireRequests.push(`${fires[i].latitude}:${fires[i].longitude}`);
      }
      //Makes a list out of all string items.
      var fireReqStr = fireRequests.join(",");
      //Parse commas into pipes, and colons into commas; as per google distance Matrix API.
      //https://developers.google.com/maps/documentation/distance-matrix/start
      fireReqStr = fireReqStr.replace(/,/g, "|");
      fireReqStr = fireReqStr.replace(/:/g, ",");
      //Gets user input address from variable in route/querystring.
      var origins = req.params.address;
      //Performs the request to the Google distance Matrix API, then pipes it into the 'data.json' file.
      https.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${fireReqStr}&key=${key}`,
        (response) => {
          response.pipe(fs.createWriteStream("data.json"));
        }
      );
      //A typical response of all fire data still.
      //TODO Parse fires below into withinRadius[] if True.
      var withinRadius = [];
      fs.createReadStream("data.json").on("data", (fires) => {
        var firesJSON = JSON.parse(fires.toString())["rows"];
        for (var i = 0; i < firesJSON.length(); i++) {}
        console.log();
      });
      res.json(fires);
    });
});

app.listen(port);

console.log("App is listening on port " + port);
