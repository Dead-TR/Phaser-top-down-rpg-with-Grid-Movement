import { LightConfig } from "type";
import { debugs, gameConfig } from "game/config";

import { GameScene } from "../GameScene";

export class Light {
  constructor(scene: GameScene, config: LightConfig) {
    this.scene = scene;
    this.config = config;

    const {
      x,
      y,
      color = gameConfig.light.defaultColor,
      intensity = 1.5,
      radius = 300,
      id,
      positionType,
    } = config;

    let xCoordinate = x,
      yCoordinate = y;
    if (positionType === "tile" && scene.tilemap) {
      xCoordinate = x * scene.tilemap.tileWidth;
      yCoordinate = y * scene.tilemap.tileHeight;
    }

    this.light = scene.lights
      .addLight(xCoordinate, yCoordinate, radius, color)
      .setIntensity(intensity);

    if (debugs.light) {
      scene.add.circle(x, y, radius, 0x00ffff, 0.1);
    }

    this.id = id;
  }
  private scene: GameScene;
  config: LightConfig;
  light: Phaser.GameObjects.Light;
  id?: LightConfig["id"];

  destroy = () => {
    this.scene.lights.removeLight(this.light);
  };
}
