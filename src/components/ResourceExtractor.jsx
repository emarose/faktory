import React, { useContext, useState } from "react";
import oresData from "../data/ores.json";
import { Button, Card } from "react-bootstrap";
import { GameContext } from "../contexts/GameContext";
import Icon from "./Icon";
import SpriteSheet from "./Spritesheet";
import customCursor from "../assets/pickaxe.png";

function ResourceExtractor() {
  const { state, dispatch } = useContext(GameContext);
  const [animation, setAnimation] = useState({
    show: false,
    position: { x: 0, y: 0 },
    row: 0,
    isAnimating: false,
  });

  const [isCursorHidden, setIsCursorHidden] = useState(false);

  const extractResource = (resourceName, baseRate, row, event) => {
    dispatch({
      type: "EXTRACT_RESOURCE",
      resource: resourceName,
      amount: baseRate,
    });
    console.log(event);

    // Show animation at cursor position and hide default cursor
    setAnimation({
      show: true,
      position: {
        x: event.nativeEvent.layerX, // Adjust so the animation is centered around the cursor
        y: event.nativeEvent.layerY - 20,
      },
      row,
      isAnimating: true,
    });

    setIsCursorHidden(true);
    setTimeout(() => {
      setAnimation((prev) => ({ ...prev, isAnimating: false }));
      setIsCursorHidden(false);
    }, 400);
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
    <div
      style={{
        cursor: isCursorHidden ? "none" : "auto",
      }}
    >
      <Card className="m-3 shadow-sm">
        <Card.Header className="bg-dark text-light">
          Extract Resources
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-3">
            {Object.keys(state.resources).map((resource, index) => (
              <Button
                key={resource}
                variant="dark"
                onClick={(event) =>
                  extractResource(
                    resource,
                    getBaseRate(resource),
                    index + 3,
                    event
                  )
                }
                className="resource-button d-flex align-items-center gap-2 p-2 shadow-sm"
                style={{
                  cursor: isCursorHidden
                    ? "none"
                    : `url(${customCursor}), auto`,
                  minWidth: "150px",
                  flex: "1 1 auto",
                  fontSize: "0.9rem",
                  textAlign: "left",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Icon name={resource} />
                <span className="text-muted">{getDisplayName(resource)}</span>
              </Button>
            ))}
          </div>
          {animation.show && (
            <div
              style={{
                position: "absolute",
                left: `${animation.position.x}px`,
                top: `${animation.position.y}px`,
                pointerEvents: "none", // Make sure it doesn't interfere with clicks
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
      </Card>
    </div>
  );
}

export default ResourceExtractor;
