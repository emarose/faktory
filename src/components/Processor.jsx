import React, { useContext } from "react";
import oresData from "../data/ores.json";
import { GameContext } from "../contexts/GameContext";
import { Card } from "react-bootstrap";

function Processor() {
  const { state } = useContext(GameContext);

  return (
    <>
      <Card>
        <Card.Header>Processed Products</Card.Header>
        <Card.Subtitle className="text-muted px-3 pt-3">
          Processor
        </Card.Subtitle>
        <Card.Body>
          <div className="d-flex gap-4">
            {oresData
              .filter((product) => product.type === "product")
              .map((product) => (
                <div key={product.name}>
                  <p>
                    {product.displayName}: {state.products[product.name]}
                  </p>
                </div>
              ))}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default Processor;
