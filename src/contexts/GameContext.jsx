import React, { createContext, useReducer } from "react";

const initialState = {
  resources: {
    ironOre: 0,
    copperOre: 0,
    coal: 0,
    //biomass: 0,
    //stone: 0,
  },
  products: {},
  machines: {},
  milestones: { build_assembler: false },
  unlockedTiers: {
    tier1: true,
    tier2: false,
    tier3: false,
    tier4: false,
    tier5: false,
    tier6: false,
  },
};

const milestoneToTierMapping = {
  build_assembler: "tier2",
  build_processor: "tier3",
  construct_bio_processor: "tier4",
  build_bio_furnace: "tier5",
  create_mech_bio_unit: "tier6",
  activate_bio_environment: "tier7",
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
      const { product, amount } = action;
      return {
        ...state,
        products: {
          ...state.products,
          [product]: (state.products[product] || 0) + amount,
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

      // Use milestoneToTierMapping to unlock the next tier
      const nextTier = milestoneToTierMapping[action.milestone];
      if (nextTier) {
        updatedTiers[nextTier] = true;
      }

      console.log("Updated milestones:", updatedMilestones);
      console.log("Updated tiers:", updatedTiers);

      return {
        ...state,
        milestones: updatedMilestones,
        unlockedTiers: updatedTiers,
      };
    case "UNLOCK_TIER":
      return {
        ...state,
        unlockedTiers: {
          ...state.unlockedTiers,
          [action.tier]: true,
        },
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
