import React, { useState, useEffect, useContext } from "react";
import machinesData from "../data/machines.json";
import milestonesData from "../data/milestones.json";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";
import MachineQueue from "./MachineQueue";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

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
        machine: machine.name,
      });
      setBuildingQueue((prevQueue) => prevQueue.slice(1));

      // Check for milestone completion
      milestonesData.forEach((milestone) => {
        if (
          milestone.resource === machine.name &&
          !state.milestones[milestone.milestone]
        ) {
          console.log(`Checking milestone for machine: ${machine.name}`);
          console.log("Milestone Data:", milestone);
          achieveMilestone(milestone);
        }
      });
    }, buildTime * 1000);

    return () => clearTimeout(timer);
  }, [buildingQueue, dispatch]);

  const achieveMilestone = (milestone) => {
    console.log("Achieving milestone:", milestone);
    dispatch({
      type: "COMPLETE_MILESTONE",
      milestone: milestone.milestone,
    });

    alert(
      `Milestone Achieved: ${milestone.description}!\nRewards:\n- ${milestone.reward.researchPoints} Research Points\n- Unlocks: ${milestone.reward.unlocks}`
    );
  };

  return (
    <>
      <Card className="machine-card">
        <Card.Header>Available Machines</Card.Header>
        <Card.Subtitle className="text-muted px-3 pt-3">
          MachineBuilder
        </Card.Subtitle>
        <div className="machine-grid">
          {machinesData.map((machine) => {
            const isBuildable = machine.buildCost.every((ingredient) => {
              const availableAmount = state.resources[ingredient.name] || 0;
              const availableProducts = state.products[ingredient.name] || 0;
              return availableAmount + availableProducts >= ingredient.amount;
            });

            return (
              <Card key={machine.name} className="machine-item">
                <Card.Body>
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
                    disabled={!isBuildable || !!crafting}
                  >
                    {crafting?.machine === machine
                      ? `Building...`
                      : `Build ${machine.displayName}`}
                  </Button>
                  {!isBuildable && (
                    <p className="mt-1 small text-danger">Missing materials</p>
                  )}
                </Card.Body>
              </Card>
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
