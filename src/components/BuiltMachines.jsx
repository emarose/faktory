import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { GameContext } from "../contexts/GameContext";
import machineSprites from "../assets/machines.png";
import AmountBadge from "./AmountBadge";
import "./styles.css";
import machineData from "../data/machines.json";
import productData from "../data/products.json";
import ProductIcon from "./ProductIcon";
import Notification from "./Notification";

function BuiltMachines() {
  const { state, dispatch } = useContext(GameContext);

  const [showModal, setShowModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [tempSelectedRecipeIndex, setTempSelectedRecipeIndex] = useState(null);
  const [selectedRecipes, setSelectedRecipes] = useState({});
  const [amountToCraft, setAmountToCraft] = useState(1);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingDuration, setCraftingDuration] = useState(0);
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const getMachineStyle = (index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    const xOffset = column * -128;
    const yOffset = row * -140;

    return {
      width: "140px",
      height: "140px",
      borderRadius: 8,
      outline: "3px solid slateblue",
      backgroundImage: `url(${machineSprites})`,
      backgroundPosition: `${xOffset}px ${yOffset}px`,
    };
  };

  const builtMachines = Object.keys(state.machines).filter(
    (machine) => state.machines[machine] > 0
  );

  useEffect(() => {
    if (currentMachine && tempSelectedRecipeIndex !== null) {
      const recipe = currentMachine.recipes[tempSelectedRecipeIndex];
      setCraftingDuration(recipe.processingTime * amountToCraft);
      setCraftingProgress(0); // Reset progress whenever the recipe changes
    }
  }, [tempSelectedRecipeIndex, amountToCraft, currentMachine]);

  useEffect(() => {
    if (isCrafting) {
      const steps = 100; // Define in terms of percentage steps
      const updateInterval = craftingDuration / steps; // Interval duration based on craftingDuration and steps
      let progress = 0;

      const id = setInterval(() => {
        if (progress < steps) {
          progress += 1;
          setCraftingProgress((progress / steps) * 100);
        } else {
          clearInterval(id); // Ensure the interval is cleared once crafting is complete
          finalizeCrafting(); // Trigger final actions after crafting
          setIsCrafting(false);
          //setAmountToCraft(calculateMaxAmountToCraft());
          setAmountToCraft(1);
          setCraftingProgress(100); // Ensure it ends at 100%
          resetAfterCrafting(); // Reset recipe and icons
        }
      }, updateInterval * 1000); // Convert to milliseconds

      setIntervalId(id);
    }

    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount or isCrafting change
    };
  }, [isCrafting, craftingDuration]);

  const finalizeCrafting = () => {
    if (currentMachine && tempSelectedRecipeIndex !== null) {
      const craftedAmount = amountToCraft;
      const recipe = currentMachine.recipes[tempSelectedRecipeIndex];
      const craftedProduct = recipe.output.name;

      setIsCrafting(false);
      setCraftingProgress(100);

      // Deduct inputs used for crafting
      recipe.input.forEach((ingredient) => {
        const isProduct = !!state.products[ingredient.name];
        const actionType = isProduct ? "DEDUCT_PRODUCT" : "DEDUCT_RESOURCE";

        dispatch({
          type: actionType,
          resource: isProduct ? undefined : ingredient.name,
          product: isProduct ? ingredient.name : undefined,
          amount: ingredient.amount * craftedAmount, // Multiply by craftedAmount for bulk crafting
        });
      });

      // Add crafted output to state
      dispatch({
        type: "CRAFT_PRODUCT",
        product: craftedProduct,
        amount: craftedAmount,
      });

      // Set notification message and display it
      setNotificationMessage(`Crafted ${craftedAmount} x ${craftedProduct}`);
      setShowNotification(true);

      // Reset selection and crafting state
      setTempSelectedRecipeIndex(null);
      setCurrentMachine(null);
    }
  };
  useEffect(() => {
    if (showNotification) {
      // Hide the notification after 2 seconds
      const timer = setTimeout(() => setShowNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  const resetAfterCrafting = () => {
    setTempSelectedRecipeIndex(null); // Reset selected recipe
    setSelectedRecipes((prev) => ({
      ...prev,
      [currentMachine.displayName]: null,
    })); // Clear recipe in the state
  };

  const handleCardClick = (machineName) => {
    const machineInfo = machineData.find(
      (machine) => machine.displayName === machineName
    );
    setCurrentMachine(machineInfo);
    setTempSelectedRecipeIndex(selectedRecipes[machineName] ?? null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const confirmRecipeSelection = () => {
    if (currentMachine) {
      setSelectedRecipes((prevRecipes) => ({
        ...prevRecipes,
        [currentMachine.displayName]: tempSelectedRecipeIndex,
      }));
      startCrafting();
    }
    setShowModal(false);
  };

  const startCrafting = () => {
    if (currentMachine && tempSelectedRecipeIndex !== null) {
      const recipe = currentMachine.recipes[tempSelectedRecipeIndex];
      const totalDuration = recipe.processingTime * amountToCraft;

      setCraftingDuration(totalDuration);
      setIsCrafting(true);
    }
  };

  const handleRecipeChange = (recipeIndex) => {
    setTempSelectedRecipeIndex(recipeIndex);
  };

  const handleAmountChange = (event) => {
    const newAmount = Math.max(1, parseInt(event.target.value, 10) || 1);
    setAmountToCraft(newAmount);
  };

  const calculateMaxAmountToCraft = () => {
    if (currentMachine && tempSelectedRecipeIndex !== null) {
      const recipe = currentMachine.recipes[tempSelectedRecipeIndex];
      const availableResources = state.resources;

      const maxAmounts = recipe.input.map((input) => {
        const availableAmount = availableResources[input.name] || 0;
        return Math.floor(availableAmount / input.amount);
      });

      return Math.min(...maxAmounts);
    }
    return 1;
  };

  return (
    <>
      <div className="nes-container with-title is-dark my-3 shadow-sm">
        <p className="title">Built Machines</p>
        <div className="d-flex flex-column gap-3 align-items-center">
          {builtMachines.map((machineName, index) => {
            const machineCount = state.machines[machineName];
            const machineInfo = machineData.find(
              (machine) => machine.displayName === machineName
            );

            if (!machineInfo) return null;

            return (
              <div
                key={machineName}
                className="machine-card p-4 d-flex"
                onClick={() => handleCardClick(machineName)}
              >
                <div className="align-self-center z-1">
                  <div className="machine-card-input">
                    {selectedRecipes[machineName] !== null &&
                      selectedRecipes[machineName] !== undefined &&
                      machineInfo.recipes[selectedRecipes[machineName]] &&
                      machineInfo.recipes[
                        selectedRecipes[machineName]
                      ].input.map((input) => (
                        <div className="my-3" key={input.name}>
                          <ProductIcon name={input.name} />
                        </div>
                      ))}
                  </div>
                </div>

                <div
                  className="position-relative"
                  style={getMachineStyle(index)}
                >
                  <div className="position-absolute top-0 w-100">
                    {machineCount > 1 && <AmountBadge amount={machineCount} />}
                  </div>
                  <div
                    className="position-absolute bottom-0 badge badge-pill mb-2 ms-3 fw-light"
                    style={{ backgroundColor: "slateblue" }}
                  >
                    <span className="text-light">{machineName}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 ms-2 mt-2 align-self-center">
                  {selectedRecipes[machineName] !== null &&
                    selectedRecipes[machineName] !== undefined && (
                      <div className="machine-card-output">
                        <div className="d-flex">
                          <ProductIcon
                            name={
                              currentMachine.recipes[
                                selectedRecipes[machineName]
                              ].output.name
                            }
                          />
                          <small
                            className="align-self-center ms-3"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Crafting x{amountToCraft}{" "}
                            {
                              currentMachine.recipes[
                                selectedRecipes[machineName]
                              ].output.name
                            }
                          </small>
                        </div>
                        {isCrafting && (
                          <div
                            className="progress mt-2"
                            style={{ width: 100, marginBottom: "10px" }}
                          >
                            <div
                              className="progress-bar progress-bar-striped border border-dark "
                              role="progressbar"
                              style={{
                                width: `${craftingProgress}%`,
                                backgroundColor: "slateblue",
                              }}
                              aria-valuenow={craftingProgress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentMachine && (
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{currentMachine.displayName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-start gap-5">
                {/* Input Section */}
                <div className="input-section">
                  <strong>Select an Input</strong>
                  <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
                    {currentMachine.recipes.map((recipe, recipeIndex) => (
                      <div
                        key={recipeIndex}
                        className={`input-output-item d-flex flex-column align-items-center ${
                          tempSelectedRecipeIndex === recipeIndex
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleRecipeChange(recipeIndex)}
                      >
                        {/* Regular Inputs */}
                        {recipe.input
                          .filter((input) => input.type !== "fuel")
                          .map((input) => (
                            <div key={input.name} className="input-icon">
                              <ProductIcon name={input.name} />
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Section */}
                {tempSelectedRecipeIndex !== null && (
                  <div className="output-section">
                    <strong>Output</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <div className="input-output-item d-flex flex-column align-items-center">
                        <ProductIcon
                          name={
                            currentMachine.recipes[tempSelectedRecipeIndex]
                              .output.name
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fuel Requirement Section */}
              {tempSelectedRecipeIndex !== null && (
                <div className="fuel-section mt-3">
                  <strong>Fuel Required</strong>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    {currentMachine.recipes[tempSelectedRecipeIndex].input
                      .filter((input) => input.type === "fuel")
                      .map((fuel) => (
                        <div key={fuel.name} className="fuel-icon">
                          <ProductIcon name={fuel.name} />
                          <span className="ms-2">
                            {fuel.amount}x {fuel.displayName}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Amount to Craft Section */}
              {tempSelectedRecipeIndex !== null && (
                <div className="mt-3">
                  <label htmlFor="amountToCraft" className="form-label">
                    Amount to Craft:
                  </label>
                  <input
                    id="amountToCraft"
                    type="number"
                    className="form-control w-50 mb-1"
                    min={1}
                    value={amountToCraft}
                    onChange={handleAmountChange}
                    max={calculateMaxAmountToCraft()}
                  />
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    Max: {calculateMaxAmountToCraft()}
                  </small>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={calculateMaxAmountToCraft() < amountToCraft}
              variant="dark"
              onClick={confirmRecipeSelection}
            >
              Craft
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
}

export default BuiltMachines;
