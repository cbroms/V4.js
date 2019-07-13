import { RendererPayload } from "./RendererPayload";
import { TextBox, IOptions } from "./TextBox";
import { Easing } from "./utils/Easing";
import { unwrapOptions } from "./utils/UnwrapOptions";

export class Animation {
    public opts: IOptions;
    private _ogOpts: IOptions;
    private _destOpts: IOptions;
    private _elapsed: number;
    private _duration: number;
    private _box: TextBox;
    private _easingFunc: (t: number, b: number, end: number, d: number) => number;

    constructor(box: TextBox, opts: IOptions, duration?: number, easing?: string) {
        if (box instanceof TextBox) {
            this._box = box;
            this._ogOpts = box.opts;
            this.opts = box.opts;
            this._destOpts = opts;

            this._duration = duration !== undefined ? duration : 1.5;
            this._easingFunc = easing !== undefined ? Easing[easing] : Easing.easeInQuad;
            // unwrapOptions(opts, this);
        } else {
            Error("Animation requires a TextBox");
        }
        this._elapsed = 0;
        this.renderer = this.renderer.bind(this);
    }

    public renderer(state: RendererPayload) {
        this._elapsed += state.deltaTime;

        if (this._elapsed < this._duration) {
            const animationState = {
                duration: this._duration,
                easingFunc: this._easingFunc,
                elapsed: this._elapsed,
                ogOpts: this._ogOpts,
                destOpts: this._destOpts
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
