import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./contexts/GameContext";
import ResourceExtractor from "./components/ResourceExtractor";
import Processor from "./components/Processor";
import MachineBuilder from "./components/MachineBuilder";
import ProductBuilder from "./components/ProductBuilder";
import Queue from "./components/Queue";
import BuiltMachines from "./components/BuiltMachines";
import MachineQueue from "./components/MachineQueue";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [queue, setQueue] = useState([]);
  const [crafting, setCrafting] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const { state, dispatch } = useContext(GameContext);

  useEffect(() => {
    if (!crafting) return;

    let timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setQueue((prevQueue) => prevQueue.slice(1));
          dispatch({ type: "CRAFT_PRODUCT", product: crafting });

          setCrafting(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [crafting, dispatch]);

  useEffect(() => {
    if (queue.length > 0 && !crafting && remainingTime === 0) {
      const nextProduct = queue[0];
      setCrafting(nextProduct);
      setRemainingTime(nextProduct.processingTime);
    }
  }, [queue, crafting, remainingTime]);

  // Determine if any processed products are available
  const hasProcessedProducts = Object.values(state.products || {}).some(
    (amount) => amount > 0
  );

  return (
    <div className="container">
      <h2 className="text-center my-4">Faktory</h2>

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
        <div className="col-md-6">{hasProcessedProducts && <Processor />}</div>
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
