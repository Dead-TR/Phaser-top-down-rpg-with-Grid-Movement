import React, { FC } from "react";
import css from "./style.module.css";
import clsx from "clsx";

type Span = JSX.IntrinsicElements["span"];

interface Props extends Span {
  children?: React.ReactNode;

  type?: "title" | "default";
  disabled?: boolean;
}

export const Text: FC<Props> = ({
  children,
  className,
  type = "default",
  disabled = false,
  ...props
}) => {
  return (
    <span className={clsx(css.text, css[type], className)} {...props}>
      {children}
    </span>
  );
};
