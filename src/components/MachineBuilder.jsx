import React, { useContext } from "react";
import machinesData from "../data/machines.json";
import milestonesData from "../data/milestones.json";
import { GameContext } from "../contexts/GameContext";
import machineSprites from "../assets/machines.png";
import { IoHammer } from "react-icons/io5";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "./styles.css";
import "nes.css/css/nes.min.css";

function MachineBuilder({ queue, setQueue }) {
  const { state, dispatch } = useContext(GameContext);

  const buildMachine = (machine) => {
    machine.buildCost.forEach((ingredient) => {
      const availableResourceAmount = state.resources[ingredient.name] || 0;
      const availableProductAmount = state.products[ingredient.name] || 0;
      const requiredAmount = ingredient.amount;

      milestonesData.forEach((milestone) => {
        console.log(milestone.resource);

        if (
          milestone.resource === machine.name &&
          !state.milestones[milestone.milestone]
        ) {
          achieveMilestone(milestone);
        }
      });

      if (availableResourceAmount >= requiredAmount) {
        dispatch({
          type: "DEDUCT_RESOURCE",
          resource: ingredient.name,
          amount: requiredAmount,
        });
      } else if (availableProductAmount >= requiredAmount) {
        dispatch({
          type: "DEDUCT_PRODUCT",
          product: ingredient.name,
          amount: requiredAmount,
        });
      } else {
        const totalAvailable = availableResourceAmount + availableProductAmount;
        if (totalAvailable >= requiredAmount) {
          const deficit = requiredAmount - availableResourceAmount;

          dispatch({
            type: "DEDUCT_RESOURCE",
            resource: ingredient.name,
            amount: availableResourceAmount,
          });

          dispatch({
            type: "DEDUCT_PRODUCT",
            product: ingredient.name,
            amount: deficit,
          });
        }
      }
    });

    setQueue((prevQueue) => [
      ...prevQueue,
      { ...machine, type: "machine", id: `${machine.name}-${Date.now()}` },
    ]);
  };

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

  const unlockedTiers = Object.keys(state.unlockedTiers).filter(
    (tier) => state.unlockedTiers[tier]
  );

  const availableMachines = machinesData.filter((machine) =>
    unlockedTiers.includes(`tier${machine.tier}`)
  );

  const achieveMilestone = (milestone) => {
    dispatch({
      type: "COMPLETE_MILESTONE",
      milestone: milestone.milestone,
    });
  };

  return (
    <div className="nes-container w-100 is-centered with-title is-dark">
      <p className="title">Machine Builder</p>
      <div className="machine-grid mx-2 my-1">
        {availableMachines.map((machine, index) => {
          const isBuildable = machine.buildCost.every((ingredient) => {
            const availableAmount = state.resources[ingredient.name] || 0;
            const availableProducts = state.products[ingredient.name] || 0;
            return availableAmount + availableProducts >= ingredient.amount;
          });

          const renderTooltip = (props) => (
            <div
              className="message nes-balloon is-dark"
              id="machine-output-tooltip"
              {...props}
            >
              <div>
                <strong>Inputs:</strong>
                <ul className="m-0 p-0 list-unstyled">
                  {machine.buildCost.map((cost) => (
                    <li key={cost.name}>
                      {cost.amount}x {cost.displayName}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Outputs:</strong>
                <ul className="m-0 p-0 list-unstyled">
                  {machine.outputs.map((output) => (
                    <li key={output.name}>{output.displayName}</li>
                  ))}
                </ul>
              </div>
            </div>
          );

          return (
            <div
              key={machine.name}
              className="nes-container is-rounded is-dark"
            >
              <div className="d-flex justify-content-between">
                <p
                  className={`text-center align-self-center ${
                    !isBuildable && "text-white-50"
                  }`}
                >
                  {machine.displayName}
                </p>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <div className="tooltip-trigger-btn " style={{}}>
                    <IoHelpCircleOutline size={30} />
                  </div>
                </OverlayTrigger>
              </div>

              <div className="d-flex gap-3 flex-column align-items-center justify-content-between">
                <div
                  className={`text-center ${!isBuildable ? "grayscale" : ""}`}
                  style={getMachineStyle(index)}
                />

                <div
                  className={` nes-container is-rounded is-dark ${
                    !isBuildable && "text-white-50"
                  }`}
                  style={{ fontSize: "0.8rem" }}
                >
                  <ul className="">
                    {machine.buildCost.map((cost) => (
                      <li className="text-nowrap fw-light" key={cost.name}>
                        {cost.amount}x {cost.displayName}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`nes-btn  ${!isBuildable && "is-disabled"}`}
                  style={{
                    padding: 10,
                  }}
                  onClick={() => buildMachine(machine)}
                  disabled={!isBuildable}
                >
                  <IoHammer size={28} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MachineBuilder;
