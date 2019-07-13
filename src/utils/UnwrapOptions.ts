import {
  IOptions,
  IBounds,
  HorizontalAlignOpts,
  VerticalAlignOpts,
  TextBox,
} from "../TextBox";

import { Animation } from "../Animation";

interface IAnimState {
  duration: number;
  easingFunc: (t: number, b: number, end: number, d: number) => number;
  elapsed: number;
  ogOpts: IOptions;
  destOpts: IOptions;
}

export const unwrapOptions = (
  opts: IOptions,
  target: TextBox | Animation,
  animState?: IAnimState,
) => {
  const anim = animState !== undefined;
  for (const opt in opts) {
    if (opts.hasOwnProperty(opt)) {
      switch (opt) {
        case "font":
          target.opts.font = opts[opt];
          break;
        case "fontSize":
          target.opts.fontSize = anim
            ? animState.easingFunc(
                animState.elapsed,
                animState.ogOpts[opt],
                animState.destOpts[opt],
                animState.duration,
              )
            : opts[opt];
          break;
        case "horizontalAlign":
          target.opts.horizontalAlign = opts[opt] as HorizontalAlignOpts;
          break;
        case "verticalAlign":
          target.opts.verticalAlign = opts[opt] as VerticalAlignOpts;
          break;
        case "position":
          const b = opts[opt];
          target.opts.position = opts[opt];
          target.opts.bounds = {
            h: target.opts.bounds.h,
            w: target.opts.bounds.w,
            x1: b.x,
            x2: b.x,
            x3: b.x + target.opts.bounds.w,
            x4: b.x + target.opts.bounds.w,
            y1: b.y,
            y2: b.y - target.opts.bounds.h,
            y3: b.y - target.opts.bounds.h,
            y4: b.y,
          };
          break;
        case "bounds":
          target.opts.bounds = opts[opt] as IBounds;
          target.opts.position.x = opts[opt].x1;
          target.opts.position.y = opts[opt].y1;
          break;
        case "color":
          target.opts.color = opts[opt] as string;
          break;
        case "backgroundColor":
          target.opts.backgroundColor = opts[opt] as string;
          break;
      }
    }
  }
};
