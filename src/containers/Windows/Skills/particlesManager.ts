import { Application, SVGResource, BaseTexture, Texture } from "pixi.js-legacy";
import { Emitter } from "pixi-particles";

import spark from "./spark.svg";
import { buttonSize, getEmitterConfig, margin } from "./config";

export class ParticlesManager {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const { clientWidth, clientHeight } = canvas;

    this.app = new Application({
      view: canvas,
      width: clientWidth,
      height: clientHeight,
      resolution: window.devicePixelRatio || 1,

      antialias: false,
      autoDensity: true,
      backgroundAlpha: 0,
    });

    const svgRes = new SVGResource(spark, { width: 150, height: 150 });
    const texture = new Texture(new BaseTexture(svgRes));

    this.emitter = new Emitter(
      this.app.stage,
      texture,
      getEmitterConfig(clientWidth * 2, clientHeight * 2),
    );
    this.moveEmitter(0);
  }
  private canvas: HTMLCanvasElement;
  private app: Application;
  private emitter: Emitter;

  private moveEmitter(percent: number) {
    const { width, height } = this.app.screen;
    const lineSize = width - (buttonSize * 2 + margin * 2 + margin);
    const cX = buttonSize + margin + margin / 2 + lineSize * percent;
    const cY = height * 0.65;

    this.emitter.updateSpawnPos(cX, cY);
  }

  play = (percent: number) => {
    this.moveEmitter(percent);
  };

  destroy = () => {
    this.canvas.style.opacity = "0";
    this.emitter.destroy();
    this.app.destroy();
  };
}
