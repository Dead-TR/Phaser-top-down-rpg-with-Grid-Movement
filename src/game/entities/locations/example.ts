import { itemsLits } from "items";
import { cloneObj } from "utils";
import { GameScene } from "../modules";

export class DemoLocation extends GameScene {
  constructor() {
    super(
      {
        spritesheet: [
          [
            "characters",
            "assets/locations/characters.png",
            { frameWidth: 52, frameHeight: 72 },
          ],
        ],
      },
      "assets/locations/cloud_city.json",
      {
        boxes: [
          {
            lock: 0,
            items: [
              //@ts-ignore
              { ...cloneObj(itemsLits.other[0]), amount: 5000 },
              //@ts-ignore
              { ...cloneObj(itemsLits.other[1]), amount: 966074 },
              cloneObj(itemsLits.bow[0]),
              cloneObj(itemsLits.body[0]),
              cloneObj(itemsLits.meleeWeapon[0]),
              cloneObj(itemsLits.other[0]),
            ],
          },
          {
            lock: 10,
            items: [
              //@ts-ignore
              { ...cloneObj(itemsLits.other[1]), amount: 966074 },
              cloneObj(itemsLits.saturator[0]),
              cloneObj(itemsLits.saturator[0]),
            ],
          },
          {
            lock: 0,
          },
        ],
        characters: {
          player: {
            startedPosition: { x: 22, y: 20 },
          },
          enemy: {
          },
          NPC: {},
        },
        dayLighting: ["#6e1919", "#ffd8c7", "#013fb1", "#2c0053", "#670096"],
        currentTime: 0,
      },
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
