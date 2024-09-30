import React, { useState, useEffect, useContext } from "react";
import ResourceExtractor from "./components/ResourceExtractor";
import Processor from "./components/Processor";
import MachineBuilder from "./components/MachineBuilder";
import ProductBuilder from "./components/ProductBuilder";
import Queue from "./components/Queue";
import { GameContext } from "./contexts/GameContext"; // Import GameContext
import "bootstrap/dist/css/bootstrap.min.css";
import BuiltMachines from "./components/BuiltMachines";
import MachineQueue from "./components/MachineQueue";

function App() {
  const [queue, setQueue] = useState([]); // State for the queue
  const [crafting, setCrafting] = useState(null); // State for currently crafting product
  const [remainingTime, setRemainingTime] = useState(0); // Time left for crafting

  // Wrap useContext in a check to avoid undefined issues
  const { dispatch } = useContext(GameContext);

  useEffect(() => {
    if (!crafting) return;

    let timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Clear the timer immediately
          setQueue((prevQueue) => prevQueue.slice(1)); // Remove completed product from queue
          dispatch({ type: "CRAFT_PRODUCT", product: crafting });

          // Reset crafting state to prepare for the next product
          setCrafting(null);
          return 0;
        }
        return prevTime - 1; // Decrease time
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up on component unmount or dependency change
  }, [crafting, dispatch]);

  // Automatically start the next product when the queue changes and nothing is crafting
  useEffect(() => {
    if (queue.length > 0 && !crafting && remainingTime === 0) {
      const nextProduct = queue[0];
      setCrafting(nextProduct);
      setRemainingTime(nextProduct.processingTime);
    }
  }, [queue, crafting, remainingTime]);

  return (
    <div className="container">
      <h2 className="text-center my-4">Faktory</h2>

      {/* Render Queue as an independent element to avoid layout shift */}
      <Queue queue={queue} crafting={crafting} remainingTime={remainingTime} />
      <MachineQueue
        queue={queue}
        crafting={crafting}
        remainingTime={remainingTime}
      />

      <div className="row mb-2">
        <div className="col-md-6">
          <ResourceExtractor />
        </div>
        <div className="col-md-6">
          <Processor />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <ProductBuilder
            queue={queue}
            setQueue={setQueue}
            crafting={crafting}
            setCrafting={setCrafting}
            setRemainingTime={setRemainingTime}
          />
        </div>
        <div className="col-md-6">
          <MachineBuilder />
          <BuiltMachines />
        </div>
      </div>
    </div>
  );
}

export default App;
