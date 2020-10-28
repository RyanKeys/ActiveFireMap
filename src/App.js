import React, { Component } from "react";
import "./App.css";
import Map from "./components/map/map";
import Fake from "./components/map/Fake";
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
        {/* <Map value={i}/> */}
        <Fake fires={this.state.fires} />
      </div>
    );
  }
}

export default App;
