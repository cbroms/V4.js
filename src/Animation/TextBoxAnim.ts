import { Easing } from "./Easing";
import { TextBox } from "../TextBox";
import { RendererPayload } from "../RendererPayload";

type Point = {
    x: number;
    y: number;
};

export class TextBoxAnim {
    private _origin: Point;
    private _destination: Point;
    private _elapsed: number;
    private _duration: number;
    private _h: number;
    private _w: number;
    private _box: TextBox;
    private _easingFunc: { (t: number, b: number, end: number, d: number): number };

    constructor(
        box: TextBox,
        origin: Point,
        destination: Point,
        duration?: number,
        easing?: string
    ) {
        this._box = box;
        this._origin = origin;
        this._destination = destination;
        this._elapsed = 0;
        this._duration = duration !== undefined ? duration : 1.5;
        this._easingFunc = easing !== undefined ? Easing[easing] : Easing["easeInQuad"];

        const bounds = box.bounds();
        this._h = bounds.h;
        this._w = bounds.w;
    }

    move(state: RendererPayload) {
        this._elapsed += state.deltaTime;

        if (this._elapsed < this._duration) {
            const xPos = this._easingFunc(
                this._elapsed,
                this._origin.x,
                this._destination.x,
                this._duration
            );
            const yPos = this._easingFunc(
                this._elapsed,
                this._origin.y,
                this._destination.y,
                this._duration
            );
            this._box.bounds(xPos, yPos, this._h, this._w);
        }
    }
}
