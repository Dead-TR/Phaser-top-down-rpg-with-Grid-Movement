import {
  GridEngineHeadless,
  Tilemap,
  GridEngineConfigHeadless,
  CharacterDataHeadless,
  Direction,
} from "grid-engine";

import { gameConfig } from "game/config";

import {
  Box,
  CharacterName,
  CharactersState,
  DetectMoveEvent,
  LoaderResources,
  MapObjectLayerNames,
  PreparedBox,
  SceneConfig,
  TiledColorProp,
  TiledNumberProp,
} from "type";
import {
  between,
  formatColor,
  formatProperties,
  getRandomArrayElements,
} from "utils";
import { lockedRandomItems, simpleRandomItems } from "items";

import { playerManager } from "managers/PlayerManager";
import { charactersResources, mainResources } from "game/resources";

import { playerConfig } from "managers/config";

import { Monster, NPC, Player, Character } from "../Character";
import { Raycaster } from "../Raycaster";
import { Pointer } from "./modules";
import { Light } from "../Light";
import { Flame } from "../Flame";
import { Sun } from "../Sun";

interface LightState {
  state: Record<string, Light>;
  list: Light[];
}

export class GameScene extends Phaser.Scene {
  gridEngine!: GridEngineHeadless;

  constructor(
    loaderResources: LoaderResources,
    currentMapPath: string,
    config: SceneConfig,
  ) {
    super();

    const { boxes = [] } = config || {};

    this.boxes.prepared = boxes;
    this.sceneConfig = config;
    this.sceneLoaderResources = loaderResources;
    this.currentMapJson = currentMapPath;
  }

  sceneConfig: SceneConfig;
  cellSize = 0;

  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  tilemap?: Phaser.Tilemaps.Tilemap;

  characters: CharactersState = {
    NPC: {},
    enemy: {},
    all: {},
  } as CharactersState;
  camera?: Phaser.Cameras.Scene2D.Camera;
  /**coordinates as "x|y" */
  boxes: {
    /**prepared boxes -- Not real chests, just information about filling them */
    prepared: PreparedBox[];
    list: Box[];
  } = { prepared: [], list: [] };

  private sceneLoaderResources: LoaderResources;
  private currentMapJson: string;
  private pointer?: Pointer;

  //@ts-ignore
  objectState: Record<MapObjectLayerNames, Phaser.Tilemaps.ObjectLayer> = {};
  lightElements: {
    static?: LightState;
    dynamic?: LightState;
  } = {};
  sun?: Sun;
  raycaster?: Raycaster;

  preload() {
    const load = (resource: LoaderResources) => {
      Object.keys(resource).forEach((key) => {
        const method = key as keyof LoaderResources;
        const values = resource[method];
        values?.forEach((data) => {
          const callBack = (this.load[method] as Function).bind(this.load);
          callBack(...data);
        });
      });
    };

    load(mainResources);
    load(charactersResources);
    load(this.sceneLoaderResources);

    this.load.tilemapTiledJSON(gameConfig.names.map, this.currentMapJson);
    Object.keys(gameConfig.tiles).forEach((tileID) => {
      const path = gameConfig.tiles[tileID as keyof typeof gameConfig.tiles];
      this.load.image(tileID, path);
    });
  }

  private createCharacters(tilemap: Phaser.Tilemaps.Tilemap) {
    const { characters } = this.sceneConfig;
    const {
      player: playerConfig,
      NPC: npcConfig,
      enemy: enemyConfig,
    } = characters;

    const player = new Player(this, playerConfig.startedPosition);
    this.characters.player = player;
    this.characters.all["Player"] = player;

    this.camera = this.cameras.main;

    this.camera.setZoom(2); // в теорії це дозволяє додати можливість змінювати зум
    this.camera.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
    this.camera.startFollow(player.sprite, true);

    const monsters = Object.keys(enemyConfig).reduce((list, key) => {
      const id = key as CharacterName;
      const { x = 1, y = 1 } = enemyConfig[id] || {};

      const monster = new Monster(this, {
        id,
        scale: 0.5,
        skills: {
          attackCoolDown: 1,
          bow: 1,
          health: 10,
          lockBreaking: 5,
          magic: 10,
          meleeWeapon: 5,
          move: 1,
          parry: 5,
        },
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
            bottom: "player_walk_down",
            right: "player_walk_right",
            top: "player_walk_up",
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
        equipment: {
          saturator: [],
        },
        type: "enemy",
        startedPosition: { x, y },
      });
      monster.sprite.setInteractive({
        pixelPerfect: false,
      });

      monster.sprite.on("pointerdown", this.characterOnClick(monster));

      list[id] = monster;
      this.characters.all[id] = monster;

      return list;
    }, {} as Partial<Record<CharacterName, Monster>>);

    return {
      player,
      npc: {},
      monsters,
    };
  }

  private characterOnClick = (character: Character) => {
    return (area: any, x: any, y: any, sprite: any) => {
      sprite.stopPropagation();
      this.pointer?.characterClick(character);
    };
  };

