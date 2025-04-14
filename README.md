# Installation
This project is built with [Create React App](https://create-react-app.dev/) and uses [Phaser](https://phaser.io/) for game development. It requires **Node.js v14**.

## Prerequisites
- [Node.js](https://nodejs.org/en/) (version **14.x**)
- [npm](https://www.npmjs.com/)

1. Clone the repository

2. Install dependencies:
  ```npm install```

3. Start the development server:
```npm start```


# Game Setup
The game uses [Phaser](https://phaser.io/) for rendering and [Tiled](https://www.mapeditor.org/) for building levels. React is used for managing UI components like modals, inventory, and character progression.

## Project Structure
- *App.tsx*
  - Contains two key components:
    - `Game` — Handles the game instance via Phaser.
    - `Windows` — Handles all React-based popup windows (e.g., Inventory, Skill tree).
  - There is also a `HUD` component, currently commented out and under development.

## Phaser Initialization
- The Phaser game is initialized inside the `Game` component via the `renderGame` function.
- `renderGame()` creates a new `Phaser.Game` instance with a `gameConfig` object.
- `gridEngine` is registered as a plugin for handling movement and collisions.

- The active scene is `DemoLocation`, used as a demo/test map and development starting point:
  `scene: [DemoLocation]`

## Scene Architecture
  ```ts
  export class DemoLocation extends GameScene {}

  export class GameScene extends Phaser.Scene {
    constructor(
      loaderResources: LoaderResources,
      currentMapPath: string,
      config: SceneConfig,
    ) { ... }
  }
  ```

 - **LoaderResources** — Resources that must be loaded before the scene can start.
  ```ts
    export type LoaderResources = {
      [K in keyof Phaser.Loader.LoaderPlugin]?: Parameters<Loader[K]>[];
    };
  ```

- **currentMapPath** — Path to the JSON map file exported from Tiled.
- **SceneConfig** — Scene-specific configuration object.

  ``` ts
    export interface SceneConfig {
      boxes?: PreparedBox[];
      characters: {
        player: {
          startedPosition: CharacterConfig["startedPosition"];
        };
        NPC: Partial<Record<CharacterName, CharacterConfig["startedPosition"]>>;
        enemy: Partial<Record<CharacterName, CharacterConfig["startedPosition"]>>;
      };
      dayLighting: [string, string, string, string, string]; // Hex colors for different times of day
      currentTime: number; // Starting hour (0–23)
    }
  ```

  ### boxes
    List of chests present on the map. Their index corresponds to the `id` in Tiled.
  If a chest is created in Tiled but not defined in the config, it will be randomly filled with loot from `simpleRandomItems` or `lockedRandomItems`, and will have a randomly generated lock difficulty.
  If a chest is defined in the config but its `items` array is missing, the loot will also be randomly generated.

  - **PreparedBox**
    ```ts
    export interface PreparedBox {
      lock: number; // Lock difficulty (0 or less means unlocked)
      items: Item[]; // Loot contents
    }
    ```

  ### characters
    Configuration for character spawn positions:
  - `player`: starting position
  - `NPC`: spawn settings for non-playable characters
  - `enemy`: spawn settings for enemies

  ### dayLighting
    An array of five hex color values for dynamic time-of-day lighting.

  ### currentTime
    Starting in-game hour for the scene.

## Map Editor (Tiled)
Use [Tiled](https://www.mapeditor.org/) to design game levels. Several custom objects are recognized in the engine:

| Object Name | Description |
|-------------|-------------|
| `light`     | Creates a circular light source. Radius is based on the greater of width/height. |
| `shadow`    | Creates a dynamic shadow that moves according to in-game time. |
| `box`       | Creates a lootable chest. You must define an `id` for it to link with loot tables. Players can interact with it from adjacent tiles. |
| `flame`     | Adds flame particle effects to the scene. |


## Useful Links
- [Grid Engine](https://annoraaq.github.io/grid-engine/)
- [Tile Collision Properties](https://annoraaq.github.io/grid-engine/p/tile-properties/#one-way)

# Managers
To coordinate logic between the Phaser environment and the React interface, several **managers** are used. These are classes that encapsulate state and behavior for specific systems and provide a unified API for both game and UI components.

## InventoryManager
The most developed manager is the `InventoryManager`. It handles all logic related to the player's inventory, equipment, item boxes, and Etheria (a form of in-game currency).

The manager is based on an `EventEmitter`, which allows both Phaser and React components to subscribe to inventory changes and react to updates in real-time.

Usage from Phaser might look like this:

  ```ts
    const distance = getDistanceBetweenPointAndSquare(playerPoint, location);
    if (distance <= tileWidth) {
        inventoryManager.openBox(currentBox.items || []);
    }
  ```

Core methods include:
- `openBox(items: Item[])`: opens a container with items.
- `closeBox()`: closes the container.
- `equip(item: Item)`: equips an item (if allowed).
- `castOut(item: Item)`: unequips or drops the item.
- `moveItem(where: "toPlayer" | "toBox", items: Item[])`: transfers items between the player's inventory and the opened container.
- `setEtheria(amount: number, type: "add" | "set")`: modifies the Etheria balance.
- `getFullInventory()`: returns a flat array of all items for display.
- `listener(...)`: subscribes to inventory events, such as box opening, equipping items, or Etheria updates.

The manager emits several types of events, including:
- `OPEN_BOX`
- `EQUIP_ITEM`
- `OPEN_INVENTORY`
- `UPDATE_ETHERIAS`

Each of them can be subscribed to using the `listener` method. This allows the UI to stay in sync with game events without directly polling the game state.

## Other Managers

While the `InventoryManager` is currently the most complete, several other managers are partially implemented:

- `PlayerManager`: planned to handle player experience, stats, and leveling.
- `CombatManager`: intended to manage health, attacks, and combat-related states.
- `InterfaceManager`: was planned for managing UI-specific global state.

These managers were meant to encapsulate logic in a clean and testable way, enabling better separation of concerns between game logic and UI presentation. While they are not fully realized, they lay the groundwork for further development.

# Project Status
Active development of this project has been discontinued.
However, the codebase remains open and freely available for anyone who wishes to use, modify, or expand upon it for their own purposes.
Feel free to fork the repository, experiment with the game engine, and build something new on top of it. Contributions are not expected, but always welcome.
