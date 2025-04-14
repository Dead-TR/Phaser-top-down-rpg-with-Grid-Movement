import React, { FC } from "react";
import css from "./style.module.css";
import { inventoryManager } from "managers/InventoryManager";

export const PackButton: FC = () => {
  return (
    <button
      className={css.inventory}
      onClick={() => {
        debugger;
        inventoryManager.openInventory();
      }}>
      Inventory
    </button>
  );
};
