import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GameProvider } from "./contexts/GameContext.jsx";

createRoot(document.getElementById("root")).render(
  <GameProvider>
    <App />
  </GameProvider>
);
