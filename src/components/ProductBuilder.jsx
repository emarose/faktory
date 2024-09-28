import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { Button, Card } from "react-bootstrap";
import productsData from "../data/products.json";

function ProductBuilder({ setQueue, crafting }) {
  const { state, dispatch } = useContext(GameContext);

  const canBuildProduct = (product) => {
    return product.ingredients.every((ingredient) => {
      return (state.resources[ingredient.name] || 0) >= ingredient.amount;
    });
  };

  const addProductToQueue = (product) => {
    if (!canBuildProduct(product)) {
      alert(`Not enough materials to craft ${product.displayName}`);
      return;
    }

    product.ingredients.forEach((ingredient) => {
      dispatch({
        type: "DEDUCT_RESOURCE",
        resource: ingredient.name,
        amount: ingredient.amount,
      });
    });

    setQueue((prevQueue) => [...prevQueue, product]);
  };

  return (
    <Card className="product-card">
      <Card.Header>Available Products</Card.Header>
      <Card.Subtitle className="text-muted px-3 pt-3">
        ProductBuilder
      </Card.Subtitle>

      {productsData.map((product) => {
        const isBuildable = canBuildProduct(product);
        const isCrafting = crafting && crafting.name === product.name;

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
                onClick={() => addProductToQueue(product)}
                disabled={!isBuildable}
              >
                {isCrafting ? "Crafting..." : `Craft ${product.displayName}`}
              </Button>
              {!isBuildable && (
                <span className="small ms-3 badge bg-danger">
                  Not enough materials
                </span>
              )}
            </Card.Body>
          </div>
        );
      })}
    </Card>
  );
}

export default ProductBuilder;
