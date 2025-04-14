import { Direction } from "grid-engine";
import { GameScene } from "../GameScene";
import { Character } from "./Character";
import { CharacterConfig } from "type";
import { playerManager } from "managers/PlayerManager";
import { inventoryManager } from "managers/InventoryManager";

export class Player extends Character {
  constructor(
    scene: GameScene,
    startedPosition: CharacterConfig["startedPosition"],
  ) {
    const config: CharacterConfig = {
      startedPosition,
      id: "Player",
      type: "friend",
      scale: 0.25,
      spriteSheets: {
        idle: {
          bottom: "player_idle_down",
          right: "player_idle_right",
          top: "player_idle_up",
        },
        walk: {
          bottom: "player_walk_down",
          right: "player_walk_right",
          top: "player_walk_up",
        },
        run: {
          bottom: "player_run_down",
          right: "player_run_right",
          top: "player_run_up",
        },
        bowLoad: {
          bottom: "player_bow_load_down",
          right: "player_bow_load_right",
          top: "player_bow_load_up",
        },
        bowAttack: {
          bottom: "player_bow_attack_down",
          right: "player_bow_attack_right",
          top: "player_bow_attack_up",
        },
      },

      skills: playerManager.skillLevels,
      equipment: inventoryManager.equipment,
    };
    super(scene, config);
  }

  checkMovement() {
    const cursors = this.scene.cursors;
    if (cursors?.left.isDown) {
      this.moveDirection(Direction.LEFT);
    } else if (cursors?.right.isDown) {
      this.moveDirection(Direction.RIGHT);
    } else if (cursors?.up.isDown) {
      this.moveDirection(Direction.UP);
    } else if (cursors?.down.isDown) {
      this.moveDirection(Direction.DOWN);
    }
  }
}
