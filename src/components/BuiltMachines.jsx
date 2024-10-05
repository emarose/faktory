import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { GameContext } from "../contexts/GameContext";
import machineSprites from "../assets/machines.png";
import AmountBadge from "./AmountBadge";
import "./styles.css";

function BuiltMachines() {
  const { state } = useContext(GameContext);

  const getMachineStyle = (index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    const xOffset = column * -128;
    const yOffset = row * -140;

    return {
      width: "140px",
      height: "140px",
      borderRadius: 8,
      backgroundImage: `url(${machineSprites})`,
      backgroundPosition: `${xOffset}px ${yOffset}px`,
    };
  };

  const builtMachines = Object.keys(state.machines).filter(
    (machine) => state.machines[machine] > 0
  );

  return (
    <Card className="built-machines-card">
      <Card.Header>Built Machines</Card.Header>
      <div className="d-flex gap-3">
        {builtMachines.map((machine, index) => (
          <div key={machine} className="machine-card p-2">
            <div className="position-relative" style={getMachineStyle(index)}>
              <div className="position-absolute top-0 w-100">
                {state.machines[machine] > 1 && (
                  <AmountBadge amount={state.machines[machine]} />
                )}
              </div>
              <div
                className="position-absolute bottom-0 badge badge-pill mb-2 ms-2 "
                style={{ backgroundColor: "slateblue" }}
              >
                <span className="text-light">{machine}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default BuiltMachines;
