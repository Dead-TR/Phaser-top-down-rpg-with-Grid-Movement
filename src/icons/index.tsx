import React, { FC, SVGProps } from "react";
import { icons } from "./asses";

interface Props extends SVGProps<SVGSVGElement> {
  type: keyof typeof icons;
}

export const Icon: FC<Props> = ({ type, ...props }) => {
  const Component = icons[type];
  return <Component {...props} />;
};
