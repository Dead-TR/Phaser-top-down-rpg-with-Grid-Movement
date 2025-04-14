import React, { FC } from "react";

import css from "./style.module.css";
import clsx from "clsx";

type ButtonProps = JSX.IntrinsicElements["button"];

interface Props extends ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Button: FC<Props> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(css.button, className, disabled && css.disabledButton)}
      {...props}>
      {children}
    </button>
  );
};
