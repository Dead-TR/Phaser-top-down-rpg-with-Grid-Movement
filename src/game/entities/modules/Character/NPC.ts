import { GameScene } from "../GameScene";
import { Character } from "./Character";
import { CharacterConfig } from "type";

export class NPC extends Character {
  constructor(scene: GameScene, config: CharacterConfig) {
    super(scene, config);
  }
}
