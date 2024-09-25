import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

function BuiltMachines() {
  const { state } = useContext(GameContext);

  return (
    <div>
      <h3>Built Machines</h3>
      {Object.keys(state.machines).map(
        (machine) =>
          state.machines[machine] > 0 && (
            <p key={machine}>
              {machine.replace("Level", "")}: {state.machines[machine]}
            </p>
          )
      )}
    </div>
  );
}

export default BuiltMachines;
