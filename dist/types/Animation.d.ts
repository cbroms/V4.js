import { RendererPayload } from "./RendererPayload";
import { IOptions, TextBox } from "./TextBox";
export interface IAnimState {
    backgroundColorLerp: (a: number) => string;
    colorLerp: (a: number) => string;
    duration: number;
    easingFunc: (t: number, b: number, end: number, d: number) => number;
    elapsed: number;
    ogOpts: IOptions;
    destOpts: IOptions;
}
export declare class Animation {
    opts: IOptions;
    private _ogOpts;
    private _destOpts;
    private _elapsed;
    private _duration;
    private _box;
    private _easingFunc;
    constructor(box: TextBox, opts: IOptions, duration?: number, easing?: string);
    renderer(state: RendererPayload): boolean;
}
