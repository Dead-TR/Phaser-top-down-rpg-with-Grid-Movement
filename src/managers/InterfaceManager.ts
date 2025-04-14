import EventEmitter from "events";
import { createListener } from "utils";
import { managerEvents } from "./config";
import { Skills } from "type";

class InterfaceManager {
  private emitter = new EventEmitter();

  listeners = {
    openSkills: (callBack: (skill: keyof Skills) => void) =>
      createListener(this.emitter, managerEvents.OPEN_SKILLS, callBack),
  } as const;

  setters = {
    openSkills: (skill: keyof Skills) =>
      this.emitter.emit(managerEvents.OPEN_SKILLS, skill),
  };
}

export const interfaceManager = new InterfaceManager();
