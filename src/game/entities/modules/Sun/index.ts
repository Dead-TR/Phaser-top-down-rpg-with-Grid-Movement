import {
  getCurrentSunColor,
  getSunPositionFromTime,
} from "game/entities/utils";
import { GameScene } from "../GameScene";
import { gameConfig } from "game/config";

export const maxSunPosition = 4;

export class Sun {
  constructor(scene: GameScene) {
    this.scene = scene;

    scene.lights.enable();
    this.update();

    this.tween = scene.tweens.add({
      targets: this.scene.sceneConfig,
      duration: gameConfig.dayCircleTimeInRealSeconds * 1000,
      currentTime: maxSunPosition,
      loop: -1,
      ease: Phaser.Math.Easing.Linear,
    });
  }
  private scene: GameScene;
  private tween: Phaser.Tweens.Tween;
  sunPosition = getSunPositionFromTime(0, 0, 0);

  private getCurrentColor = () => {
    if (this.scene.sceneConfig.currentTime >= maxSunPosition + 1) {
      this.scene.sceneConfig.currentTime = 0;
    }

    const { currentTime, dayLighting } = this.scene.sceneConfig;
    const currentColor = getCurrentSunColor(currentTime, dayLighting);
    return currentColor;
  };

  update = () => {
    const color = this.getCurrentColor();
    this.scene.lights.setAmbientColor(color);

    const { widthInPixels = 0, heightInPixels = 0 } = this.scene.tilemap || {};
    this.sunPosition = getSunPositionFromTime(
      this.scene.sceneConfig.currentTime,
      widthInPixels,
      heightInPixels,
    );
  };

  // Поки не певен, чи в Фейзері їх обов'язково знищувати
  // destroy = () => {
  //   this.tween.destroy();
  // };
}
