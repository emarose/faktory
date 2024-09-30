import React, { createContext, useReducer } from "react";

const initialState = {
  resources: {
    ironOre: 0,
    copperOre: 0,
    coal: 0,
    biomass: 0,
    stone: 0,
  },
  products: {},
  machines: {},
  milestones: { build_furnace: false },
  unlockedTiers: {
    tier1: true,
    tier2: true,
    tier3: false,
    tier4: false,
    tier5: false,
    tier6: false,
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
    case "CRAFT_PRODUCT": {
      const productName = action.product.name;
      return {
        ...state,
        products: {
          ...state.products,
          [productName]: (state.products[productName] || 0) + 1,
        },
      };
    }
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
        building: {
          machine: action.machine,
          remainingTime: action.time,
        },
      };
    case "COMPLETE_BUILDING_MACHINE":
      return {
        ...state,
        machines: {
          ...state.machines,
          [action.machine]: (state.machines[action.machine] || 0) + 1,
        },
        building: null,
      };
    case "COMPLETE_MILESTONE":
      console.log(`Completing milestone: ${action.milestone}`);

      const updatedMilestones = {
        ...state.milestones,
        [action.milestone]: true,
      };

      let updatedTiers = { ...state.unlockedTiers };
      switch (action.milestone) {
        case "build_furnace":
          updatedTiers.tier2 = true;
          break;
        case "construct_bio_processor":
          updatedTiers.tier3 = true;
          break;
        case "build_bio_furnace":
          updatedTiers.tier4 = true;
          break;
        case "create_mech_bio_unit":
          updatedTiers.tier5 = true;
          break;
        case "activate_bio_environment":
          updatedTiers.tier6 = true;
          break;
        default:
          break;
      }

      console.log("Updated milestones:", updatedMilestones);
      console.log("Updated tiers:", updatedTiers);

      return {
        ...state,
        milestones: updatedMilestones,
        unlockedTiers: updatedTiers,
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
