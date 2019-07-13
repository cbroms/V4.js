// import { RendererPayload } from "../RendererPayload";
// import { TextBox } from "../TextBox";
// import { Easing } from "./Easing";

// interface IPoint {
//     x: number;
//     y: number;
// }

export class Animation {
    // private _origin: IPoint;
    // private _destination: IPoint;
    // private _elapsed: number;
    // private _duration: number;
    // private _h: number;
    // private _w: number;
    // private _box: TextBox;
    // private _easingFunc: (t: number, b: number, end: number, d: number) => number;

    constructor() {
        // box: TextBox, destination: IPoint, duration?: number, easing?: string) {
        // // const b = box.bounds();
        //  this._box = box;
        //  this._origin = { x: b.x1, y: b.y1 };
        //  this._destination = destination;
        //  this._elapsed = 0;
        //  this._duration = duration !== undefined ? duration : 1.5;
        //  this._easingFunc = easing !== undefined ? Easing[easing] : Easing.easeInQuad;
        //  this.renderer = this.renderer.bind(this);
        // // const bounds = box.bounds();
        // // this._h = bounds.h;
        // // this._w = bounds.w;
    }

    // public renderer(state: RendererPayload, nextAnimation?: any) {
    //     this._elapsed += state.deltaTime;

    //     if (this._elapsed < this._duration) {
    //         const xPos = this._easingFunc(
    //             this._elapsed,
    //             this._origin.x,
    //             this._destination.x,
    //             this._duration
    //         );
    //         const yPos = this._easingFunc(
    //             this._elapsed,
    //             this._origin.y,
    //             this._destination.y,
    //             this._duration
    //         );
    //       //  this._box.bounds(xPos, yPos, this._h, this._w);
    //     } else {
    //         if (nextAnimation !== undefined) {
    //             nextAnimation();
    //         }
    //         return false;
    //     }
    //     this._box.renderer(state);
    //     return true;
    // }
}
