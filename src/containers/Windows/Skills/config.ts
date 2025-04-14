import { EmitterConfig, OldEmitterConfig } from "pixi-particles";

const emitterConfig: EmitterConfig | OldEmitterConfig = {
  frequency: 0.001,
  lifetime: { min: 0.5, max: 2 },
  pos: { x: 0, y: 0 },
  autoUpdate: true,
  emitterLifetime: -1,

  alpha: {
    start: 1,
    end: 0,
  },
  scale: {
    start: 0.05,
    end: 0.1,
  },
  speed: {
    start: 5,
    end: 30,
  },
  startRotation: {
    min: 0,
    max: 360,
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 200,
  },

  maxParticles: 300,
  spawnType: "point",
};

export const getEmitterConfig = (x: number, y: number) => ({
  ...emitterConfig,
  pos: { x, y },
});

export const buttonSize = 85;
export const margin = 20;

export const runSpeedLevel = 5