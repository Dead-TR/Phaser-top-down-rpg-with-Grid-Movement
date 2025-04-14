import { ItemType, Skills } from "type";

export const playerConfig: {
  skillsVolume: Skills;
  skillsMultiplier: Skills;
  skillsMaximumLevel: Skills;
} = {
  skillsMultiplier: {
    bow: 5,
    magic: 10,
    meleeWeapon: 5,
    parry: 5,

    health: 0.7,
    move: 1,
    attackCoolDown: 100,
    lockBreaking: NaN,
  },
  skillsVolume: {
    magic: 50,
    bow: 25,
    meleeWeapon: 50,
    parry: 0,

    health: 15,
    move: 5,
    attackCoolDown: 1000,
    lockBreaking: NaN,
  },
  skillsMaximumLevel: {
    bow: 15,
    magic: 5,
    meleeWeapon: 10,
    parry: 10,

    health: Infinity,
    move: 10,
    attackCoolDown: 10,
    lockBreaking: 10,
  },
};

export const expConfig = {
  volume: 100,
  multiplier: 0.7,

  priceVolume: 3.75,
} as const;

export const managerEvents = {
  UPDATE_SKILL: "UPDATE_SKILL",
  UPDATE_ETHERIAS: "UPDATE_ETHERIAS",

  OPEN_BOX: "OPEN_BOX",
  OPEN_INVENTORY: "OPEN_INVENTORY",
  EQUIP_ITEM: "EQUIP_ITEM",

  OPEN_SKILLS: "OPEN_SKILLS",
  DISTANCE_COMBAT_TYPE: "DISTANCE_COMBAT_TYPE",
};

export const typeNames: Record<ItemType, string> = {
  meleeWeapon: "Зброя ближнього бою",
  bow: "Зброя дальнього бою",
  body: "Обладунки",
  saturator: "Резонатори",
  questItems: "Важливі предмети",
  other: "Інше",
};

export const saturatorEquipAmount = 4;
export const allowedEquipmentTypes: ItemType[] = [
  "body",
  "meleeWeapon",
  "bow",
  "saturator",
];

export const skillsNames: Record<keyof Skills, string> = {
  attackCoolDown: "Ведення Бою",
  bow: "Дальній бій",
  meleeWeapon: "Ближній бій",

  health: "Витривалість",
  lockBreaking: "Взлом замків",
  magic: "Резонатори",
  move: "Швидкість пересування",
  parry: "Парирування",
};
