import interpolate from "color-interpolate";

import { RendererPayload } from "./RendererPayload";
import { IOptions, TextBox } from "./TextBox";
import { Easing } from "./utils/Easing";
import { unwrapOptions } from "./utils/UnwrapOptions";

export interface IAnimState {
  backgroundColorLerp: (a: number) => string;
  colorLerp: (a: number) => string;
  duration: number;
  easingFunc: (t: number, b: number, end: number, d: number) => number;
  elapsed: number;
  ogOpts: IOptions;
  destOpts: IOptions;
}

export class Animation {
  public opts: IOptions;
  private _ogOpts: IOptions;
  private _destOpts: IOptions;
  private _elapsed: number;
  private _duration: number;
  private _box: TextBox;
  private _easingFunc: (t: number, b: number, end: number, d: number) => number;
  private _backgroundColorLerp: (a?: number) => string;
  private _colorLerp: (a?: number) => string;

  constructor(
    box: TextBox,
    opts: IOptions,
    duration?: number,
    easing?: string,
  ) {
    if (box instanceof TextBox) {
      this._box = box;
      this._ogOpts = Object.assign({}, box.opts);
      this.opts = box.opts;
      this._destOpts = opts;

      this._duration = duration !== undefined ? duration : 1.5;
      this._easingFunc =
        easing !== undefined ? Easing[easing] : Easing.easeInQuad;
      // create background color and text color lerp functions
      this._backgroundColorLerp =
        this._destOpts.backgroundColor !== undefined
          ? interpolate([
              this._ogOpts.backgroundColor,
              this._destOpts.backgroundColor,
            ])
          : () => "";
      this._colorLerp =
        this._destOpts.color !== undefined
          ? interpolate([this._ogOpts.color, this._destOpts.color])
          : () => "";
    } else {
      Error("Animation requires a TextBox");
    }
    this._elapsed = 0;
    this.renderer = this.renderer.bind(this);
  }

  public renderer(state: RendererPayload) {
    this._elapsed += state.deltaTime;
    // console.log(this._duration);

    if (this._elapsed < this._duration) {
      const animationState = {
        backgroundColorLerp: this._backgroundColorLerp,
        colorLerp: this._colorLerp,
        destOpts: this._destOpts,
        duration: this._duration,
        easingFunc: this._easingFunc,
        elapsed: this._elapsed,
        ogOpts: this._ogOpts,
      };
      // update this.opts to reflect new positions
      unwrapOptions(this.opts, this, animationState);
      // set textbox with new options and render
      this._box.options(this.opts);
      this._box.renderer(state);
    } else {
      this._box.renderer(state);
      return false;
    }
    return true;
  }
}
