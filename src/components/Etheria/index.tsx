import React, { FC } from "react";
import css from "./style.module.css";
import { otherList } from "items/assets";

interface Props {
  value: number | string;
}

export const Etheria: FC<Props> = ({ value }) => {
  return (
    <div className={css.etheria}>
      <span>{typeof value === "number" ? value.toFixed(0) : value}</span>
      <img src={otherList.ether} alt="etheria" />
    </div>
  );
};
