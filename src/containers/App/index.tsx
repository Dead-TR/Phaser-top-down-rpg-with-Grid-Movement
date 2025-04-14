import css from "./style.module.css";

import { Game } from "../../game";
import { Windows } from "containers/Windows";
import { HUD } from "interface";

function App() {
  return (
    <>
      {/* <HUD /> */}
      <div className={css.root}>
        <Game />
      </div>
      <Windows />
    </>
  );
}

export default App;
