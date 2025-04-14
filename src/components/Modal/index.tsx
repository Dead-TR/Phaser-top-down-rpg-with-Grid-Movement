import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import css from "./style.module.css";
import { ReactComponent as Close } from "./close.svg";

interface Props {
  children?: React.ReactNode;

  isOpen: boolean;
  onClose: () => void;

  className?: string;
}

const modal = document.querySelector("#modal")!;

export const Modal: FC<Props> = ({ isOpen, onClose, children, className }) => {
  const [isCloseAnimation, setIsCloseAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) setIsCloseAnimation(false);
  }, [isOpen]);

  const close: MouseEventHandler<HTMLDivElement | HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCloseAnimation(true);

    setTimeout(() => {
      onClose();
    }, 500);
  };

  return createPortal(
    <div className={clsx(css.modalRoot, isCloseAnimation && css.closeRoot)}>
      <div className={css.blind} onClick={close} />
      <div className={clsx(css.content, className)}>
        <button className={css.close} onClick={close}>
          <Close />
        </button>
        {children}
      </div>
    </div>,
    modal,
  );
};
