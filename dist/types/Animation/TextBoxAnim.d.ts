import { RendererPayload } from "../RendererPayload";
import { TextBox } from "../TextBox";
interface IPoint {
    x: number;
    y: number;
}
export declare class TextBoxAnim {
    private _origin;
    private _destination;
    private _elapsed;
    private _duration;
    private _h;
    private _w;
    private _box;
    private _easingFunc;
    constructor(box: TextBox, destination: IPoint, duration?: number, easing?: string);
    renderer(state: RendererPayload, nextAnimation?: any): boolean;
}
export {};
