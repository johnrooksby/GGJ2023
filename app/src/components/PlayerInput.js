import React from "react";

const PlayerInput = (props) => {

  let alive = (props.playerNameValue.alive) ? "alive" : "dead"
  
  return (
    <div>
      <input type="text" className={alive} onChange={props.handlePlayerName} value={props.playerNameValue.name} name={props.playerNameKey} placeholder="player"/>
    </div>
  );
}

export default PlayerInput;