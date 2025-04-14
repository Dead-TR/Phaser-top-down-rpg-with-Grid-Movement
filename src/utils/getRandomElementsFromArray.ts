import { cloneObj } from "./cloneObj";

export const getRandomArrayElements = <T>(array: T[], amt = 1) => {
  if (amt > array.length) {
    amt = 1;
  }

  const shuffled = array.slice().sort(() => 0.5 - Math.random());

  return cloneObj(shuffled).slice(0, amt);
};
