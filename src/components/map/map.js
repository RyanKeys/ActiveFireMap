import React from "react";
import "../../App.css";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "../../mapStyles";
import { Search } from "./Search";
import LoadScreen from "./LoadScreen";
import { compareAsc } from "date-fns";

const dotenv = require("dotenv");
dotenv.config();
const key = process.env.REACT_APP_API_KEY;
console.log(key);
//desired API libraries and options
const libraries = ["places"];
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
};
var markerSize = 30;
//Map Component
export default function Map(props) {
  //////////////////INIT VARS//////////////////////
  //Loads Map w/API key and desired libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
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
    return `<div id=fireResults>
      <h3 id=fireTitle>Coordinates:<br/>${fire.latitude}/${fire.longitude}</h3>
      <h3 id=fireTitle>Date Discovered:<br/>${fire.acq_date}<h3/>
      <h3 id=fireTitle>Probability:<br/>${fire.confidence}<h3/> 
      <h3 id=fireTitle>Scan:<br/>${fire.scan}</h3>
      <h3 id=fireTitle>Bright T 31:<br/>${fire.bright_t31}</h3>
      <h3 id=fireTitle>Satellite:<br/>${fire.frp}</h3>
      <h3 id=fireTitle>Satellite:<br/>${fire.satellite}</h3>
      <br/>
    </div>`;
  };

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
        center={{ lat: 37.468319, lng: -122.143936 }}
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
              console.log(fire.id);
              const lat = parseFloat(fire.latitude);
              const lng = parseFloat(fire.longitude);
              panTo({ lat, lng });
              openLegend(fire);
            }}
            // Actual Marker icon (ex. fire/flag etc)
            icon={{
              url: "https://cdn140.picsart.com/268960205000211.png",
              scaledSize: new window.google.maps.Size(markerSize, markerSize),
              origin: new window.google.maps.Point(0, 0),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
