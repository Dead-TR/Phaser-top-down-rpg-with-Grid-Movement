import { Fragment } from "react";

import { repeat } from "utils";
import css from "../style.module.css";
import { ItemCell } from "../components";

// 5 * 10 === itemsPerRow * rows; From CSS
export const createEmptyCells = (length: number, rows = 10) => {
  const amount = 5 * rows - length;
  if (amount <= 0) return null;

  return repeat(amount, (i) => (
    <Fragment key={"emptyItem_" + (amount - i)}>
      <ItemCell item={null} />
    </Fragment>
  ));
};
