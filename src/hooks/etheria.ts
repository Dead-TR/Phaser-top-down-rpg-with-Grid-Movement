import { useEffect, useState } from "react";

import { inventoryManager } from "managers/InventoryManager";

export const useEtheria = () => {
  const [etheriaAmt, setEtheriaAmt] = useState(inventoryManager.etheria);

  useEffect(() => {
    const rmEth = inventoryManager.listener("etheria", (v) => setEtheriaAmt(v));

    return () => rmEth();
  }, []);

  const addEtheria = (v: number) => inventoryManager.setEtheria(v, 'add');
  const setEtheria = (v: number) => inventoryManager.setEtheria(v, 'set');

  return { etheria: etheriaAmt, addEtheria, setEtheria };
};
