import React, { useContext } from "react";
import productsData from "../data/products.json";
import { GameContext } from "../contexts/GameContext";
import { Card } from "react-bootstrap";
import Icon from "./Icon";
import AmountBadge from "./AmountBadge";

function Processor() {
  const { state } = useContext(GameContext);

  // Function to determine if a product can be built
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

  return (
    <Card className="m-3 shadow-sm position-relative">
      <Card.Header className="bg-dark text-light">
        Processed Products
      </Card.Header>
      <p>Processor</p>
      <Card.Body>
        <div className="d-flex flex-wrap gap-4">
          {productsData
            .filter(
              (product) =>
                product.type === "product" && canBuildProduct(product)
            )
            .map((product) => {
              const amount = state.products[product.name] || 0;

              return (
                <div
                  key={product.name}
                  className="d-flex flex-column align-items-center p-2 bg-light rounded position-relative"
                  style={{ width: "120px", overflow: "hidden" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={product.name} />
                  </div>
                  <p
                    className="mt-2 text-center text-muted"
                    style={{ fontSize: "0.9rem", wordBreak: "break-word" }}
                  >
                    <strong>{product.displayName}</strong>
                  </p>
                  {amount > 0 && <AmountBadge amount={amount} />}
                </div>
              );
            })}
        </div>
      </Card.Body>
    </Card>
  );
}

export default Processor;
