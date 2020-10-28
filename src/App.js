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
        {/* assigns this.state.fires to props.fires in child component */}
        <Map fires={this.state.fires} />
      </div>
    );
  }
}

export default App;
