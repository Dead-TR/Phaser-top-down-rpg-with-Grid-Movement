import { EquipmentItems, Item, Skills } from "type";

export const getAllBenefitsFromEquipItems = (equipment: EquipmentItems) => {
  const sumSkillBonus = Object.entries(equipment).reduce(
    (acm, [type, item]: [string, Item | Item[] | undefined]) => {
      const getSkills = (skills: Skills) => {
        Object.entries(skills).forEach(([skill, value]) => {
          if (skill && value) acm[skill as keyof Skills] += value as number;
        });
      };

      if (item) {
        const isArray = Array.isArray(item);

        if (isArray) {
          item.forEach((i) => {
            //@ts-ignore
            const currentSkills = i?.skills as Skills | undefined;
            if (currentSkills) getSkills(currentSkills);
          });
        } else {
          //@ts-ignore
          const currentSkills = item?.skills as Skills | undefined;
          if (currentSkills) getSkills(currentSkills);
        }
      }

      return acm;
    },
    {
      attackCoolDown: 0,
      bow: 0,
      health: 0,
      lockBreaking: 0,
      magic: 0,
      meleeWeapon: 0,
      move: 0,
      parry: 0,
    } as Skills,
  );

  return sumSkillBonus;
};
