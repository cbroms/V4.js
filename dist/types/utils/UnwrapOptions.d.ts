import { IOptions, TextBox } from "../TextBox";
import { Animation } from "../Animation";
interface IAnimState {
    duration: number;
    easingFunc: (t: number, b: number, end: number, d: number) => number;
    elapsed: number;
    ogOpts: IOptions;
    destOpts: IOptions;
}
export declare const unwrapOptions: (opts: IOptions, target: TextBox | Animation, animState?: IAnimState) => void;
export {};
