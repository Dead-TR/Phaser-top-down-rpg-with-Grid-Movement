import { FC } from "react";

import { OpenBoxWindow } from "./Inventory/OpenBox";
import { UserPack } from "./Inventory/UserPack";
import { Skills } from "./Skills";

interface Props {}
export const Windows: FC<Props> = ({}) => {
  return (
    <>
      <OpenBoxWindow />
      <UserPack />
      <Skills />
    </>
  );
};
