import { RendererPayload } from "./RendererPayload";
import { TextBox, IOptions } from "./TextBox";
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
