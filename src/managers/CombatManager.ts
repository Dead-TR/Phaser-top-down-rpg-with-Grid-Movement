import EventEmitter from "events";
import { DistanceCombatType } from "type";
import { createListener } from "utils";
import { managerEvents } from "./config";

class CombatManager {
  constructor() {}

  private emitter = new EventEmitter();
  distanceCombatType: DistanceCombatType | null = null;

  listeners = {
    distanceCombatType: (callback: (type: DistanceCombatType | null) => void) => {
      return createListener(
        this.emitter,
        managerEvents.DISTANCE_COMBAT_TYPE,
        callback,
      );
    },
  } as const;
  setters = {
    distanceCombatType: (type: DistanceCombatType | null) => {
      this.distanceCombatType = type;
      this.emitter.emit(managerEvents.DISTANCE_COMBAT_TYPE, type);
    },
  } as const;
}

export const combatManager = new CombatManager();
