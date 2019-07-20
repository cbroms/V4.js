import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";
export declare type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
export declare type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";
export interface IBounds {
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    y1: number;
    y2: number;
    y3: number;
    y4: number;
    w: number;
    h: number;
}
export interface IOptions {
    font: Font;
    fontSize: number;
    verticalAlign: VerticalAlignOpts;
    horizontalAlign: HorizontalAlignOpts;
    position: IDrawPos;
    bounds: IBounds;
    color: string;
    size: ISize;
    stroke: boolean;
    strokeWidth: number;
    strokeColor: string;
    lineHeight: number;
    backgroundColor: string;
    textBox: TextBox;
    wrap: boolean;
}
export interface IDrawPos {
    x: number;
    y: number;
}
export interface ISize {
    h: number;
    w: number;
}
/**
 * @exports V4.TextBox
 * @class
 */
export declare class TextBox {
    opts: IOptions;
    private _text;
    private _modified;
    private _debug;
    private _chunks;
    private _textStats;
    /**
     * Create a new TextBox object
     * @param opts - object containing options
     * @returns - the new TextBox object
     */
    constructor(opts?: IOptions);
    options(opts?: IOptions): IOptions;
    /**
     * Get/set the content of the text box
     * @param newText - the text
     * @param fontSize - the font size
     * @returns - the text
     */
    text(newText?: string): string;
    /**
     * Set if the text box should be outlined
     * @param outline - outline the text box?
     * @returns - if the text box outline is activated
     */
    outlinePath(outline?: boolean): boolean;
    /**
     * The renderer function for this text box
     * @param state - the state object
     */
    renderer(state: RendererPayload): void;
    /**
     * Calculate the text width, height, and offset from bottom
     */
    private _calcStats;
    /**
     * Create chunks of text such that each is less than the width of the
     * textbox plus the vertical margins
     */
    private _createChunks;
    /**
     * Calculate the x and y coordinates to start drawing the text
     * @returns - the x and y coords, via result.x and result.y
     */
    private _calculateTextRenderXY;
}