  private createBoxes(objects: Phaser.Tilemaps.ObjectLayer[]) {
    const boxes = objects.find(({ name }) => name === "boxes");
    let boxIndex = this.boxes.prepared.length;

    boxes?.objects.forEach(
      ({ x = 0, y = 0, width = 0, height = 0, properties }) => {
        const props = formatProperties<"id">(properties);

        const id = props.id as TiledNumberProp;

        const currentId = id.value === undefined ? boxIndex++ : id.value;
        const currentBox = this.boxes.prepared[currentId];

        if (currentBox) {
          const box = currentBox as Box;
          box.location = { height, width, x, y };
          if (!box.items) {
            const itemsAmount = between(
              1,
              gameConfig.gamePlay.randomItemsMaxAmount,
            );

            box.items = getRandomArrayElements(
              box.lock ? lockedRandomItems : simpleRandomItems,
              itemsAmount,
            );
          }
          this.boxes.list.push(box);
        } else {
          // The box is not defined. It must be filled with random items
          const isLock = !(
            between(0, 100) <= gameConfig.gamePlay.randomBoxLockChance
          );

          const lock = isLock
            ? 0
            : between(0, playerConfig.skillsMaximumLevel.lockBreaking);

          const itemsAmount = between(
            1,
            gameConfig.gamePlay.randomItemsMaxAmount,
          );

          this.boxes.list.push({
            lock,
            items: getRandomArrayElements(
              lock ? lockedRandomItems : simpleRandomItems,
              itemsAmount,
            ),

            location: {
              height,
              width,
              x,
              y,
            },
          });
        }

        boxIndex++;
      },
    );
  }

  create() {
    const { characters } = this.sceneConfig;
    const { player: playerConfig } = characters;

    this.tilemap = this.make.tilemap({
      key: gameConfig.names.map,
    });

    console.log("tilemap", this.tilemap);

    this.cellSize = this.tilemap.tileWidth;
    const layers: Phaser.Tilemaps.TilemapLayer[] = [];

    this.tilemap.tilesets.forEach((tile) => {
      this.tilemap?.addTilesetImage(tile.name, tile.name);
    });

    for (let i = 0; i < (this.tilemap?.layers.length || 0); i++) {
      const layer = this.tilemap?.createLayer(
        i,
        this.tilemap.tilesets.map((tile) => tile.name),
        0,
        0,
      );

      if (layer) {
        layers.push(layer);
      }
    }

    this.createBoxes(this.tilemap.objects);
    const { player, npc, monsters } = this.createCharacters(this.tilemap);

    const npcList = Object.values(npc).map((char) => {
      const config: CharacterDataHeadless = {
        //@ts-ignore
        sprite: char.sprite,
        startPosition: player.config.startedPosition,
        speed: 5,
      };

      return config;
    });

    const monsterList = Object.values(monsters).map((char) => {
      const config: CharacterDataHeadless = {
        id: char.config.id,
        //@ts-ignore
        sprite: char.sprite,
        startPosition: char.config.startedPosition,
        speed: 5,
      };

      return config;
    });

    const gridEngineConfig: GridEngineConfigHeadless = {
      characters: [
        {
          id: player.config.id,
          //@ts-ignore
          sprite: player.sprite,
          startPosition: playerConfig.startedPosition,
          speed: playerManager.getSkillValue("move"),
        },

        ...npcList,
        ...monsterList,
      ],
    };

    this.gridEngine.create(
      this.tilemap as unknown as Tilemap,
      gridEngineConfig,
    );

    this.checkDirection();

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.pointer = new Pointer(this);

    playerManager.listenChangeValue("move", (value) => {
      this.gridEngine.setSpeed(player.config.id, value);
    });

    //#region Lighting
    this.sun = new Sun(this);

    this.tilemap?.layers.forEach((layer) =>
      layer.tilemapLayer.setPipeline("Light2D"),
    );
    player.sprite.setPipeline("Light2D");

    this.objectState = this.tilemap.objects.reduce((acm, obj) => {
      const name = obj.name as MapObjectLayerNames;
      acm[name] = obj;
      return acm;
    }, {} as Record<MapObjectLayerNames, Phaser.Tilemaps.ObjectLayer>);

    const lightState: Record<string, Light> = {};

    const flames = this.objectState.flames?.objects?.map(
      ({ id, width, height, x = -100, y = -100, properties }, i) => {
        const props = formatProperties<"radius">(properties);

        const flame = new Flame(this, {
          positionType: "coordinates",
          x,
          y,
          id,
          radius: width,
          light: {
            radius: (props?.radius as TiledNumberProp).value,
          },
        });

        lightState["flame_" + (id || `${x}_${y}`)] = flame.light;

        return flame;
      },
    );

    const lights = this.objectState.lights.objects?.map(
      ({ id, x = 0, width = 0, height = width, y = 0, properties }) => {
        const props = formatProperties<"color" | "intensity">(properties);

        const color = props.color as TiledColorProp;
        const intensity = props.intensity as TiledNumberProp;
        const radius = Math.max(width, height);

        const light = new Light(this, {
          x: x + width / 2,
          y: y + height / 2,
          color: formatColor(color.value).color,
          intensity: intensity.value,
          radius,
          id,
          positionType: "coordinates",
        });
        lightState[id] = light;

        return light;
      },
    );

    this.lightElements.static = {
      list: [...lights, ...flames.map(({ light }) => light)],
      state: lightState,
    };

    this.raycaster = new Raycaster(this);

    //#endregion Lighting
  }

  playerLight?: Light;

  update(time: number, delta: number) {
    this.characters.player?.checkMovement();
    this.sun?.update();
    this.raycaster?.update();

    if (this.characters.player) {
      const { x, y, width, height } = this.characters.player.sprite;
      this.playerLight?.light.setPosition(x + width / 2, y + height / 2);
    }
  }

  checkDirection = () => {
    const createListener = (event: DetectMoveEvent) => {
      return ({
        charId,
        direction,
      }: {
        charId: any; // для subscribe, бо там charId це string
        direction: Direction;
      }) => {
        this.characters.all[charId as CharacterName]?.updateDirection(
          event,
          direction,
        );
      };
    };
    this.gridEngine
      .movementStarted()
      .subscribe(createListener("movementStarted"));
    this.gridEngine
      .movementStopped()
      .subscribe(createListener("movementStopped"));
    this.gridEngine
      .directionChanged()
      .subscribe(createListener("directionChanged"));
  };
}
