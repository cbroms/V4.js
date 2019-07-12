/**
 * Some easing functions, originally from Rober Penner, javascript implementation from
 * https://github.com/chenglou/tween-functions, typescript port unique to this lib
 */

// interface IEasingObject {
//     [key: string]: (t: number, b: number, end: number, d: number) => number;
// }

export declare const Easing: {
    [key: string]: (t: number, b: number, end: number, d: number) => number;
};
