import React, { Component } from "react";
import "./App.css";
import Map from "./components/map/map";
// const csv = axios.create({
//   headers: {
//     "Access-Control-Allow-Origin": "*"
//   },
//   baseURL:
//     "https://firms2.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv",
// });
class App extends Component {
  // constructor() {
  //   super();
  //   csv.get('/').then(res => {
  //     console.log(res.data)
  //   })
  // }
  
  render() {
    const csv = fetch("https://firms2.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv", {
      method: "GET",
      mode : 'no-cors',
      cache: "default",
      credentials:"omit"
    })
    console.log(csv)
    return (
      <div className="App">
        {/* Calls to Maps API for free cannot exceed 500. Disabled to prevent refreshes during development */}
        <Map />
      </div>
    );
  }
}

export default App;
