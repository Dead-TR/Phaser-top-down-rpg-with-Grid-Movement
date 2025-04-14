import React, { FC, Fragment, useEffect, useState } from "react";
import clsx from "clsx";

import {
  allowedEquipmentTypes,
  saturatorEquipAmount,
  typeNames,
} from "managers/config";
import { repeat } from "utils";
import { useEtheria } from "hooks";
import { Button, Etheria, Modal } from "components";
import { EquipmentItems, Item, ItemType } from "type";
import { inventoryManager } from "managers/InventoryManager";

import { Description, ItemCell } from "./components";
import { createEmptyCells } from "./utils";
import css from "./style.module.css";

export const UserPack: FC = () => {
  const [inventory, setInventory] = useState<Record<
    ItemType,
    (Item & { selected?: boolean })[]
  > | null>(null);
  const [selectedType, setSelectedType] = useState<ItemType>("meleeWeapon");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [equipment, setEquipment] = useState<EquipmentItems>(
    () => inventoryManager.equipment,
  );
  const { etheria } = useEtheria();

  useEffect(() => {
    const rmOpen = inventoryManager.listener("openInventory", (inventory) =>
      setInventory(inventory),
    );

    const rmEquip = inventoryManager.listener(
      "equip",
      ({ equipment, inventory }) => {
        setSelectedItem(null);
        setInventory(inventory);
        setEquipment(equipment);
      },
    );

    return () => {
      rmOpen();
      rmEquip();
    };
  }, []);

  const close = () => {
    setInventory(null);
  };

  const isDisableUseButton =
    !selectedItem || !allowedEquipmentTypes.includes(selectedItem?.type);

  const getEquipButtonText = () => {
    if (!selectedItem) return "Екіпірувати";
    // @ts-ignore
    if (selectedItem?.isUsable) return "Використати";

    const equip =
      inventoryManager.equipment[selectedItem.type as keyof EquipmentItems];

    if (equip) {
      if (Array.isArray(equip)) {
        const isEquipped = equip.includes(selectedItem);
        if (isEquipped) return "Зняти";
      } else {
        if (selectedItem === equip) return "Зняти";
      }
    } else {
      return "Екіпірувати";
    }

    return "Екіпірувати";
  };

  return inventory ? (
    <Modal isOpen={!!inventory} onClose={close}>
      <div className={css.container}>
        <div className={css.buttonsPanel}>
          <div className={css.types}>
            {Object.entries(typeNames).map(([type, name]) => {
              return (
                <Button
                  disabled={selectedType !== type}
                  onClick={() => setSelectedType(type as ItemType)}>
                  {name}
                </Button>
              );
            })}
          </div>

          <div className={css.action}>
            <Button
              className={css.typeButton}
              style={isDisableUseButton ? { opacity: 0.5 } : undefined}
              disabled={isDisableUseButton}
              onClick={() => {
                selectedItem && inventoryManager.equip(selectedItem);
              }}>
              {getEquipButtonText()}
            </Button>

            <Button
              className={css.typeButton}
              style={!selectedItem ? { opacity: 0.5 } : undefined}
              disabled={!selectedItem || selectedItem.type === "questItems"}
              onClick={() =>
                selectedItem && inventoryManager.castOut(selectedItem)
              }>
              Викинути
            </Button>
          </div>
        </div>

        <div className={css.boxSection}>
          <div className={clsx(css.inventory)}>
            {inventory[selectedType].map((item) => {
              return (
                <ItemCell
                  item={item}
                  selected={selectedItem === item}
                  onClick={() => setSelectedItem(item)}
                  onContext={() => setSelectedItem(item)}
                />
              );
            })}
            {createEmptyCells(inventory[selectedType].length, 11)}
          </div>
        </div>

        <div className={css.clothedPanel}>
          <div className={css.iTop}>
            <div />

            <Etheria value={etheria} />
          </div>
          <div className={css.equips}>
            <div className={css.eTop}>
              <ItemCell
                item={equipment.body}
                selected={selectedItem === equipment.body}
                onClick={() => setSelectedItem(equipment.body || null)}
                onContext={() => setSelectedItem(equipment.body || null)}
              />
            </div>
            <div className={css.eMid}>
              <ItemCell
                item={equipment.bow}
                onClick={() => setSelectedItem(equipment.bow || null)}
                selected={selectedItem === equipment.bow}
              />
              <ItemCell
                item={equipment.meleeWeapon}
                onClick={() => setSelectedItem(equipment.meleeWeapon || null)}
                onContext={() => setSelectedItem(equipment.meleeWeapon || null)}
                selected={selectedItem === equipment.meleeWeapon}
              />
            </div>
            <div className={css.eBottom}>
              {repeat(saturatorEquipAmount, (i) => {
                const currentItem = equipment.saturator[i] as Item | undefined;
                const isSelected = selectedItem === currentItem;
                return (
                  <Fragment
                    key={`_${i}_${currentItem?.type}_${currentItem?.icon}_${currentItem?.description}`}>
                    <ItemCell
                      item={currentItem}
                      onClick={() => setSelectedItem(currentItem || null)}
                      onContext={() => setSelectedItem(currentItem || null)}
                      selected={isSelected}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>

          <Description item={selectedItem} />
        </div>
      </div>
    </Modal>
  ) : null;
};
