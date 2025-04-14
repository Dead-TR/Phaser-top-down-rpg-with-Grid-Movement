import { Direction } from "grid-engine";

import { inventoryManager } from "managers/InventoryManager";
import { playerManager } from "managers/PlayerManager";

import { CharacterName, ItemOther, ItemWeapon } from "type";
import { itemsLits } from "items";
import { between, getSkillValue } from "utils";

import { Player, Character } from "../../Character";
import { GameScene } from "..";
import { getDistanceBetweenPointAndSquare } from "game/entities/utils";
import { combatManager } from "managers/CombatManager";

export class Pointer {
  constructor(scene: GameScene) {
    const { player } = scene.characters;

    this.scene = scene;
    this.player = player!;

    this.createPointers();
  }
  private scene: GameScene;
  private player: Player;

  private getCoordinates(point: Phaser.Input.Pointer) {
    const { x, y } = point;
    const { x: posX, y: posY } = this.scene.camera!.getWorldPoint(x, y);
    return { x: posX, y: posY };
  }

  private checkIsMustStop(point: Phaser.Input.Pointer) {
    if (point.button === 2) {
      this.removeMarker();
      this.player.moveStop();
      return true;
    }

    return false;
  }

  private move(x: number, y: number) {
    let ground: Phaser.Tilemaps.Tile | null = null;

    const blockedLayer = this.scene.tilemap?.layers.find(({ name }) => {
      const world = this.scene.tilemap!.getTileAtWorldXY(
        x,
        y,
        true,
        this.scene.camera,
        name, // layer from Tiled
      );

      const canMove = !(world?.properties.ge_collide === true);
      if (name === "ground") ground = world;

      if (!canMove) return true;
      return false;
    });

    if (!blockedLayer && ground) {
      const world = ground as Phaser.Tilemaps.Tile;

      this.createMarker(
        world.x * world.width + world.width / 2, // Маркер розміщується суворо у центрі клітинки у яку рухається персонаж
        world.y * world.height + world.height / 2,
      );
      // this.createMarker(x, y); // Маркер розміщується туди куди клікнув гравець

      setTimeout(() => {
        this.player.moveTo(world.x, world.y, (result) => {
          this.removeMarker();
          if (result === "NO_PATH_FOUND") {
            setTimeout(() => this.removeMarker(), 0);
          }
        });
      }, 0);
    } else {
      setTimeout(() => {
        this.removeMarker();
        this.player.moveStop();
      }, 0);
    }
  }

  private openBox(x: number, y: number) {
    const point = { x, y };

    const currentBox = this.scene.boxes.list.find(({ location }) => {
      const { height, width, x, y } = location;
      return (
        point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height
      );
    });

    if (currentBox) {
      const { items, lock, location } = currentBox;

      const player = this.scene.gridEngine.getPosition(
        "Player" as CharacterName,
      );
      const { tileWidth = 0, tileHeight = 0 } = this.scene.tilemap || {};

      const playerPoint = {
        x: player.x * tileWidth,
        y: player.y * tileHeight,
      };
      const distance = getDistanceBetweenPointAndSquare(playerPoint, location);

      const cellSize = Math.min(tileWidth, tileHeight);

      if (distance <= tileWidth) {
        if (currentBox.lock) {
          // взлом
          const lockLevel = playerManager.getSkillValue("lockBreaking");
          if (!lockLevel) {
            this.picklockNote("Бракує навички", "red", [x, y]);

            return true;
          }

          const picklocksSpent =
            currentBox.lock <= lockLevel
              ? 1
              : between(1, Math.max(1, currentBox.lock - lockLevel));

          const picklockInInventory =
            inventoryManager.playerInventory.other.find(
              ({ id }) => id === itemsLits.other[0].id,
            ) as ItemOther | undefined;

          if (
            !picklockInInventory ||
            picklockInInventory.amount < picklocksSpent
          ) {
            this.picklockNote("Бракує відмичок", "red", [x, y]);
            if (picklockInInventory?.amount) picklockInInventory.amount = 0;
          } else {
            currentBox.lock = Math.max(0, currentBox.lock - lockLevel);
            picklockInInventory.amount -= picklocksSpent;

            this.picklockNote(`-${picklocksSpent}`, "red", [x, y]);

            if (currentBox.lock) {
              let color = "red";
              if (currentBox.lock <= 5) color = "yellow";

              this.picklockNote(`${currentBox.lock * 10}%`, color, [x, y + 25]);
            } else {
              this.picklockNote(`Відімкнено!`, "green", [x, y + 25]);
            }
          }
        } else {
          inventoryManager.openBox(currentBox.items);
        }
      }

      return true;
    }

    return false;
  }

