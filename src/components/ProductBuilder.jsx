import React, { useContext } from "react";
import oresData from "../data/ores.json";
import { GameContext } from "../contexts/GameContext";
import "./styles.css";
import { Button, Card } from "react-bootstrap";

function ProductBuilder() {
  const { state, dispatch } = useContext(GameContext);

  const craftProduct = (product) => {
    const hasResources = product.ingredients.every((ingredient) => {
      if (state.resources[ingredient.name] !== undefined) {
        return state.resources[ingredient.name] >= ingredient.amount;
      } else if (state.products[ingredient.name] !== undefined) {
        return state.products[ingredient.name] >= ingredient.amount;
      }
      return false;
    });

    if (!hasResources) {
      alert(`Not enough resources to craft ${product.displayName}`);
      return;
    }

    product.ingredients.forEach((ingredient) => {
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
      type: "ADD_PRODUCT",
      product: product.name,
      amount: product.outputQuantity,
    });

    alert(`${product.displayName} crafted successfully!`);
  };

  return (
    <Card>
      <Card.Header>Craftable Products</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        ProductBuilder
      </Card.Subtitle>
      <div>
        {oresData
          .filter((item) => item.type === "product")
          .map((product) => (
            <div className="border-bottom" key={product.name}>
              <Card.Body>
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
                  onClick={() => craftProduct(product)}
                >
                  Craft {product.displayName}
                </Button>
              </Card.Body>
            </div>
          ))}{" "}
      </div>
    </Card>
  );
}

export default ProductBuilder;
