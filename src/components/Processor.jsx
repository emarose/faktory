import React, { useContext } from "react";
import productsData from "../data/products.json";
import { GameContext } from "../contexts/GameContext";

import AmountBadge from "./AmountBadge";
import "./styles.css";
import ProductIcon from "./productIcon";

function Processor() {
  const { state } = useContext(GameContext);

  if (!state.products) {
    return null;
  }

  return (
    <div className="nes-container with-title is-dark my-3 col-12">
      <p className="title">Processed Products</p>

      <div className="product-grid">
        {productsData
          .filter((product) => state.products[product.name] > 0)
          .map((product) => {
            const amount = state.products[product.name] || 0;

            return (
              <div
                key={product.name}
                className="nes-container pb-1 pt-4 is-dark is-rounded d-flex flex-column align-items-center justify-content-center"
              >
                <div className="align-items-center d-flex flex-column">
                  <div className="d-flex flex-column align-items-center">
                    <ProductIcon name={product.name} />
                    <p
                      className="fw-light mt-2 text-nowrap"
                      style={{ fontSize: "0.69rem" }}
                    >
                      {product.displayName}
                    </p>
                  </div>

                  <AmountBadge amount={amount} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Processor;
