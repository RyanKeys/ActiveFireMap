import React, { Component } from "react";
import "../../App.css";
import logo from "../../logo.svg";
export default class LoadScreen extends Component {
  render() {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          marginRight: "auto",
          marginLeft: "auto",
        }}
        id="loadScreen"
      >
        <h1 style={{ color: "whitesmoke", textShadow: "2px 2px black" }}>
          Loading Fire Data:{" "}
        </h1>
        <img src={logo} s className="App-logo" alt="logo" />
        <h5
          style={{
            color: "whitesmoke",
            textShadow: "2px 2px black",
          }}
        >
          Powered by React.
        </h5>
        <h6 style={{ color: "whitesmoke" }}>
          <a style={{ color: "whitesmoke" }} href="Https://github.com/RyanKeys">
            © Ryan Keys
          </a>
        </h6>
      </div>
    );
  }
}
