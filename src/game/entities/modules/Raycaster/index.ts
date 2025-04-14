import { fastFloor } from "utils";

import { GameScene } from "../GameScene";
import { Shadow } from "./Shadow";
import { rayConfig } from "./config";
import { getEdgeRadiusPoints } from "game/entities/utils";

interface ShadowState {
  list: Shadow[];
  map: Shadow[][];
}

export class Raycaster {
  constructor(scene: GameScene) {
    this.scene = scene;
    this.shadowContainer = scene.add.container(0, 0);
    this.shadowContainer.setAlpha(rayConfig.shadowAlpha);

    const { tileHeight = 0, tileWidth = 0 } = scene.tilemap || {};

    const getShadowPositionFromCoordinate = (
      shadowX: number,
      shadowY: number,
      width: number,
      height: number,
    ) => {
      const x = fastFloor((shadowX + width / 2) / tileWidth),
        y = fastFloor((shadowY + height) / tileHeight);

      return { x, y };
    };

    this.shadowState = scene.objectState.shadows.objects.reduce(
      (acm, { id, name, properties, width = 0, height = 0, x = 0, y = 0 }) => {
        const shadow = new Shadow(this, {
          height,
          id,
          properties,
          width,
          x,
          y,
        });

        const pos = getShadowPositionFromCoordinate(x, y, width, height);

        if (!acm.map[pos.y]) acm.map[pos.y] = [];
        acm.map[pos.y][pos.x] = shadow;
        acm.list.push(shadow);
        return acm;
      },
      {
        list: [],
        map: [],
      } as {
        list: Shadow[];
        map: Shadow[][];
      },
    );

    const staticLight = this.castAShadow("static");
  }

  private shadowState: ShadowState;
  scene: GameScene;
  shadowContainer: Phaser.GameObjects.Container;

  private castAShadow = (type: keyof GameScene["lightElements"]) => {
    const { tileHeight = 0, tileWidth = 0 } = this.scene.tilemap || {};

    const flames = this.scene.lightElements[type]?.list.map((lightElement) => {
      const { config, destroy, light, id } = lightElement;
      const { radius = 0 } = config;

      const { leftTopX, leftTopY, rightBottomX, rightBottomY } =
        getEdgeRadiusPoints(light.x, light.y, radius, tileWidth, tileHeight);

      const currentShadows = this.shadowState.map.reduce((list, line, y) => {
        if (y >= leftTopY && y <= rightBottomY) {
          line.forEach((shadow, x) => {
            if (x >= leftTopX && x <= rightBottomX) {
              list.push(shadow);

              shadow.registerLight(lightElement);
            }
          });
        }

        return list;
      }, [] as Shadow[]);

      return {
        light,
        shadows: currentShadows,
      };
    });

    return flames;
  };

  updateLights = () => {
    const { tileHeight = 0, tileWidth = 0 } = this.scene.tilemap || {};
  };

  update = () => {
    this.shadowState.list.forEach((s) => s.update());
    // const dynamicLight = this.castAShadow("dynamic"); //Dynamic shadows look weird
  };
}
