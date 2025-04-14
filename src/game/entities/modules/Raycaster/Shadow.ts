import { ShadowConfig, ShadowParams, TiledBoolProp } from "type";
import { calculateAngle, fastFloor, formatProperties } from "utils";

import {
  createAlphaTween,
  getEdgeRadiusPoints,
  moveShadow,
} from "game/entities/utils";

import { GameScene } from "../GameScene";
import { Light } from "../Light";
import { Raycaster } from ".";

const shadowTypes = ["fromCenter", "move", "static"] as const;

export class Shadow {
  constructor(ray: Raycaster, config: ShadowConfig) {
    this.config = config;
    this.scene = ray.scene;
    this.ray = ray;
    const props = formatProperties<(typeof shadowTypes)[number]>(
      config.properties,
    );

    const currentType = shadowTypes.find((value) => {
      return (
        props[value]?.name === value && (props[value] as TiledBoolProp).value
      );
    });

    if (currentType) this.params.type = currentType;

    const sunShadow = this.createShadow();

    this.sunShadowSprite = sunShadow;
  }
  private scene: GameScene;
  private config: ShadowConfig;
  private ray?: Raycaster;

  private params: ShadowParams = {
    type: "default",
  };
  private sunShadowSprite: Phaser.GameObjects.Sprite;
  private lightSources: {
    light: Light;
    sprite: Phaser.GameObjects.Sprite;
  }[] = [];

  private createShadow = () => {
    const { type } = this.params;
    const { height, width, x, y, id } = this.config;

    const shadowWidth = width;
    const shadowHeight = height;
    let shadowX = x + width / 2;
    let shadowY = y + shadowHeight - shadowWidth / 2;
    let texture = "shadow_directed";
    let heightMul = 1;

    switch (type) {
      case "fromCenter":
        texture = "shadow_center";
        shadowY = y + shadowHeight * 0.5;
        heightMul = 1.75;
        break;
      case "move":
        texture = "shadow_move";
        shadowX = x + width / 2;
        shadowY = y + shadowHeight / 2;
        break;

      case "static":
        texture = "shadow_static";
        shadowX = x + width / 2;
        shadowY = y + shadowHeight / 2;
        break;

      default:
        break;
    }

    const sprite = this.scene.add.sprite(shadowX, shadowY, texture);

    sprite.setScale(
      shadowWidth / sprite.width,
      (shadowHeight / sprite.height) * heightMul,
    );

    switch (type) {
      case "default":
      case "fromCenter":
        sprite.setOrigin(0.5, 1);
        break;
      case "move":
        sprite.setOrigin(0.5);
        break;

      default:
        break;
    }

    this.ray?.shadowContainer.add(sprite);

    return sprite;
  };

  private rotateShadow = (
    lightPosition: { x: number; y: number },
    shadowSprite: Phaser.GameObjects.Sprite,
  ) => {
    const { type } = this.params;
    if (type === "static") return;

    const { x, y } = lightPosition;

    const { x: sX, y: sY, width: sWidth, height: sHeight } = shadowSprite;
    const { height: cHeight, width: cWidth, x: cX, y: cY } = this.config;
    const angle = calculateAngle(x, y, sX, sY);

    switch (type) {
      case "default":
      case "fromCenter":
        shadowSprite.setAngle(angle + 90);
        break;

      case "move":
        const { x: moveX, y: moveY } = moveShadow(angle);

        shadowSprite.setPosition(
          cX + cWidth / 2 + cWidth * 0.2 * moveX,
          cY + cHeight / 2 + cHeight * 0.2 * moveY,
        );
        break;

      default:
        break;
    }
  };

  private rotateSunShadow = () => {
    const { sun } = this.scene;
    const { x = 0, y = 0 } = sun?.sunPosition || {};

    this.rotateShadow({ x, y }, this.sunShadowSprite);
  };

  private rotateShadowFromLight = () => {
    this.lightSources.forEach(({ light, sprite }) => {
      this.rotateShadow(light.light, sprite);
    });
  };

  update = () => {
    this.rotateSunShadow();
    this.rotateShadowFromLight();
    this.unregisterLightCheck();
  };

  registerLight = (light: Light) => {
    const { type } = this.params;
    if (type === "move" || type === "fromCenter") return;

    const isRegistered = this.lightSources.find((v) => v.light === light);

    if (!isRegistered) {
      const shadowSprite = this.createShadow();
      this.lightSources.push({
        sprite: shadowSprite,
        light,
      });

      shadowSprite.setAlpha(0);
      createAlphaTween(this.scene, shadowSprite, 0.5);
      createAlphaTween(this.scene, this.sunShadowSprite, 0.25);
    }
  };

  unregisterLightCheck = () => {
    if (!this.scene.tilemap) return;
    const { tileWidth, tileHeight } = this.scene.tilemap;
    this.lightSources.forEach(({ light: lightSrc, sprite }) => {
      const { light, config } = lightSrc;
      const { radius = 0 } = config;
      const { leftTopX, leftTopY, rightBottomX, rightBottomY } =
        getEdgeRadiusPoints(light.x, light.y, radius, tileWidth, tileHeight);

      const x = fastFloor(sprite.x / tileWidth),
        y = fastFloor(sprite.y / tileHeight);

      if (
        !(
          y >= leftTopY &&
          y <= rightBottomY &&
          x >= leftTopX &&
          x <= rightBottomX
        )
      ) {
        this.lightSources = this.lightSources.filter(
          (src) => src.light !== lightSrc,
        );

        createAlphaTween(this.scene, sprite, 0, () => {
          sprite.destroy();
        });

        if (!this.lightSources.length) {
          createAlphaTween(this.scene, this.sunShadowSprite, 0.5);
        }
      }
    });

  };
}
