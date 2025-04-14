import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import css from "./style.module.css";

import { expConfig, playerConfig, skillsNames } from "managers/config";
import { interfaceManager } from "managers/InterfaceManager";
import { playerManager } from "managers/PlayerManager";
import { useEtheria } from "hooks/etheria";

import { Button, Etheria, Modal, Text } from "components";
import { Skills as SkillsTypes } from "type";
import { Icon } from "icons";

import { ParticlesManager } from "./particlesManager";
import { Level } from "./Level";

export const Skills: FC = () => {
  const { etheria, setEtheria } = useEtheria();
  const [currentSkill, setCurrentSkill] = useState<keyof SkillsTypes | null>(
    null,
  );
  const [currentSkillLevel, setCurrentSkillLevel] = useState(0);
  const ethRef = useRef(etheria);
  const skExp = useRef(
    currentSkill ? playerManager.getLevelUpValue(currentSkill) : null,
  );
  const lineDiv = useRef<HTMLDivElement>(null);
  const [particlesCanvas, setParticlesCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const particleManager = useRef<ParticlesManager | null>(null);

  useEffect(() => {
    const rmOpenListener = interfaceManager.listeners.openSkills((skill) =>
      setCurrentSkill(skill),
    );

    return () => {
      rmOpenListener();
    };
  }, []);

  useEffect(() => {
    if (!currentSkill) return;
    setCurrentSkillLevel(playerManager.skillLevels[currentSkill]);

    const rm = playerManager.listenChangeValue(currentSkill, (v) =>
      setCurrentSkillLevel(playerManager.skillLevels[currentSkill]),
    );

    return () => rm();
  }, [currentSkill]);
  useEffect(() => {
    if (!particlesCanvas) return;
    particleManager.current = new ParticlesManager(particlesCanvas);

    return () => {
      particleManager.current?.destroy();
      particleManager.current = null;
    };
  }, [particlesCanvas]);

  const updatePercentValue = (currentPercent: number) => {
    requestAnimationFrame(() => {
      if (lineDiv.current) {
        const width = lineDiv.current.offsetWidth || 0;
        const subLine = lineDiv.current.firstChild as HTMLDivElement | null;

        if (subLine)
          subLine.style.width = `${width * (currentPercent / 100)}px`;
      }

      particleManager.current?.play(currentPercent / 100);
    });
  };

  useEffect(() => {
    if (!currentSkill) return;

    const sk = playerManager.getLevelUpValue(currentSkill);
    skExp.current = sk;
    updatePercentValue(sk.currentPercent);
  }, [currentSkill, currentSkillLevel, particlesCanvas]);

  useEffect(() => {
    ethRef.current = etheria;
  }, [etheria]);

  const isPressed = useRef(false);

  const levelUp = () => {
    if (!isPressed.current || !currentSkill) return;

    if (skExp.current) {
      const { _100Percent, _1PercentExpValue, currentExp, currentPercent } =
        skExp.current;

      const _1PercentPrice = expConfig.priceVolume * (currentSkillLevel + 1);
      const newBalance = (ethRef.current -= _1PercentPrice);

      if (currentExp >= _100Percent) {
        playerManager.levelUp(currentSkill);
        return;
      }

      if (newBalance >= 0) {
        setEtheria(newBalance);
        const newPercent = currentPercent + 1;
        updatePercentValue(newPercent);
        skExp.current = {
          _100Percent,
          _1PercentExpValue,
          currentExp: _1PercentExpValue * newPercent,
          currentPercent: newPercent,
        };

        playerManager.skillExp[currentSkill] = skExp.current.currentExp;
      }
    }

    requestAnimationFrame(levelUp);
  };

  const pressDown = () => {
    isPressed.current = true;
    levelUp();
  };
  const pressUp = () => {
    isPressed.current = false;
  };

  const isMaxLevel = currentSkill
    ? currentSkillLevel >= playerConfig.skillsMaximumLevel[currentSkill]
    : false;

  useEffect(() => {
    if (isMaxLevel) {
      particleManager.current?.destroy();
      particleManager.current = null;
    }
  }, [isMaxLevel]);

  return currentSkill ? (
    <Modal
      isOpen={!!currentSkill}
      onClose={() => setCurrentSkill(null)}
      className={css.modal}>
      <div className={css.root}>
        <Text className={css.title} type="title">
          {skillsNames[currentSkill]}
        </Text>

        <div className={css.contentWrapper}>
          <canvas
            className={css.particles}
            style={{ opacity: isMaxLevel ? 0 : 1 }}
            ref={setParticlesCanvas}
          />
          <div className={css.top}>
            <div />
            <Etheria value={etheria} />
          </div>

          {isMaxLevel ? (
            <div className={css.levelSection}>
              <Text className={clsx(css.title, css.maxLevelNote)} type="title">
                Досягнуто максимальний рівень навички
              </Text>
            </div>
          ) : (
            <div className={css.levelSection}>
              <Level className={css.button} value={currentSkillLevel} />

              <div className={css.line} ref={lineDiv}>
                <div className={css.subLine} />
              </div>

              <button
                className={clsx(css.button, css.addButton)}
                onPointerDown={pressDown}
                onPointerUp={pressUp}>
                <Icon type="add" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  ) : null;
};
