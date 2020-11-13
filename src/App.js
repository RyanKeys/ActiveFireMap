import React, { Component } from "react";
import "./App.css";
import Map from "./components/map/map";
class App extends Component {
  //On page load grabs data from API and pushes it into {this.state.fires}
  state = { fires: [] };
  componentDidMount() {
    var url = `/api${window.location.pathname}`;
    console.log(url);
    if (url === "/api/") {
      fetch("/api/fires")
        .then((res) => res.json())
        .then((fires) => this.setState({ fires }));
    } else if (url === "/api/usa") {
      fetch("/api/usa")
        .then((res) => res.json())
        .then((fires) => this.setState({ fires }));
    }
  }

  render() {
    return (
      <div className="App">
        {/* Assigns this.state.fires to props.fires in child component */}
        <Map fires={this.state.fires} />
      </div>
    );
  }
}

export default App;
