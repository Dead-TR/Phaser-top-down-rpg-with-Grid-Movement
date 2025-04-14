import { LoaderResources } from "type";

const mainAssetsPath = "assets/";
const locationsPath = mainAssetsPath + "locations/";
const effectsPath = mainAssetsPath + "effects/";
const charactersPath = mainAssetsPath + "characters/";

export const tileNames = [
  "grass",
  "objects",
  "Assets_source",
  "elderObj",
] as const;

export const gameTiles: Record<(typeof tileNames)[number], string> = {
  grass: locationsPath + "/grass_32.png",
  objects: locationsPath + "/objects.png",
  Assets_source: locationsPath + "/mapTiles/Assets_source.png",
  elderObj: locationsPath + "/elderObj.png",
};

export const mainResources: LoaderResources = {
  image: [
    ["shadow_directed", effectsPath + "shadow_directed.png"],
    ["shadow_move", effectsPath + "shadow_move.png"],
    ["shadow_center", effectsPath + "shadow_center.png"],
    ["shadow_static", effectsPath + "shadow_static.png"],
  ],
};

const charResConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
  frameWidth: 320,
  frameHeight: 320,
  startFrame: 0,
  endFrame: 25,
};

const addCharacterSheet = <TextureName extends string>(
  textureName: TextureName,
  path: string,
) => {
  return [textureName, path, charResConfig] as const;
};

const charactersSpriteSheets = [
  addCharacterSheet(
    "player_idle_down",
    charactersPath + "player/Idle Down Sheet001.png",
  ),
  addCharacterSheet(
    "player_idle_up",
    charactersPath + "player/Idle Up Sheet001.png",
  ),
  addCharacterSheet(
    "player_idle_right",
    charactersPath + "player/Idle Side Sheet001.png",
  ),
  addCharacterSheet(
    "player_walk_down",
    charactersPath + "player/Walk Down Sheet001.png",
  ),
  addCharacterSheet(
    "player_walk_right",
    charactersPath + "player/Walk Side Sheet001.png",
  ),
  addCharacterSheet(
    "player_walk_up",
    charactersPath + "player/Walk Up Sheet001.png",
  ),
  addCharacterSheet(
    "player_run_down",
    charactersPath + "player/Run Down Sheet001.png",
  ),
  addCharacterSheet(
    "player_run_right",
    charactersPath + "player/Run Side Sheet001.png",
  ),
  addCharacterSheet(
    "player_run_up",
    charactersPath + "player/Run Up Sheet001.png",
  ),

  addCharacterSheet(
    "player_bow_load_up",
    charactersPath + "player/Bow Load Up Sheet001.png",
  ),
  addCharacterSheet(
    "player_bow_load_right",
    charactersPath + "player/Bow Load Side Sheet001.png",
  ),
  addCharacterSheet(
    "player_bow_load_down",
    charactersPath + "player/Bow Load Down Sheet001.png",
  ),
  addCharacterSheet(
    "player_bow_attack_up",
    charactersPath + "player/Bow Release Up Sheet001.png",
  ),
  addCharacterSheet(
    "player_bow_attack_right",
    charactersPath + "player/Bow Release Side Sheet001.png",
  ),
  addCharacterSheet(
    "player_bow_attack_down",
    charactersPath + "player/Bow Release Down Sheet001.png",
  ),
] as const;

export const charactersResources: LoaderResources = {
  //@ts-ignore
  spritesheet: charactersSpriteSheets,
};

export type CharacterTextureNames = (typeof charactersSpriteSheets)[number][0];
