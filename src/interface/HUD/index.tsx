import React, { FC, useEffect, useState } from "react";

import { Skills } from "type";

import { playerConfig } from "managers/config";
import { playerManager } from "managers/PlayerManager";
import { interfaceManager } from "managers/InterfaceManager";

import { PackButton } from "./components";
import css from "./style.module.css";

import arrow from "_assets/skills/arrow_attack.png";
import ice from "_assets/skills/ice_attack.png";
import { combatManager } from "managers/CombatManager";

const getSkillValues = () => {
  return Object.keys(playerManager.skillLevels).reduce((acm, skill) => {
    acm[skill as keyof Skills] = playerManager.getSkillValue(
      skill as keyof Skills,
    );
    return acm;
  }, {} as Skills);
};

export const HUD: FC = () => {
  const [skills, setSkills] = useState(() => getSkillValues());
  const [distanceCombatType, setDistanceCombatType] = useState(
    () => combatManager.distanceCombatType,
  );

  useEffect(() => {
    const rmPerksListener = playerManager.listenAllSkills(() =>
      setSkills(getSkillValues()),
    );

    const rmCombatListener = combatManager.listeners.distanceCombatType(
      (type) => {
        setDistanceCombatType(type);
      },
    );

    return () => {
      rmPerksListener();
      rmCombatListener();
    };
  }, []);

  return (
    <div className={css.hud}>
      <div className={css.top}>
        <PackButton />

        {Object.keys(playerConfig.skillsMultiplier).map((key) => (
          <button
            style={{
              pointerEvents: "all",
              padding: 5,
              background: "greenyellow",
              margin: 2,
              opacity: 0.75,
            }}
            onClick={() => {
              interfaceManager.setters.openSkills(key as any);
            }}>
            {key}
          </button>
        ))}
      </div>
      <div className={css.bottom}>
        <div>
          <div>attackCoolDown: {skills.attackCoolDown}</div>
          <div>bow: {skills.bow}</div>
          <div>health: {skills.health}</div>
          <div>lockBreaking: {skills.lockBreaking}</div>
          <div>magic: {skills.magic}</div>
          <div>meleeWeapon: {skills.meleeWeapon}</div>
          <div>move: {skills.move}</div>
          <div>parry: {skills.parry}</div>
        </div>

        <div>
          <button className={css.skills} 
          style={{opacity: distanceCombatType === 'bow'  ? 1 : 0.5}}
          >
            <img
              src={arrow}
              alt="arrow"
              onClick={() => {
                const isRotate = combatManager.distanceCombatType === "bow";
                combatManager.setters.distanceCombatType(
                  isRotate ? null : "bow",
                );
              }}
            />
          </button>

          <button
          style={{opacity: distanceCombatType === 'ice'  ? 1 : 0.5}}
            className={css.skills}
            onClick={() => {
              const isRotate = combatManager.distanceCombatType === "ice";
              combatManager.setters.distanceCombatType(isRotate ? null : "ice");
            }}>
            <img src={ice} alt="ice" />
          </button>
        </div>
      </div>
    </div>
  );
};
