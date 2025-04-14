import EventEmitter from "events";
import { Item, Skills } from "type";
import { playerConfig, managerEvents, expConfig } from "./config";
import { inventoryManager } from "./InventoryManager";
import { getSkillValue } from "utils";

class PlayerManager {
  constructor() {
    const rmEquip = inventoryManager.listener("equip", () => {
      this.emitter.emit(managerEvents.UPDATE_SKILL);
    });

    this.rmListeners.push(rmEquip);
  }
  private rmListeners: (() => void)[] = [];
  private emitter = new EventEmitter();

  skillLevels: Skills = {
    health: 1,
    attackCoolDown: 1,
    move: 4,
    parry: 0,

    bow: 0,
    meleeWeapon: 1,
    magic: 0,
    lockBreaking: 1,
  };

  skillExp: Skills = {
    health: 0,
    attackCoolDown: 0,
    move: 0,
    parry: 0,

    bow: 0,
    meleeWeapon: 0,
    magic: 0,
    lockBreaking: 0,
  };

  getLevelUpValue = (skill: keyof Skills) => {
    const _100Percent =
      expConfig.volume * expConfig.multiplier * (this.skillLevels[skill] + 1);

    const currentExp = this.skillExp[skill];
    const _1PercentExpValue = _100Percent / 100;
    const currentPercent = currentExp / _1PercentExpValue;

    return {
      _100Percent,
      currentPercent,
      currentExp,
      _1PercentExpValue,
    };
  };

  levelUp = (skill: keyof Skills) => {
    const oldLevel = this.skillLevels[skill];
    this.skillLevels[skill] = oldLevel + 1;
    this.skillExp[skill] = 0;

    this.emitter.emit(managerEvents.UPDATE_SKILL, this.skillLevels);
  };

  getSkillValue = (skill: keyof Skills) =>
    getSkillValue(skill, this.skillLevels, inventoryManager.equipment);

  listenChangeValue = (
    skill: keyof Skills,
    callBack: (value: number) => void,
  ) => {
    const updateSkill = () => {
      const currentSkillValue = this.getSkillValue(skill);
      callBack(currentSkillValue);
    };
    this.emitter.addListener(managerEvents.UPDATE_SKILL, updateSkill);

    return () => {
      this.emitter.removeListener(managerEvents.UPDATE_SKILL, updateSkill);
    };
  };

  listenAllSkills = (callBack: (v: Skills) => void) => {
    this.emitter.addListener(managerEvents.UPDATE_SKILL, callBack);

    return () => {
      this.emitter.removeListener(managerEvents.UPDATE_SKILL, callBack);
    };
  };
}

export const playerManager = new PlayerManager();
