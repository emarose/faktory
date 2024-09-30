import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";
import productsData from "../data/products.json";
import milestonesData from "../data/milestones.json";
import "./styles.css";

function ProductBuilder({ setQueue, crafting }) {
  const { state, dispatch } = useContext(GameContext);

  const canBuildProduct = (product) => {
    const isMachineRequiredBuilt =
      !product.machineRequired || !!state.machines[product.machineRequired];

    return (
      isMachineRequiredBuilt &&
      product.ingredients.every((ingredient) => {
        return (state.resources[ingredient.name] || 0) >= ingredient.amount;
      })
    );
  };

  const addProductToQueue = (product) => {
    console.log("🚀 ~ addProductToQueue ~ product:", product);
    if (!canBuildProduct(product)) {
      alert(`Not enough materials to craft ${product.displayName}`);
      return;
    }

    // Deduct resources for the product
    product.ingredients.forEach((ingredient) => {
      dispatch({
        type: "DEDUCT_RESOURCE",
        resource: ingredient.name,
        amount: ingredient.amount,
      });
    });

    // Add product to the queue
    setQueue((prevQueue) => [...prevQueue, product]);

    // Dispatch the CRAFT_PRODUCT action
    dispatch({
      type: "CRAFT_PRODUCT",
      product: product,
    });

    // Check for milestones
    milestonesData.forEach((milestone) => {
      console.log("Current product count:", state.products[product.name]);
      console.log("Milestone required amount:", milestone.requiredAmount);
      console.log("Milestone resource:", milestone.resource);
      console.log(
        "Milestone achieved status:",
        state.milestones[milestone.milestone]
      );

      if (
        state.products[product.name] >= milestone.requiredAmount &&
        milestone.resource === product.name &&
        !state.milestones[milestone.milestone]
      ) {
        achieveMilestone(milestone);
      }
    });
  };

  const achieveMilestone = (milestone) => {
    console.log("🚀 ~ achieveMilestone ~ milestone:", milestone);
    dispatch({
      type: "COMPLETE_MILESTONE",
      milestone: milestone.milestone,
    });

    // Trigger alert for the milestone achievement
    alert(
      `Milestone Achieved: ${milestone.description}!\nRewards:\n- ${milestone.reward.researchPoints} Research Points\n- Unlocks: ${milestone.reward.unlocks}`
    );
  };

  return (
    <Card className="product-card">
      <Card.Header>Available Products</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        ProductBuilder
      </Card.Subtitle>
      <div className="product-grid">
        {productsData
          .filter((product) => {
            // Check if the tier is unlocked
            const isTierUnlocked = state.unlockedTiers[`tier${product.tier}`];
            // Check if the machine required is built
            const isMachineRequiredBuilt =
              !product.machineRequired ||
              !!state.machines[product.machineRequired];

            return isTierUnlocked && isMachineRequiredBuilt; // Show only products for unlocked tiers and machines built
          })
          .map((product) => {
            const isBuildable = canBuildProduct(product);
            const isCrafting = crafting && crafting.name === product.name;

            return (
              <Card key={product.name} className="m-2 product-item">
                <Card.Body className="p-2">
                  <Card.Title>{product.displayName}</Card.Title>
                  <ul>
                    {product.ingredients.map((ingredient) => (
                      <small key={ingredient.name}>
                        {ingredient.amount}x {ingredient.displayName}
                      </small>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => addProductToQueue(product)}
                    disabled={!isBuildable}
                  >
                    {isCrafting
                      ? "Crafting..."
                      : `Craft ${product.displayName}`}
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
  );
}

export default ProductBuilder;
