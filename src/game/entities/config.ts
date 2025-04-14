import Phaser from "phaser";
import { GridEngine } from "grid-engine";

import { DemoLocation } from "./locations";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 100,
  height: 100,

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [DemoLocation],
  parent: "game-box",

  title: "Trapped",
  antialias: false,
  pixelArt: true,

  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },

    ],
  },
};
