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
          // Interpolating between font paths doesn't work very well with both flubber and polymorph
          // if this gets implemented, it will require writing a custom SVG interpolation system

          // if (anim && animState.destOpts[opt] !== undefined) {
          //   const size = target.opts.textBox.opts.fontSize;

          //   const alpha = animState.easingFunc(
          //     animState.elapsed,
          //     0,
          //     1,
          //     animState.duration,
          //   );
          //   target.opts.paths = [];

          //   for (const chunk of target.opts.textBox.chunks()) {
          //     const fontInterp = flubber.default.interpolate(
          //       animState.ogOpts[opt]
          //         .getPath(chunk.text, chunk.pos.x, chunk.pos.y, size)
          //         .toPathData(2),
          //       animState.destOpts[opt]
          //         .getPath(chunk.text, chunk.pos.x, chunk.pos.y, size)
          //         .toPathData(2),
          //     );
          //     const path = fontInterp(alpha);
          //     // override TextBox's drawing of the font with a custom path

          //     target.opts.paths.push(path);
          //   }
          //   // since the TextBox requires a font to position the text, set the closest font variant
          //   if (alpha < 0.5) target.opts.font = animState.ogOpts[opt];
          //   else target.opts.font = animState.destOpts[opt];
          // } else target.opts.font = opts[opt];
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

        // interpolate h and w
        case "size":
          const h =
            anim && animState.destOpts[opt] !== undefined
              ? animState.easingFunc(
                  animState.elapsed,
                  animState.ogOpts[opt].h,
                  animState.destOpts[opt].h,
                  animState.duration,
                )
              : opts[opt].h;

          const w =
            anim && animState.destOpts[opt] !== undefined
              ? animState.easingFunc(
                  animState.elapsed,
                  animState.ogOpts[opt].w,
                  animState.destOpts[opt].w,
                  animState.duration,
                )
              : opts[opt].w;

          target.opts.size = { h, w };
          target.opts.bounds.h = h;
          target.opts.bounds.w = w;
          target.opts.bounds.x3 = target.opts.position.x + w;
          target.opts.bounds.x4 = target.opts.position.x + w;
          target.opts.bounds.y2 = target.opts.position.y - h;
          target.opts.bounds.y3 = target.opts.position.y - h;
          break;

        // interpolate x and y
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
            h: target.opts.size.h,
            w: target.opts.size.w,
            x1: x,
            x2: x,
            x3: x + target.opts.size.w,
            x4: x + target.opts.size.w,
            y1: y,
            y2: y - target.opts.size.h,
            y3: y - target.opts.size.h,
            y4: y,
          };
          break;

        case "bounds":
          if (anim && animState.destOpts[opt] !== undefined) {
            const ease = animState.easingFunc;
            const el = animState.elapsed;
            const ogB = animState.ogOpts[opt];
            const destB = animState.destOpts[opt];
            const dur = animState.duration;

            target.opts.bounds.x1 = ease(el, ogB.x1, destB.x1, dur);
            target.opts.bounds.x2 = ease(el, ogB.x2, destB.x2, dur);
            target.opts.bounds.x3 = ease(el, ogB.x3, destB.x3, dur);
            target.opts.bounds.x4 = ease(el, ogB.x4, destB.x4, dur);
            target.opts.bounds.y1 = ease(el, ogB.y1, destB.y1, dur);
            target.opts.bounds.y2 = ease(el, ogB.y2, destB.y2, dur);
            target.opts.bounds.y3 = ease(el, ogB.y3, destB.y3, dur);
            target.opts.bounds.y4 = ease(el, ogB.y4, destB.y4, dur);

            target.opts.position.x = target.opts.bounds.x1;
            target.opts.position.y = target.opts.bounds.y1;
            target.opts.size.h = ease(el, ogB.h, destB.h, dur);
            target.opts.size.w = ease(el, ogB.w, destB.w, dur);
          } else {
            target.opts.bounds = opts[opt] as IBounds;
            target.opts.size.h = opts[opt].h;
            target.opts.size.w = opts[opt].w;
            target.opts.position.x = opts[opt].x1;
            target.opts.position.y = opts[opt].y1;
          }
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
