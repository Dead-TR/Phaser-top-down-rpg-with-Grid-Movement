import React, { FC, Fragment, useEffect, useState } from "react";
import clsx from "clsx";

import { ReactComponent as DownArrow } from "./downArrow.svg";

import { inventoryManager } from "managers/InventoryManager";
import { Button, Modal } from "components";
import { repeat } from "utils";
import { Item } from "type";

import css from "./style.module.css";
import { createEmptyCells } from "./utils";
import { Description, ItemCell } from "./components";

interface Props {}

type ItemState = Item & {
  selected?: boolean;
};

interface BoxState {
  box: ItemState[];
  user: ItemState[];
}

export const OpenBoxWindow: FC<Props> = ({}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [inventories, setInventories] = useState<BoxState | null>(null);

  const close = () => {
    inventories?.box.forEach((item) => delete item.selected);
    inventoryManager.closeBox();
  };

  useEffect(() => {
    const rm = inventoryManager.listener("openBox", (box) => {
      if (box) {
        const user = inventoryManager.getFullInventory();
        setInventories({ box, user });
      } else {
        setInventories(null);
        setSelectedItem(null);
      }
    });
    return () => rm();
  }, []);

  const select = (type: keyof BoxState, item: Item) => {
    setInventories((old) => {
      if (old) {
        const currentItem = old[type].find((i) => item === i);
        if (currentItem) currentItem.selected = !currentItem.selected;

        return { ...old };
      }

      return old;
    });

    setSelectedItem(item);
  };

  return (
    <>
      {inventories ? (
        <Modal isOpen={!!inventories} onClose={close}>
          <div className={css.container}>
            <div className={clsx(css.inventory, css.user)}>
              {inventories.user.map((item, i) => {
                return (
                  <Fragment
                    key={
                      item.description +
                      item.icon +
                      item.name +
                      item.price +
                      item.type +
                      i
                    }>
                    <ItemCell
                      item={item}
                      selected={item.selected}
                      onClick={() => select("user", item)}
                      onContext={() => setSelectedItem(item)}
                    />
                  </Fragment>
                );
              })}
              {createEmptyCells(inventories.user.length)}
            </div>
            <div className={css.buttons}>
              <Button
                className={css.moveButton}
                onClick={() =>
                  inventoryManager.moveItem(
                    "toBox",
                    inventories.user.filter((item) => {
                      const selected = item.selected;
                      delete item.selected;
                      return selected;
                    }),
                  )
                }>
                <DownArrow className={css.toBox} />
              </Button>

              <Button
                className={css.moveButton}
                onClick={() =>
                  inventoryManager.moveItem(
                    "toPlayer",
                    inventories.box.filter((item) => {
                      const selected = item.selected;
                      delete item.selected;
                      return selected;
                    }),
                  )
                }>
                <DownArrow className={css.toUser} />
              </Button>
            </div>
            <div className={css.boxSection}>
              <div className={clsx(css.inventory, css.box)}>
                {inventories.box.map((item, i) => {
                  return (
                    <Fragment
                      key={
                        item.description + item.icon + item.name + item.type + i
                      }>
                      <ItemCell
                        item={item}
                        selected={item.selected}
                        onClick={() => select("box", item)}
                        onContext={() => setSelectedItem(item)}
                      />
                    </Fragment>
                  );
                })}
                {createEmptyCells(inventories.box.length, 7)}
              </div>

              <Description item={selectedItem} />
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
