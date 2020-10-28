import React from "react";

export default function Fake(props) {
  return (
    <div>
      {props.fires.map((fire) => (
        <h1>
          {fire.latitude}, {fire.longitude}
        </h1>
      ))}
    </div>
  );
}
