import EventEmitter from "events";
import { EquipmentItems, Item, ItemType, OtherItems } from "type";
import { createListener, findAndRemoveFromArray } from "utils";
import {
  allowedEquipmentTypes,
  managerEvents,
  saturatorEquipAmount,
} from "./config";

class InventoryManager {
  constructor() {}
  private openedBox: Item[] | null = null;
  private emitter = new EventEmitter();

  equipment: EquipmentItems = {
    saturator: [],
  };
  playerInventory: Record<ItemType, Item[]> = {
    body: [],
    bow: [],
    meleeWeapon: [],
    other: [],
    questItems: [],
    saturator: [],
  };
  etheria = 0;

  castOut = (item: Item) => {
    const { type } = item;
    let isEquip = false;

    if (type === "saturator") {
      // Перевірка, чи предмет уже не одягнено
      if (this.equipment.saturator.includes(item)) {
        this.equipment.saturator = this.equipment.saturator.filter(
          (i) => i !== item,
        );
        isEquip = true;
      }
    } else {
      // Перевірка, чи предмет уже не одягнено
      if (this.equipment[type as keyof EquipmentItems] === item) {
        //@ts-ignore
        delete this.equipment[type];
      }
    }
    this.playerInventory[type] = this.playerInventory[type].filter(
      (i) => i !== item,
    );

    this.emitter.emit(managerEvents.EQUIP_ITEM, {
      equipment: this.equipment,
      inventory: this.playerInventory,
    });
  };

  equip = (item: Item) => {
    const { type } = item;
    let unEquip = false;

    if (allowedEquipmentTypes.includes(type)) {
      debugger;
      let oldEquipItem: Item | undefined = undefined;

      // Якщо це сатуратор -- буде робота з масивом
      if (type === "saturator") {
        // Перевірка, чи предмет уже не одягнено
        if (this.equipment.saturator.includes(item)) {
          this.equipment.saturator = this.equipment.saturator.filter(
            (i) => i !== item,
          );
          oldEquipItem = item;
          unEquip = true;
        } else {
          if (this.equipment.saturator.length >= saturatorEquipAmount) {
            oldEquipItem = this.equipment.saturator[saturatorEquipAmount - 1];
            this.equipment.saturator[saturatorEquipAmount - 1] = item;
          } else {
            this.equipment.saturator.push(item);
          }
        }
      } else {
        // Перевірка, чи предмет уже не одягнено
        if (this.equipment[type as keyof EquipmentItems] === item) {
          //@ts-ignore
          delete this.equipment[type];
          oldEquipItem = item;
          unEquip = true;
        } else {
          oldEquipItem = this.equipment[type as keyof EquipmentItems] as
            | Item
            | undefined;

          //@ts-ignore -- because this.equipment[type] it is item. Not array.
          this.equipment[type as keyof EquipmentItems] = item;
        }
      }

      if (oldEquipItem) this.playerInventory[type].push(oldEquipItem);
      if (!unEquip)
        this.playerInventory[type] = this.playerInventory[type].filter(
          (i) => i !== item,
        );
    }

    this.emitter.emit(managerEvents.EQUIP_ITEM, {
      equipment: this.equipment,
      inventory: this.playerInventory,
    });
  };

  getFullInventory = () => {
    const { body, meleeWeapon, bow, saturator, other, questItems } =
      this.playerInventory;

    return [
      // FOR SAVE ORDER
      ...body,
      ...meleeWeapon,
      ...bow,
      ...saturator,
      ...other,
      ...questItems,
    ];
  };

  moveItem = (where: "toPlayer" | "toBox", items: Item[]) => {
    items.forEach((item) => {
      if (!this.openedBox) throw "There is no open box";
      const { type } = item;

      switch (where) {
        case "toBox":
          findAndRemoveFromArray(this.playerInventory[type], item);
          this.openedBox?.push(item);
          break;

        case "toPlayer":
          if (item.type === "other") {
            if (item.item === OtherItems.etheria) {
              this.etheria += item.amount;
              this.emitter.emit(managerEvents.UPDATE_ETHERIAS, this.etheria);
            } else {
              const currentItemInInventory = this.playerInventory.other.find(
                ({ id }) => id === item.id,
              );
              if (
                currentItemInInventory &&
                currentItemInInventory.type === "other"
              ) {
                currentItemInInventory.amount += item.amount;
              } else {
                this.playerInventory.other.push(item);
              }
            }
          } else {
            this.playerInventory[type].push(item);
          }
          findAndRemoveFromArray(this.openedBox, item);
          break;

        default:
          break;
      }
    });

    this.emitter.emit(managerEvents.OPEN_BOX, this.openedBox);
  };

  openBox(box: Item[]) {
    this.openedBox = box;
    this.emitter.emit(managerEvents.OPEN_BOX, box);
  }

  closeBox() {
    this.openedBox = null;
    this.emitter.emit(managerEvents.OPEN_BOX, null);
  }

  openInventory = () => {
    this.emitter.emit(managerEvents.OPEN_INVENTORY, this.playerInventory);
  };

  private listeners = {
    openBox: (callBack: (box: null | Item[]) => void) => {
      return createListener(this.emitter, managerEvents.OPEN_BOX, callBack);
    },
    openInventory: (callBack: (value: Record<ItemType, Item[]>) => void) => {
      return createListener(
        this.emitter,
        managerEvents.OPEN_INVENTORY,
        callBack,
      );
    },
    equip: (
      callBack: (value: {
        equipment: EquipmentItems;
        inventory: Record<ItemType, Item[]>;
      }) => void,
    ) => {
      return createListener(this.emitter, managerEvents.EQUIP_ITEM, callBack);
    },
    etheria: (callBack: (v: number) => void) => {
      return createListener(
        this.emitter,
        managerEvents.UPDATE_ETHERIAS,
        callBack,
      );
    },
  };

  listener = <
    K extends keyof typeof this.listeners,
    P extends Parameters<(typeof this.listeners)[K]>[0],
  >(
    key: K,
    callBack: P,
  ) => {
    const listener = this.listeners[key];
    //@ts-ignore
    return listener(callBack);
  };

  setEtheria = (v: number, type: "add" | "set") => {
    if (type === "add") this.etheria += v;
    else this.etheria = v;
    this.emitter.emit(managerEvents.UPDATE_ETHERIAS, this.etheria);
  };
}

export const inventoryManager = new InventoryManager();
