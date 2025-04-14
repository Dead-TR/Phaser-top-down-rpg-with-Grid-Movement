import { Direction, MoveToResult, PathBlockedStrategy } from "grid-engine";

import {
  AnimationConfig,
  AnimationSheetDirectionTypes,
  AnimationTypeName,
  CharacterConfig,
  DetectMoveEvent,
  EquipmentItems,
  Skills,
} from "type";

import { runSpeedLevel } from "containers/Windows/Skills/config";
import { GameScene } from "../GameScene";
import { getSkillValue } from "utils";

const frameRateConfig: Record<AnimationTypeName, number> = {
  idle: 0,
  walk: 38,
  run: 38,

  bowLoad: 72,
  bowAttack: 80,
};

export class Character {
  constructor(scene: GameScene, config: CharacterConfig) {
    this.scene = scene;
    this.sprite = this.scene.add.sprite(0, 0, config.spriteSheets.idle.bottom);
    this.config = config;
    this.sprite.scale = config.scale;

    this.equipment = config.equipment;
    this.skillValues = Object.keys(config.skills).reduce((list, k) => {
      const key = k as keyof Skills;
      const value = getSkillValue(key, config.skills, this.equipment);

      list[key] = value;
      return list;
    }, {} as Skills);

    this.createAnimations();
  }
  protected scene: GameScene;
  sprite: Phaser.GameObjects.Sprite;
  config: CharacterConfig;
  direction: Direction = Direction.DOWN;

  skillValues: Skills;
  equipment: EquipmentItems;

  private getAnimationKey(
    animation: keyof CharacterConfig["spriteSheets"],
    direction: keyof AnimationSheetDirectionTypes,
  ) {
    const { id } = this.config;
    return `${id}_${animation}_${direction}`;
  }

  private createAnimations() {
    const { id, spriteSheets } = this.config;

    for (const k in spriteSheets) {
      const type = k as keyof typeof spriteSheets;

      for (const b in spriteSheets[type]) {
        const frame = b as keyof (typeof spriteSheets)[typeof type];
        const animation = spriteSheets[type][frame];

        this.scene.anims.create({
          key: this.getAnimationKey(type, frame),
          frames: animation,
          frameRate: frameRateConfig[type],
          repeat: -1,
        });
      }
    }

    this.sprite.play(this.getAnimationKey("idle", "bottom"));
  }

  moveTo = (x: number, y: number, onEnd?: (result?: MoveToResult) => void) => {
    this.scene.gridEngine
      .moveTo(
        this.config.id,
        { x, y },
        {
          pathBlockedStrategy: PathBlockedStrategy.STOP,
          algorithm: "A_STAR",
        },
      )
      .forEach(({ charId, result }) => {
        if (charId === this.config.id && onEnd) {
          onEnd(result);
        }
      });
  };

  moveDirection = (direction: Direction) => {
    this.scene.gridEngine.move(this.config.id, direction);
  };

  moveStop = () => {
    this.scene.gridEngine.stopMovement(this.config.id);
  };

  playAnimation = (
    animation: AnimationTypeName,
    direction?: Direction | null,

    config: AnimationConfig = {},
  ) => {
    if (!direction) direction = this.direction;
    else this.direction = direction;

    let directionName: keyof AnimationSheetDirectionTypes = "bottom";
    let isFlip = false;

    switch (direction) {
      case Direction.UP:
        directionName = "top";
        break;

      //@ts-ignore fallthrough
      case Direction.LEFT:
        isFlip = true;
      //@ts-ignore fallthrough
      case Direction.RIGHT:
        directionName = "right";
        break;

      case Direction.DOWN:
      default:
        directionName = "bottom";
        break;
    }

    this.sprite.setFlipX(isFlip);

    const animationName = this.getAnimationKey(animation, directionName);

    const { onComplete, onRepeat, ...animationConfig } = config;

    this.sprite.play({
      key: animationName,
      ...animationConfig,
    });

    const callBacks = [
      {
        event: "animationcomplete",
        callBack: onComplete,
      },
      {
        event: "animationrepeat",
        callBack: onRepeat,
      },
    ];

    callBacks.forEach(({ event, callBack }) => {
      if (callBack) this.sprite.on(event, callBack);
    });
  };

  updateDirection = (event: DetectMoveEvent, direction: Direction) => {
    switch (event) {
      case "movementStarted":
        const isRun = this.config.skills.move > runSpeedLevel;

        this.playAnimation(isRun ? "run" : "walk", direction);
        break;

      case "directionChanged":
      case "movementStopped":
        this.playAnimation("idle", direction);
        break;

      default:
        break;
    }
  };

  dead() {
    console.log("DEAD", this);
  }
}
