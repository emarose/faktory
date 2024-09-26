import React, { createContext, useReducer } from "react";
import oresData from "../data/ores.json";

const initialState = {
  resources: {
    ironOre: 0,
    copperOre: 0,
    coal: 0,
  },
  products: {
    ironPlate: 0,
    copperWire: 0,
    circuit: 0,
  },
  machines: {
    furnace: 0,
    assembler: 0,
  },
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "EXTRACT_RESOURCE":
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: state.resources[action.resource] + action.amount,
        },
      };
    case "PROCESS_RESOURCE":
      const hasEnough = state.resources[action.resource] >= action.amount;
      if (!hasEnough) return state;
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: state.resources[action.resource] - action.amount,
        },
      };
    case "CRAFT_PRODUCT":
      return {
        ...state,
        products: {
          ...state.products,
          [action.product]:
            state.products[action.product] + action.outputQuantity,
        },
      };
    case "DEDUCT_RESOURCE":
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: state.resources[action.resource] - action.amount,
        },
      };
    case "DEDUCT_PRODUCT":
      return {
        ...state,
        products: {
          ...state.products,
          [action.product]: state.products[action.product] - action.amount,
        },
      };
    case "BUILD_MACHINE":
      return {
        ...state,
        machines: {
          ...state.machines,
          [action.machine]: (state.machines[action.machine] || 0) + 1,
        },
      };
    case "START_BUILDING_MACHINE":
      return {
        ...state,
        // Start the building process
        building: {
          machine: action.machine,
          remainingTime: action.time,
        },
      };
    case "COMPLETE_BUILDING_MACHINE":
      return {
        ...state,
        // Complete the building process
        machines: {
          ...state.machines,
          [action.machine]: (state.machines[action.machine] || 0) + 1,
        },
        building: null,
      };
    default:
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