  private createPointers() {
    this.scene.input.on("pointerdown", (point: Phaser.Input.Pointer) => {
      const mustStop = this.checkIsMustStop(point);
      if (mustStop) return;

      const { x, y } = this.getCoordinates(point);

      const isBox = this.openBox(x, y);
      if (!isBox) this.move(x, y);
    });
  }

  private marker?: {
    circle: Phaser.GameObjects.Arc;
    tween: Phaser.Tweens.Tween;
  };

  private createMarker(x: number, y: number) {
    if (this.marker) this.removeMarker();

    requestAnimationFrame(() => {
      const circle = this.scene.add.circle(
        x,
        y,
        this.scene.cellSize / 2,
        0x000000,
      );
      circle.scaleY = 0.5;
      circle.alpha = 0;
      const tween = this.scene.add.tween({
        targets: circle,
        yoyo: true,
        repeat: -1,
        scale: 0.05,
        duration: 200,
      });

      this.marker = {
        circle,
        tween,
      };

      setTimeout(() => {
        if (this.marker?.circle) this.marker.circle.alpha = 0.4;
      }, 100);
    });
  }
  private removeMarker() {
    if (this.marker) {
      this.marker.circle.destroy();
      this.marker.tween.stop();
      this.marker.tween.destroy();
    }
    delete this.marker;
  }

  private picklockNote = (
    text: string,
    color: string,
    /**[x, y] */
    coordinates: [number, number],
  ) => {
    const [x, y] = coordinates;

    const textElement = this.scene.add.text(x, y, text, {
      color,
    });

    textElement.x = x - textElement.width / 2;
    textElement.setDepth(Infinity);

    const tween = this.scene.tweens.add({
      targets: textElement,
      y: y - 250,
      alpha: 0,
      duration: 2500,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      onComplete: () => {
        tween.destroy();
        textElement.destroy();
      },
    });
  };

  private activeCoolDown = false;
  characterClick = (character: Character) => {
    const { player } = this.scene.characters;
    const { config } = character;
    const { distanceCombatType } = combatManager;
    const { skillLevels } = playerManager;
    const { equipment } = inventoryManager;

    const attackCoolDown = playerManager.getSkillValue("attackCoolDown");
    const magic = playerManager.getSkillValue("magic");
    const bow = playerManager.getSkillValue("bow");

    const bowEquip = equipment.bow as ItemWeapon;

    if (!player) return;

    switch (config.type) {
      case "enemy":
        if (this.activeCoolDown) return;

        const currentHitChance = distanceCombatType
          ? distanceCombatType === "bow"
            ? bow
            : magic
          : -1;
        if (!distanceCombatType) {
          console.log("Не обрано зброї");
          return;
        }

        const charPosition = this.scene.gridEngine.getPosition(
          character.config.id,
        );
        const playerPosition = this.scene.gridEngine.getPosition(
          player!.config.id,
        );

        const xRange = charPosition.x - playerPosition.x;
        const yRange = charPosition.y - playerPosition.y;
        const axes = Math.abs(yRange) > Math.abs(xRange) ? "y" : "x";
        let playerDirection = Direction.DOWN;

        if (axes === "x") {
          playerDirection = xRange > 0 ? Direction.RIGHT : Direction.LEFT;
        } else {
          playerDirection = yRange > 0 ? Direction.DOWN : Direction.UP;
        }

        player?.playAnimation("bowLoad", playerDirection, {
          repeat: 0,
          onComplete: () => {
            player?.playAnimation("bowAttack", playerDirection, {
              repeat: 0,
              onComplete: () => {
                player?.playAnimation("idle");
              },
            });
          },
        });

        const percent = between(0, 100, true);
        const isMiss = percent > currentHitChance;

        if (isMiss) console.log("miss!");

        this.activeCoolDown = true;
        setTimeout(() => {
          this.activeCoolDown = false;
        }, attackCoolDown);

        if (isMiss || !bowEquip?.damage) return;

        character.skillValues.health -= bowEquip.damage;
        console.log("hit", character.skillValues.health);

        if (character.skillValues.health <= 0) character.dead();

        break;
      case "friend":
        break;
      default:
        break;
    }
  };
}
