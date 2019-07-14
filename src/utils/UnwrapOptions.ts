import {
  HorizontalAlignOpts,
  IBounds,
  IOptions,
  TextBox,
  VerticalAlignOpts,
} from "../TextBox";

import { Animation, IAnimState } from "../Animation";

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

        // For font size, we can just interpolate between two numbers using the easing function
        case "fontSize":
          target.opts.fontSize =
            anim && animState.destOpts[opt] !== undefined
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

        // For position we interpolate both the x and y and contruct a new bounds object using resulting values
        case "position":
          const x =
            anim && animState.destOpts[opt] !== undefined
              ? animState.easingFunc(
                  animState.elapsed,
                  animState.ogOpts[opt].x,
                  animState.destOpts[opt].x,
                  animState.duration,
                )
              : opts[opt].x;

          const y =
            anim && animState.destOpts[opt] !== undefined
              ? animState.easingFunc(
                  animState.elapsed,
                  animState.ogOpts[opt].y,
                  animState.destOpts[opt].y,
                  animState.duration,
                )
              : opts[opt].y;

          target.opts.position = { x, y };
          target.opts.bounds = {
            h: target.opts.bounds.h,
            w: target.opts.bounds.w,
            x1: x,
            x2: x,
            x3: x + target.opts.bounds.w,
            x4: x + target.opts.bounds.w,
            y1: y,
            y2: y - target.opts.bounds.h,
            y3: y - target.opts.bounds.h,
            y4: y,
          };
          break;
        case "bounds":
          target.opts.bounds = opts[opt] as IBounds;
          target.opts.position.x = opts[opt].x1;
          target.opts.position.y = opts[opt].y1;
          break;

        // interpolate the colors with an alpha from the easing function
        case "color":
          target.opts.color = opts[opt] as string;

          if (anim && animState.destOpts[opt] !== undefined) {
            const alpha = animState.easingFunc(
              animState.elapsed,
              0,
              1,
              animState.duration,
            );
            const col = animState.colorLerp(alpha);
            target.opts.color = col;
          }

          break;

        // same process as above
        case "backgroundColor":
          target.opts.backgroundColor = opts[opt] as string;

          if (anim && animState.destOpts[opt] !== undefined) {
            const alpha = animState.easingFunc(
              animState.elapsed,
              0,
              1,
              animState.duration,
            );
            const col = animState.backgroundColorLerp(alpha);
            target.opts.backgroundColor = col;
          }
          break;
      }
    }
  }
};
