import type { Character, Player } from "./game/entities/modules";
import type { CharacterTextureNames } from "./game/resources";

export type { CharacterTextureNames } from "./game/resources";

type Loader = Phaser.Loader.LoaderPlugin;

export type LoaderResources = {
  //@ts-ignore
  [K in keyof Loader]?: Parameters<Loader[K]>[];
};

export type MapResource = Parameters<Loader["tilemapTiledJSON"]>;

export type CharacterName = "Player" | "Monster";

/**id: Character */

export interface CharactersState {
  NPC?: Record<string, Character>;
  enemy?: Record<string, Character>;
  player?: Player;

  all: Record<CharacterName, Character>;
}

export interface AnimationSheetDirectionTypes {
  top: CharacterTextureNames;
  bottom: CharacterTextureNames;
  right: CharacterTextureNames;
}

export type AnimationTypeName =
  | "idle"
  | "walk"
  | "run"
  | "bowLoad"
  | "bowAttack";

export interface CharacterConfig {
  spriteSheets: Record<AnimationTypeName, AnimationSheetDirectionTypes>;

  startedPosition: { x: number; y: number };
  scale: number;
  type: "friend" | "enemy";

  // Кожен ID (CharacterName) буде унікальним. Це ІМ'Я конкретного персонажа чи монстра
  id: CharacterName;
  skills: Skills;
  equipment: EquipmentItems;
}

export interface SceneConfig {
  boxes?: PreparedBox[];
  characters: {
    player: {
      startedPosition: CharacterConfig["startedPosition"];
    };
    NPC: Partial<Record<CharacterName, CharacterConfig["startedPosition"]>>;
    enemy: Partial<Record<CharacterName, CharacterConfig["startedPosition"]>>;
  };
  /** [ sunrise, noon, sunset, midnight ]
   ** sunrise: 6:00
   ** noon: 12:00
   ** sunset: 18:00
   ** noon: 00:00
   */
  dayLighting: [string, string, string, string, string];
  currentTime: number;
}

/** Skills Readme
 ** attackCoolDown -- час перезарядки. Очікування після попередньої атаки
 ** health -- кількість одиниць здоров'я
 ** lockBreaking -- взлом замка. Якщо рівень замка нижчий - взлом не успішний. Інакше -- скриня відкривається
 ** magic -- шанс у відсотках (0-100%) що атака магією поцілить
 ** meleeWeapon -- шанс у відсотках (0-100%) що атака ближньою зброєю поцілить
 ** bow -- шанс у відсотках (0-100%) що атака з лука поцілить
 ** parry -- шанс у відсотках (0-100%) що атака ворога не поцілить
 ** move -- швд пересування, в конфігу greed engine
 */
export interface Skills {
  /**Здоров'я (витривалість) */
  health: number;
  /**Швд. руху */
  move: number;
  /**Кулдаун атаки */
  attackCoolDown: number;
  /**Володіння Холодною Зброєю >> ШАНС ПОПАДАННЯ*/
  meleeWeapon: number;
  /**Володіння Луками >> ШАНС ПОПАДАННЯ*/
  bow: number;
  /**Парирування (Ухилення) */
  parry: number;
  /**Володіння Магією */
  magic: number;
  /**Взлом замків */
  lockBreaking: number;
}

export enum OtherItems {
  /**Відмички */
  picklock,
  /**Етерія */
  etheria,
}

type DefaultITem = {
  icon: string;
  name: string;
  description?: string;
  price: number;
  id: number;
};
export type ItemBody = {
  type: "body";
  protection: number;
  skills?: Skills;
} & DefaultITem;
export type ItemWeapon = {
  type: "meleeWeapon" | "bow";
  damage: number;
  skills?: Skills;
} & DefaultITem;
export type ItemSaturator = {
  type: "saturator";
  skills: Partial<Skills>;
  isDiscovered: boolean;
} & DefaultITem;
export type ItemOther = {
  type: "other";
  item: OtherItems;
  isUsable: boolean;
  amount: number;
} & DefaultITem;
export type ItemQuests = {
  type: "questItems";
} & DefaultITem;

export type Item =
  | ItemBody
  | ItemWeapon
  | ItemSaturator
  | ItemOther
  | ItemQuests;

export type ItemType = Item["type"];

export interface PreparedBox {
  /**lock level.
   ** If <=0 not locked*/
  lock: number;
  items?: Item[];
}
export interface Box extends PreparedBox {
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface EquipmentItems {
  body?: Item;
  meleeWeapon?: Item;
  bow?: Item;
  saturator: Item[];
}

export interface LightConfig {
  x: number;
  y: number;
  positionType: "tile" | "coordinates";
  radius?: number;
  color?: number;
  intensity?: number;

  id?: string | number;
}

export interface FireConfig {
  x: number;
  y: number;
  positionType: "tile" | "coordinates";
  radius?: number;

  id?: string | number;

  light?: {
    radius?: number;
    color?: number;
    intensity?: number;
  };
}

export interface RayLight {
  x: number;
  y: number;
  radius: number;
}

export interface RayBody {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: "circle" | "rectangle";
}

export type MapObjectLayerNames = "flames" | "shadows" | "lights";

/**value example: '#ffff0084' */
export interface TiledColorProp {
  name: string;
  type: "color";
  value: string;
}
export interface TiledBoolProp {
  name: string;
  type: "bool";
  value: boolean;
}
export type TiledNumberProp =
  | { name: string; type: "int"; value: number }
  | { name: string; type: "float"; value: number };
export interface TiledStringProp {
  name: string;
  type: "string";
  value: string;
}
export type TiledProperty =
  | TiledBoolProp
  | TiledColorProp
  | TiledStringProp
  | TiledNumberProp;

export type FormattedProperties<Name extends string> = Record<
  Name,
  TiledProperty
>;

export interface ShadowConfig {
  height: number;
  id: number;
  properties: TiledProperty[];
  width: number;
  x: number;
  y: number;
}

export interface ShadowParams {
  type: "default" | "fromCenter" | "move" | "static";
}

export type DetectMoveEvent =
  | "movementStarted"
  | "movementStopped"
  | "directionChanged";

export type DistanceCombatType = "bow" | "ice";

export interface AnimationConfig
  extends Omit<Phaser.Types.Animations.PlayAnimationConfig, "key"> {
  onComplete?: () => void;
  onRepeat?: () => void;
}
