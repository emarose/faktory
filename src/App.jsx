import React from "react";
import ResourceExtractor from "./components/ResourceExtractor";
import Processor from "./components/Processor";
import MachineBuilder from "./components/MachineBuilder";
import ProductBuilder from "./components/ProductBuilder";
import { GameProvider } from "./contexts/GameContext";
import "bootstrap/dist/css/bootstrap.min.css";
import BuiltMachines from "./components/BuiltMachines";

function App() {
  return (
    <GameProvider>
      <div className="container">
        <h2 className="text-center my-4">Faktory</h2>
        <div className="row mb-2">
          <div className="col-md-6">
            <ResourceExtractor />
          </div>
          <div className="col-md-6">
            <Processor />
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            <ProductBuilder />
          </div>
          <div className="col-md-6">
            <MachineBuilder />
            <BuiltMachines />
          </div>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
