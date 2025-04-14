import { GameScene } from "../modules";

export const createAlphaTween = (
  scene: GameScene,
  target: {
    alpha: number;
    setAlpha: (v: number) => any;
  },
  finalAlpha: number,
  onComplete?: () => void,
) => {
  const startAlpha = target.alpha

  const destroyTween = scene.tweens.add({
    targets: { alpha: startAlpha },
    alpha: finalAlpha,
    duration: 2500,
    onUpdate: (event) => {
      try {

        const current = event.targets[0] as { alpha: number };
        target.setAlpha(current.alpha);
      } catch {}
    },
    onComplete: () => {
      onComplete && onComplete();
    },
  });

  return destroyTween;
};
