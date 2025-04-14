import { useEffect, useRef, useState } from "react";

import { renderGame } from "./instance";
import css from "./style.module.css";

export const Game = () => {
  const [refBox, setRefBox] = useState<HTMLDivElement | null>(null);
  const Game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    let currentGame: Phaser.Game | null = null;
    if (refBox) {
      setTimeout(() => {
        if (Game.current) Game.current.destroy(true, false);

        currentGame = renderGame(refBox.offsetWidth);
        Game.current = currentGame;
      }, 0);
    }

    return () => {
      currentGame?.destroy(true, false);
    };
  }, [refBox]);

  return (
    <div className={css.root}>
      <div className={css.game} id="game-box" ref={setRefBox} />
    </div>
  );
};
