import React, { Component } from "react";
import "./App.css";
import Map from "./components/map/map";
class App extends Component {
  //On page load grabs data from API and pushes it into {this.state.fires}

  //TODO Add route only accessible by site to get Google API key :) c: :p
  state = { fires: [] };

  //Fetches Data from given route.
  apiCaller(route) {
    fetch(route)
      .then((res) => res.json())
      .then((fires) => this.setState({ fires }));
  }

  //Handles users route selection and returns their desired JSON.
  apiHandler(url) {
    console.log(url);
    if (url === "/api/") {
      this.apiCaller("/api/fires");
    } else if (url.includes("location")) {
      this.apiCaller(url);
    } else {
      var routes = ["/api/fires", "/api/usa"].forEach((route) => {
        console.log(route);
        if (url === route) {
          this.apiCaller(route);
        }
      });
    }
  }

  componentDidMount() {
    var url = `/api${window.location.pathname}`;
    this.apiHandler(url);
  }

  render() {
    console.log(this.state.fires);

    return (
      <div className="App">
        {/* Assigns this.state.fires to props.fires in child component */}
        <Map fires={this.state.fires} />
      </div>
    );
  }
}

export default App;
