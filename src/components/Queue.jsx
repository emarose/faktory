import React from "react";
import { ListGroup, Card, ProgressBar } from "react-bootstrap";
import "./styles.css";

function Queue({ queue, crafting, remainingTime }) {
  if (queue.length === 0) return null;

  return (
    <div className="queue-container">
      <Card className="queue-card">
        <Card.Header>Queue</Card.Header>
        <Card.Body>
          <ListGroup>
            {queue.map((product, index) => (
              <ListGroup.Item key={index}>
                {product.displayName}{" "}
                {index === 0 && crafting && "(In Progress)"}
                {index === 0 && crafting && (
                  <ProgressBar
                    now={
                      ((crafting.processingTime - remainingTime) /
                        crafting.processingTime) *
                      100
                    }
                    label={`${remainingTime}s`}
                  />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Queue;
