import React, { useEffect } from "react";
import { ListGroup, Card, ProgressBar } from "react-bootstrap";
import "./styles.css";

function MachineQueue({ queue, crafting, remainingTime }) {
  if (queue.length === 0) return null;
  useEffect(() => {}, [queue, crafting, remainingTime]);

  return (
    <div className="queue-container">
      <Card className="queue-card">
        <Card.Header>Queue</Card.Header>
        <Card.Body>
          <ListGroup>
            {queue.map((machine, index) => (
              <ListGroup.Item key={index}>
                {machine.displayName}{" "}
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

export default MachineQueue;
