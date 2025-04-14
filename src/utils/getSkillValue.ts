import { EquipmentItems, Skills } from "type";
import { playerConfig } from "managers/config";
import { getAllBenefitsFromEquipItems } from "./getAllBenefitsFromEquipItems";

export const getSkillValue = (
  skill: keyof Skills,
  levels: Skills,
  equipment: EquipmentItems
  ) => {
  const level = levels[skill];
  const volume = playerConfig.skillsVolume[skill];
  const mul = playerConfig.skillsMultiplier[skill];
  // inventory mod add here too but later
  const equip = getAllBenefitsFromEquipItems(equipment);

  switch (skill) {
    case "health":
      return Math.ceil(volume * (mul * level) + equip.health);

    case "attackCoolDown":
      return volume + mul - level * mul + equip.attackCoolDown;
    case "move":
    case "meleeWeapon":
    case "bow":
    case "magic":
    case "parry":
      return volume + level * mul + equip[skill];

    default:
      return level + equip[skill];
  }
};