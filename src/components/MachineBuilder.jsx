import React, { useContext } from "react";
import oresData from "../data/ores.json";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";

function MachineBuilder() {
  const { state, dispatch } = useContext(GameContext);

  const buildMachine = (machine) => {
    const hasResources = machine.buildCost.every((ingredient) => {
      if (state.resources[ingredient.name] !== undefined) {
        return state.resources[ingredient.name] >= ingredient.amount;
      } else if (state.products[ingredient.name] !== undefined) {
        return state.products[ingredient.name] >= ingredient.amount;
      }
      return false;
    });

    if (!hasResources) {
      alert(`Not enough resources to build ${machine.displayName}`);
      return;
    }

    machine.buildCost.forEach((ingredient) => {
      if (state.resources[ingredient.name] !== undefined) {
        dispatch({
          type: "DEDUCT_RESOURCE",
          resource: ingredient.name,
          amount: ingredient.amount,
        });
      } else if (state.products[ingredient.name] !== undefined) {
        dispatch({
          type: "DEDUCT_PRODUCT",
          product: ingredient.name,
          amount: ingredient.amount,
        });
      }
    });

    dispatch({
      type: "BUILD_MACHINE",
      machine: machine.name,
    });

    alert(`${machine.displayName} built successfully!`);
  };

  return (
    <Card className="machine-card">
      <Card.Header>Available Machines</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        MachineBuilder
      </Card.Subtitle>
      {oresData
        .filter((item) => item.type === "machine")
        .map((machine) => (
          <div key={machine.name} className="machine-card">
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
              >
                Build {machine.displayName}
              </Button>
            </Card.Body>
          </div>
        ))}
    </Card>
  );
}

export default MachineBuilder;
