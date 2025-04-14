import { SceneConfig } from "type";
import { fastFloor } from "utils";
import { maxSunPosition } from "../modules";

const getOneColorFromHex = (hex: string, i: number) => {
  const hexSymbolsAmt = 2;
  return hex.substring(hexSymbolsAmt * i, hexSymbolsAmt * (i + 1));
};

export const getCurrentSunColor = (
  currentTime: SceneConfig["currentTime"],
  colors: SceneConfig["dayLighting"],
) => {
  const percent = currentTime % 1;

  let currentIndex = fastFloor(currentTime);
  let nextIndex = currentIndex + 1;
  if (nextIndex >= maxSunPosition) nextIndex = 0;

  const prevColor = colors[currentIndex].substring(1);
  const nextColor = colors[nextIndex].substring(1);

  const currentColorArr: string[] = [];

  for (let i = 0; i < 3; i++) {
    const prevHex = getOneColorFromHex(prevColor, i);
    const nextHex = getOneColorFromHex(nextColor, i);

    const prevDex = parseInt(prevHex, 16);
    const nextDex = parseInt(nextHex, 16);

    const currentDex = fastFloor((nextDex - prevDex) * percent + prevDex);
    let currentHex = currentDex.toString(16);
    if (currentHex.length <= 1) currentHex = "0" + currentHex;
    currentColorArr.push(currentHex);
  }

  const currentColor = `0x${currentColorArr.join("")}`;
  return Number(currentColor);
};
