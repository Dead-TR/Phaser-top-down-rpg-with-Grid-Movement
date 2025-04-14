import { gameTiles } from "./resources";

export const gameConfig = {
  names: {
    tiles: {},
    map: "gameMap",
  },
  tiles: gameTiles,

  gamePlay: {
    /**Chance that the random box will be locked. From 0 to 100 */
    randomBoxLockChance: 25,
    randomItemsMaxAmount: 5,
  },

  light: {
    defaultColor: 0xff860c,
    defaultIntensity: 1,
  },
  dayCircleTimeInRealSeconds: 3 * 60,
} as const;

export const debugs = {
  light: false,
};
