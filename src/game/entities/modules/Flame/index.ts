import { FireConfig } from "type";
import { GameScene } from "../GameScene";
import { Light } from "../Light";

const textureName = "circleFireTexture";

export class Flame {
  constructor(scene: GameScene, config: FireConfig) {
    this.scene = scene;
    const { x, y, positionType, radius = 15, id, light: lightConfig } = config;

    let xCoordinate = x + radius / 2,
      yCoordinate = y + radius / 2;
    if (positionType === "tile" && scene.tilemap) {
      xCoordinate = x * scene.tilemap.tileWidth;
      yCoordinate = y * scene.tilemap.tileHeight;
    }

    this.id = id;

    //@ts-ignore
    if (!scene.textures.list[textureName]) {
      var graphics = scene.add.graphics();
      graphics.fillStyle(0xf89800); // Колір заливки
      graphics.fillCircle(radius, radius, radius); // Координати та радіус кола
      graphics.generateTexture(textureName, radius * 2, radius * 2);
      graphics.destroy();
    }

    const lifespan = 800;
    this.flame = scene.add.particles(xCoordinate, yCoordinate, textureName, {
      color: [0xf89800, 0xf83600, 0x9f0404],
      colorEase: "quad.out",
      lifespan: lifespan,
      angle: { min: -100, max: -80 },
      scale: { start: 0.75, end: 0, ease: "sine.out" },
      alpha: { start: 0.5, end: 1, ease: "sine.out" },
      speed: radius * 6,
      advance: lifespan,
      blendMode: "ADD",
    });

    const {
      color,
      intensity = 1.5,
      radius: lightRadius = 175,
    } = lightConfig || {};
    console.log("🚀 ~ file: index.ts:47 ~ Flame ~ constructor ~ lightRadius:", lightRadius)
    
    this.light = new Light(scene, {
      x: x + radius / 2,
      y: y + radius / 2,
      positionType: config.positionType,
      id,
      intensity,
      radius: lightRadius,
      color,
    });

    this.flame.depth = Infinity;

    // if (typeof zIndex === "number") {
    //   this.flame.depth = zIndex;
    // }

    this.tween = scene.tweens.add({
      targets: { percent: 0 },
      yoyo: true,
      repeat: -1,
      duration: 150,
      percent: 1,
      onUpdate: (event) => {
        try {
          const { percent } = event.targets[0] as { percent: number };
          const intensityDifference = (intensity - intensity * 0.895) * percent;
          this.light.light.intensity = intensity - intensityDifference;

          const radiusDifference = (lightRadius - lightRadius * 0.95) * percent;
          this.light.light.radius = lightRadius - radiusDifference;
        } catch {
          this.tween.destroy();
        }
      },
    });
  }
  private scene: GameScene;
  private tween: Phaser.Tweens.Tween;

  light: Light;
  flame: Phaser.GameObjects.Particles.ParticleEmitter;
  id: FireConfig["id"];

  destroy() {
    this.tween.destroy();
    this.light.destroy();
    this.flame.destroy(true);
  }
}
