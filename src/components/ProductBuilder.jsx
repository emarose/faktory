import React, { useContext, useState } from "react";
import productsData from "../data/products.json";
import { GameContext } from "../contexts/GameContext";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { useTimer } from "react-timer-hook"; // Import timer hook
import "./styles.css";

function ProductBuilder() {
  const { state, dispatch } = useContext(GameContext);
  const [crafting, setCrafting] = useState(null);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null); // Track expiryTimestamp

  // Check if the player has enough materials to build the product
  const canBuildProduct = (product) => {
    return product.ingredients.every((ingredient) => {
      return (state.resources[ingredient.name] || 0) >= ingredient.amount;
    });
  };

  // Function to build the product
  const buildProduct = (product) => {
    if (!canBuildProduct(product)) {
      alert(`Not enough materials to craft ${product.displayName}`);
      return;
    }

    // Deduct resources
    product.ingredients.forEach((ingredient) => {
      dispatch({
        type: "DEDUCT_RESOURCE",
        resource: ingredient.name,
        amount: ingredient.amount,
      });
    });

    // Set up crafting process
    setCrafting(product);

    // Define the expiration time for crafting
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(
      newExpiryTimestamp.getSeconds() + product.processingTime
    );

    setExpiryTimestamp(newExpiryTimestamp); // Update expiry timestamp
    restart(newExpiryTimestamp); // Start the timer
  };

  // Timer logic with react-timer-hook
  const { seconds, isRunning, restart } = useTimer({
    autoStart: false,
    expiryTimestamp: expiryTimestamp || new Date(), // Provide fallback for the initial render
    onExpire: () => {
      if (crafting) {
        dispatch({
          type: "CRAFT_PRODUCT",
          product: crafting.name,
          outputQuantity: crafting.outputQuantity,
        });
        setCrafting(null); // Reset crafting state after completion
      }
    },
  });

  return (
    <Card className="product-card">
      <Card.Header>Available Products</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        ProductBuilder
      </Card.Subtitle>
      {productsData.map((product) => {
        const isBuildable = canBuildProduct(product);
        return (
          <div key={product.name}>
            <Card.Body className="border-bottom">
              <Card.Title>{product.displayName}</Card.Title>
              <p>Ingredients:</p>
              <ul>
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient.name}>
                    {ingredient.amount}x {ingredient.displayName}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="dark"
                onClick={() => buildProduct(product)}
                disabled={!isBuildable || !!crafting || isRunning}
              >
                {crafting?.name === product.name
                  ? `Crafting...`
                  : `Craft ${product.displayName}`}
              </Button>
              {!isBuildable && (
                <span className="small ms-3 badge bg-danger">
                  Not enough materials
                </span>
              )}
              {crafting?.name === product.name && (
                <div className="mt-2">
                  <ProgressBar
                    now={(seconds / product.processingTime) * 100}
                    label={`${seconds}s`}
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

export default ProductBuilder;
