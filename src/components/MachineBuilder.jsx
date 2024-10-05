import React, { useState, useEffect, useContext } from "react";
import machinesData from "../data/machines.json";
import { GameContext } from "../contexts/GameContext";
import { Button, Card, Tooltip, OverlayTrigger } from "react-bootstrap";
import MachineQueue from "./MachineQueue";
import machineSprites from "../assets/machines.png";
import "./styles.css";
import { IoHammer } from "react-icons/io5";

function MachineBuilder() {
  const { state, dispatch } = useContext(GameContext);
  const [buildingQueue, setBuildingQueue] = useState([]);
  const [crafting, setCrafting] = useState(null);

  const buildMachine = (machine) => {
    const hasResources = machine.buildCost.every((ingredient) => {
      const availableAmount = state.resources[ingredient.name] || 0;
      const availableProducts = state.products[ingredient.name] || 0;
      return availableAmount + availableProducts >= ingredient.amount;
    });

    if (!hasResources) {
      alert(`Not enough resources to build ${machine.displayName}`);
      return;
    }

    // Deduct resources and add to queue
    machine.buildCost.forEach((ingredient) => {
      const availableAmount = state.resources[ingredient.name] || 0;
      const requiredAmount = ingredient.amount;

      if (availableAmount >= requiredAmount) {
        dispatch({
          type: "DEDUCT_RESOURCE",
          resource: ingredient.name,
          amount: requiredAmount,
        });
      } else {
        const deficit = requiredAmount - availableAmount;
        dispatch({
          type: "DEDUCT_PRODUCT",
          product: ingredient.name,
          amount: deficit,
        });
      }
    });

    setBuildingQueue((prevQueue) => {
      const newQueue = [...prevQueue, machine];
      return newQueue;
    });
  };

  useEffect(() => {
    if (buildingQueue.length === 0) return;

    const machine = buildingQueue[0];
    const buildTime = machine.buildTime || 5;
    setCrafting({ machine, processingTime: buildTime });

    const timer = setTimeout(() => {
      setCrafting(null);
      dispatch({
        type: "BUILD_MACHINE",
        machine: machine.displayName,
      });
      setBuildingQueue((prevQueue) => prevQueue.slice(1));
    }, buildTime * 1000);

    return () => clearTimeout(timer);
  }, [buildingQueue, dispatch]);

  const getMachineStyle = (index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    const xOffset = column * -128;
    const yOffset = row * -140;

    return {
      width: "140px",
      height: "140px",
      backgroundImage: `url(${machineSprites})`,
      backgroundPosition: `${xOffset}px ${yOffset}px`,
    };
  };

  const unlockedTier = Object.keys(state.unlockedTiers).filter(
    (tier) => state.unlockedTiers[tier]
  ).length;

  const availableMachines = machinesData.filter(
    (machine) => machine.tier <= unlockedTier
  );

  return (
    <>
      <Card className="machine-card">
        <Card.Header>Available Machines</Card.Header>

        <div className="machine-grid m-2">
          {availableMachines.map((machine, index) => {
            const isBuildable = machine.buildCost.every((ingredient) => {
              const availableAmount = state.resources[ingredient.name] || 0;
              const availableProducts = state.products[ingredient.name] || 0;
              return availableAmount + availableProducts >= ingredient.amount;
            });

            const renderTooltip = (props) => (
              <Tooltip id="machine-output-tooltip" {...props}>
                Outputs:
                <ul className="m-0 p-0 list-unstyled">
                  {machine.outputs.map((output) => (
                    <li key={output.name}>
                      {machine.buildCost.map((cost, idx) => (
                        <React.Fragment key={cost.name}>
                          {idx > 0 && ", "}
                          {cost.displayName}
                        </React.Fragment>
                      ))}{" "}
                      &gt; {output.displayName}
                    </li>
                  ))}
                </ul>
              </Tooltip>
            );

            return (
              <OverlayTrigger
                key={machine.name}
                placement="top"
                overlay={renderTooltip}
              >
                <Card className="machine-item shadow-sm">
                  <Card.Body className="d-flex flex-column align-items-center">
                    <div
                      className={`text-center ${
                        !isBuildable ? "grayscale" : ""
                      }`}
                      style={getMachineStyle(index)}
                    ></div>
                    <Card.Title>{machine.displayName}</Card.Title>

                    <p className="mb-0">Build Cost:</p>
                    <ul>
                      {machine.buildCost.map((cost) => (
                        <li key={cost.name}>
                          {cost.amount}x {cost.displayName}
                        </li>
                      ))}
                    </ul>
                    <Button
                      style={{
                        padding: 10,
                        borderRadius: "50%",
                        display: "grid",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      variant="dark"
                      onClick={() => buildMachine(machine)}
                      disabled={!isBuildable || !!crafting}
                    >
                      <IoHammer size={24} />
                    </Button>
                  </Card.Body>
                </Card>
              </OverlayTrigger>
            );
          })}
        </div>
      </Card>
      <MachineQueue
        queue={buildingQueue}
        crafting={crafting}
        remainingTime={crafting ? crafting.processingTime : 0}
      />
    </>
  );
}

export default MachineBuilder;
