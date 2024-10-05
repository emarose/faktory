import React from "react";
import { ListGroup, Card, ProgressBar } from "react-bootstrap";
import "./styles.css";

function Queue({ title, queue, crafting, remainingTime }) {
  if (queue.length === 0) return null;

  return (
    <div className="queue-container">
      <Card className="queue-card">
        <Card.Header>{title}</Card.Header>
        <Card.Body>
          <ListGroup>
            {queue.map((item, index) => (
              <ListGroup.Item key={index}>
                {item.displayName} {index === 0 && crafting && "(In Progress)"}
                {index === 0 && crafting && (
                  <ProgressBar
                    now={
                      (((item.processingTime || item.buildTime) -
                        remainingTime) /
                        (item.processingTime || item.buildTime)) *
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
