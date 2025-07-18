import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";
import productsData from "../data/products.json";
import milestonesData from "../data/milestones.json";
import Icon from "./Icon";
import "./styles.css";
import { IoHammer } from "react-icons/io5";
import ProductIcon from "./productIcon";

function ProductBuilder({ setQueue, queue, crafting }) {
  const { state, dispatch } = useContext(GameContext);

  const canBuildProduct = (product) => {
    const isMachineRequiredBuilt =
      !product.machineRequired || !!state.machines[product.machineRequired];

    product.ingredients.every((ingredient) => {
      ingredient;
    });

    return (
      isMachineRequiredBuilt &&
      product.ingredients.every((ingredient) => {
        return (
          (state.resources[ingredient.name] ||
            state.products[ingredient.name] ||
            0) >= ingredient.amount
        );
      })
    );
  };

  const addProductToQueue = (product) => {
    console.log("🚀 ~ addProductToQueue ~ product:", product.ingredients);

    product.ingredients.forEach((ingredient) => {
      const isProduct = !!state.products[ingredient.name];
      const actionType = isProduct ? "DEDUCT_PRODUCT" : "DEDUCT_RESOURCE";

      dispatch({
        type: actionType,
        resource: isProduct ? undefined : ingredient.name,
        product: isProduct ? ingredient.name : undefined,
        amount: ingredient.amount,
      });
    });

    // Add product to the queue
    setQueue((prevQueue) => [...prevQueue, { ...product, type: "product" }]);
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
    <div className="nes-container with-title is-dark my-3 col-12">
      <p className="title">Product Builder</p>

      <div className="product-grid">
        {availableProducts.map((product) => {
          const isBuildable = canBuildProduct(product);

          return (
            <div
              key={product.name}
              className="nes-container is-dark is-rounded d-flex flex-column align-items-center justify-content-between "
            >
              <ProductIcon
                className={`${!isBuildable ? "grayscale" : ""}`}
                name={product.name}
              />
              <p
                className="fw-light mt-2 text-nowrap"
                style={{
                  fontSize: "0.8rem",
                  color: !isBuildable ? "gray" : "white",
                }}
              >
                {product.displayName}
              </p>
              <div className="d-flex flex-column gap-1">
                {product.ingredients.map((ingredient) => (
                  <span
                    className="badge badge-pill fw-light text-nowrap"
                    style={{
                      backgroundColor: "slateblue",
                      fontSize: "0.7rem",
                    }}
                    key={ingredient.name}
                  >
                    {ingredient.amount}x {ingredient.displayName}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className={`nes-btn mt-3  ${!isBuildable && "is-disabled"}`}
                style={{
                  padding: 4,
                }}
                onClick={() => addProductToQueue(product)}
                disabled={!isBuildable}
              >
                <IoHammer size={26} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductBuilder;
