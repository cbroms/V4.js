import { TextBox } from "../TextBox";
import { RendererPayload } from "../RendererPayload";
declare type Point = {
    x: number;
    y: number;
};
export declare class TextBoxAnim {
    private _origin;
    private _destination;
    private _elapsed;
    private _duration;
    private _h;
    private _w;
    private _box;
    private _easingFunc;
    constructor(box: TextBox, origin: Point, destination: Point, duration?: number, easing?: string);
    move(state: RendererPayload, nextAnimation?: any): void;
}
export {};
