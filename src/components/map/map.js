import React from "react";
import "../../App.css";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DistanceMatrixServiceProps,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "../../mapStyles";
import { Search } from "./Search";
import LoadScreen from "./LoadScreen";

const dotenv = require("dotenv");
dotenv.config();
//desired API libraries and options
const libraries = ["places"];
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
};
var markerSize = 50;
//Map Component
export default function Map(props) {
  //////////////////INIT VARS//////////////////////
  //Loads Map w/API key and desired libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });
  //const to store Map coorinates in React.useRef()
  const mapRef = React.useRef();
  //fn applies any user input data into mapRef
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  //fn Moves Map to user input location
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  //Opens up Legend background then fills it with populateSearch()
  const openLegend = (fire) => {
    const legend = document.getElementById("search");
    legend.style.height = "auto";
    legend.style.overflow = "auto";
    const button = document.getElementById("legendButton");
    button.style.visibility = "visible";
    button.style.position = "relative";
    button.style.zIndex = 10;
    populateSearch(fire);
  };

  //Grabs containers inside legend and populates it with json data via fireResultsHtml().
  const populateSearch = (fire) => {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
    searchResults.innerHTML += fireResultsHtml(fire);
    searchResults.style.display = "block";
    searchResults.style.visibility = "visible";
    return {
      searchResults,
    };
  };

  //Grabs data for user selected fire.
  const fireResultsHtml = (fire) => {
    console.log(fire);
    return `<div id=fireResults>
      <h3 id=fireTitle>Coordinates:<br/>${fire.latitude}/${fire.longitude}</h3>
      <h3 id=fireTitle>Date Discovered:<br/>${fire.acq_date}<h3/>
      <h3 id=fireTitle>Time Discovered:<br/>${fire.acq_time}<h3/> 
      <h3 id=fireTitle>Scan:<br/>${fire.scan}</h3>
      <h3 id=fireTitle>Bright T 31:<br/>${fire.bright_ti4}</h3>
      <h3 id=fireTitle>Satellite:<br/>${fire.frp}</h3>
      <h3 id=fireTitle>Satellite:<br/>${fire.satellite}</h3>
      <br/>
    </div>`;
  };
  
  var urlString = window.location.pathname.toString();
  if (urlString.includes("location")) {
    var coordList = urlString
      .replace("location", "")
      .replace("//", "")
      .split(",");
    var newLat = Number(coordList[0]);
    var newLng = Number(coordList[1]);
    console.log(newLat, newLng);
  }

  //Makes map fullscreen
  const mapStyles = {
    height: "100vh",
    width: "100%",
  };
  if (loadError) return "Error Loading Data.";
  // TODO animation in place of Loading Fire Data.
  if (!isLoaded) return <LoadScreen />;

  ////////////////////////////Map Creation/////////////////////////
  //Creates Map HTML
  return (
    <div>
      {/* Inits the search Component and passes it the panTo fn */}
      <Search panTo={panTo} />
      {/* Google Map Component */}
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={8}
        center={{ lat: newLat || 37.468319, lng: newLng || -122.143936 }}
        options={options}
        onLoad={onMapLoad}
      >
        {/* Takes every JSON object in fireData and maps them to a Marker on the map */}
        {props.fires.map((fire) => (
          <Marker
            // TODO change key to lat lng and date.
            key={fire.id}
            position={{
              lat: parseFloat(fire.latitude),
              lng: parseFloat(fire.longitude),
            }}
            // on marker click pan to the location of the fire using panTo();
            // Then openLegend(fire); with fire being the user's selected marker.
            onClick={async () => {
              const lat = parseFloat(fire.latitude);
              const lng = parseFloat(fire.longitude);
              panTo({ lat, lng });
              openLegend(fire);
            }}
            // Actual Marker icon (ex. fire/flag etc)
            icon={{
              url:
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn140.picsart.com%2F291118763013211.png&f=1&nofb=1",
              scaledSize: new window.google.maps.Size(markerSize, markerSize),
              origin: new window.google.maps.Point(0, 0),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
