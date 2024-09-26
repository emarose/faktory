import React, { useContext, useState, useEffect } from "react";
import machinesData from "../data/machines.json"; // Import machines data
import { GameContext } from "../contexts/GameContext";
import { Button, Card, ProgressBar } from "react-bootstrap";

function MachineBuilder() {
  const { state, dispatch } = useContext(GameContext);
  const [building, setBuilding] = useState(null); // Track which machine is being built
  const [remainingTime, setRemainingTime] = useState(0); // Time remaining for building

  const buildMachine = (machine) => {
    const hasResources = machine.buildCost.every((ingredient) => {
      return (state.resources[ingredient.name] || 0) >= ingredient.amount;
    });

    if (!hasResources) {
      alert(`Not enough resources to build ${machine.displayName}`);
      return;
    }

    // Deduct resources
    machine.buildCost.forEach((ingredient) => {
      dispatch({
        type: "DEDUCT_RESOURCE",
        resource: ingredient.name,
        amount: ingredient.amount,
      });
    });

    // Set up building process
    setBuilding(machine);
    setRemainingTime(machine.buildTime); // Assuming machine.buildTime exists

    // Start a countdown timer
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          dispatch({
            type: "BUILD_MACHINE",
            machine: machine.name,
          });
          setBuilding(null); // Reset building state
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <Card className="machine-card">
      <Card.Header>Available Machines</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        MachineBuilder
      </Card.Subtitle>
      {machinesData.map((machine) => {
        const isBuildable = machine.buildCost.every((ingredient) => {
          return (state.resources[ingredient.name] || 0) >= ingredient.amount;
        });

        return (
          <div key={machine.name}>
            <Card.Body className="border-bottom">
              <Card.Title>{machine.displayName}</Card.Title>
              <p>Build Cost:</p>
              <ul>
                {machine.buildCost.map((cost) => (
                  <li key={cost.name}>
                    {cost.amount}x {cost.displayName}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="dark"
                onClick={() => buildMachine(machine)}
                disabled={!isBuildable || !!building}
              >
                {building === machine
                  ? `Building...`
                  : `Build ${machine.displayName}`}
              </Button>
              {!isBuildable && (
                <span className="small ms-3 badge bg-danger">
                  Not enough materials
                </span>
              )}
              {building === machine && (
                <div className="mt-2">
                  <ProgressBar
                    now={(remainingTime / machine.buildTime) * 100}
                    label={`${remainingTime}s`}
                  />
                </div>
              )}
            </Card.Body>
          </div>
        );
      })}
    </Card>
  );
}

export default MachineBuilder;
