import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./contexts/GameContext";
import ResourceExtractor from "./components/ResourceExtractor";
import Processor from "./components/Processor";
import MachineBuilder from "./components/MachineBuilder";
import ProductBuilder from "./components/ProductBuilder";
import Queue from "./components/Queue";
import BuiltMachines from "./components/BuiltMachines";
import productsData from "./data/products.json";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // Unified state for both products and machines
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

          if (crafting.type === "product") {
            dispatch({ type: "CRAFT_PRODUCT", product: crafting.displayName });
          } else if (crafting.type === "machine") {
            dispatch({ type: "BUILD_MACHINE", machine: crafting.displayName });
          }

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
      const nextItem = queue[0];
      setCrafting(nextItem);
      setRemainingTime(nextItem.processingTime || nextItem.buildTime);
    }
  }, [queue, crafting, remainingTime]);

  const hasProcessedProducts = Object.values(state.products || {}).some(
    (amount) => amount > 0
  );

  const hasMachinesBuilt = Object.values(state.machines || {}).some(
    (amount) => amount > 0
  );

  const getAvailableProducts = () => {
    return productsData.filter((product) => {
      const isTierUnlocked = state.unlockedTiers[`tier${product.tier}`];

      const isMachineRequiredBuilt =
        !product.machineRequired || !!state.machines[product.machineRequired];

      return isTierUnlocked && isMachineRequiredBuilt;
    });
  };

  const availableProducts = getAvailableProducts();

  return (
    <div className="container-fluid bg-dark" style={{ minHeight: "100vh" }}>
      <Queue
        title="Crafting Queue"
        queue={queue}
        crafting={crafting}
        remainingTime={remainingTime}
      />

      <div className="row mb-2">
        <div className="col-md-12">
          <ResourceExtractor />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-12">{hasProcessedProducts && <Processor />}</div>
      </div>
      <div className="row mb-2">
        <div className="col-md-12">{hasMachinesBuilt && <BuiltMachines />}</div>
      </div>
      <div className="row mb-2">
        <div className="col-md-12">
          {availableProducts.length > 0 && (
            <ProductBuilder queue={queue} setQueue={setQueue} />
          )}
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-12">
          <MachineBuilder queue={queue} setQueue={setQueue} />
        </div>
      </div>
    </div>
  );
}

export default App;
