import React, { FC } from "react";
import { Item } from "type";
import css from "./style.module.css";

interface Props {
  item: Item | null;
}

export const Description: FC<Props> = ({ item }) => {
  return (
    <div className={css.description}>
      {item ? (
        <div className={css.descriptionContent}>
          <div className={css.descriptionContainer}>
            <img src={item.icon} alt={item.name} />
            <div>{item.name}</div>
            <div>{item.description}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
