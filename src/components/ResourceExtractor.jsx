import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import oresData from "../data/ores.json";
import { Button, Card } from "react-bootstrap";

function ResourceExtractor() {
  const { state, dispatch } = useContext(GameContext);

  const extractResource = (resourceName, baseRate) => {
    dispatch({
      type: "EXTRACT_RESOURCE",
      resource: resourceName,
      amount: baseRate,
    });
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
    <>
      <Card>
        <Card.Header>Extract Resources</Card.Header>
        <Card.Subtitle className="text-muted px-3 pt-3">
          ResourceExtractor
        </Card.Subtitle>
        <Card.Body className="d-flex gap-2">
          {Object.keys(state.resources).map((resource) => (
            <Button
              key={resource}
              variant="dark"
              onClick={() => extractResource(resource, getBaseRate(resource))}
            >
              Extract {getDisplayName(resource)} ({state.resources[resource]})
            </Button>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

export default ResourceExtractor;
