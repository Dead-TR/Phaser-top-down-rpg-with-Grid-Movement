import React, { FC } from "react";
import clsx from "clsx";

import { Item as ItemType } from "type";
import css from "./style.module.css";

interface Props {
  item?: ItemType | null;
  onClick?: () => void;
  selected?: boolean;
  onContext?: () => void;
}

export const ItemCell: FC<Props> = ({ item, onClick, selected, onContext }) => {
  return (
    <button
      onContextMenu={(e) => {
        e.preventDefault();
        onContext && onContext();
      }}
      className={clsx(css.item, selected && css.selectedItem)}
      onClick={onClick}>
      {item && <img src={item.icon} alt={item.name} />}

      {item && item.type === "other" && item.amount ? (
        <span className={css.amount}>{item.amount}</span>
      ) : null}
    </button>
  );
};
