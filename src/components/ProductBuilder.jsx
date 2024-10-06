import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";
import productsData from "../data/products.json";
import milestonesData from "../data/milestones.json";
import Icon from "./Icon";
import "./styles.css";
import { IoHammer } from "react-icons/io5";

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
    product.ingredients.forEach((ingredient) => {
      dispatch({
        type: "DEDUCT_RESOURCE",
        resource: ingredient.name,
        amount: ingredient.amount,
      });
    });
    setQueue((prevQueue) => [...prevQueue, { ...product, type: "product" }]);
    setTimeout(() => {
      dispatch({
        type: "CRAFT_PRODUCT",
        product: product,
      });
    }, 2000); // Adjust the delay as per your crafting time
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

  const availableProducts = productsData.filter((product) => {
    const isTierUnlocked = state.unlockedTiers[`tier${product.tier}`];

    const isMachineRequiredBuilt =
      !product.machineRequired || !!state.machines[product.machineRequired];

    return isTierUnlocked && isMachineRequiredBuilt;
  });

  if (availableProducts.length === 0) {
    return null;
  }

  return (
    <Card className="product-card">
      <Card.Header>Product Builder</Card.Header>

      <div className="product-grid">
        {availableProducts.map((product) => {
          const isBuildable = canBuildProduct(product);
          const isCrafting = crafting && crafting.name === product.name;

          return (
            <Card key={product.name} className="m-2 product-item">
              <Card.Body className="p-2 align-items-center d-flex flex-column">
                <div className="d-flex flex-column align-items-center mt-2">
                  <Icon name={product.name} />
                  <Card.Title>{product.displayName}</Card.Title>
                </div>
                <ul>
                  {product.ingredients.map((ingredient) => (
                    <small key={ingredient.name}>
                      {ingredient.amount}x {ingredient.displayName}
                    </small>
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
                  onClick={() => addProductToQueue(product)}
                  disabled={!isBuildable || !!crafting}
                >
                  <IoHammer size={24} />
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

export default ProductBuilder;
