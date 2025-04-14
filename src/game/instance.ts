import Phaser from "phaser";
import { gameConfig } from "./entities/config";

const ratio = 9 / 16;

export const renderGame = (w: number) => {
  return new Phaser.Game({ ...gameConfig, width: w, height: w * ratio });
};
