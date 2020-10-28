import React, { Component } from "react";
import "./App.css";
import Map from "./components/map/map";

class App extends Component {
  state = { fires: [] };

  componentDidMount() {
    fetch("/api/fires")
      .then((res) => res.json())
      .then((fires) => this.setState({ fires }));
  }

  render() {
    return (
      <div className="App">
        <ul>
          {this.state.fires.map((fire) => (
            <li key="{fire.acq_date}">{fire.latitude}</li>
          ))}
        </ul>

        {/* <Map /> */}
      </div>
    );
  }
}

export default App;
