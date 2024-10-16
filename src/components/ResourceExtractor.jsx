import React, { useContext, useState } from "react";
import oresData from "../data/ores.json";
import { Button, Card } from "react-bootstrap";
import { GameContext } from "../contexts/GameContext";
import SpriteSheet from "./Spritesheet";
import AmountBadge from "./AmountBadge";
import ProductIcon from "./productIcon";

function ResourceExtractor() {
  const { state, dispatch } = useContext(GameContext);
  const [animation, setAnimation] = useState({
    show: false,
    position: { x: 0, y: 0 },
    row: 0,
    isAnimating: false,
  });

  const extractResource = (resourceName, baseRate, row, event) => {
    dispatch({
      type: "EXTRACT_RESOURCE",
      resource: resourceName,
      amount: baseRate,
    });

    const buttonRect = event.currentTarget.getBoundingClientRect();

    setAnimation({
      show: true,
      position: {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      },
      row,
      isAnimating: true,
    });

    setTimeout(() => {
      setAnimation((prev) => ({ ...prev, isAnimating: false }));
    }, 360);
  };

  const handleAnimationEnd = () => {
    setAnimation((prev) => ({ ...prev, show: false, isAnimating: false }));
  };

  const getDisplayName = (resourceName) => {
    const resource = oresData.find((ore) => ore.name === resourceName);
    return resource ? resource.displayName : resourceName;
  };

  const getBaseRate = (resourceName) => {
    const resource = oresData.find((ore) => ore.name === resourceName);
    return resource ? resource.baseRate : 1;
  };

  return (
    <div className="nes-container with-title is-dark my-3 shadow-sm col-12 ">
      <p className="title">Resource Extractor</p>
      <Card.Body>
        <div className="d-flex flex-wrap gap-3 position-relative ">
          {Object.keys(state.resources).map((resource, index) => {
            const amount = state.resources[resource] || 0;

            return (
              <div
                key={resource}
                className="position-relative"
                style={{ width: "auto" }}
              >
                <Button
                  variant="secondary"
                  onClick={(event) =>
                    extractResource(
                      resource,
                      getBaseRate(resource),
                      index + 3,
                      event
                    )
                  }
                  className="d-flex align-items-center gap-2 p-2 shadow-sm"
                  style={{
                    cursor: "pointer",
                    minWidth: "240px",

                    fontSize: "0.8rem",
                    textAlign: "left",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <ProductIcon name={resource} />
                  <span className="text-muted">{getDisplayName(resource)}</span>
                </Button>
                {amount > 0 && <AmountBadge amount={amount} />}
              </div>
            );
          })}
        </div>
        {animation.show && (
          <div
            style={{
              position: "fixed",
              left: `${animation.position.x}px`,
              top: `${animation.position.y}px`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          >
            <SpriteSheet
              row={animation.row}
              spriteWidth={64}
              spriteHeight={64}
              isAnimating={animation.isAnimating}
              onAnimationEnd={handleAnimationEnd}
            />
          </div>
        )}
      </Card.Body>
    </div>
  );
}

export default ResourceExtractor;
