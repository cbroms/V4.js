import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";
declare type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
declare type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";
declare type Bounds = {
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
};
declare type DrawPos = {
    x: number;
    y: number;
};
/**
 * @exports V4.TextBox
 * @class
 */
export declare class TextBox {
    private _text;
    private _fontSize;
    private _animating;
    private _debug;
    private _drawExact;
    private _underline;
    private _drawPos;
    private _textStats;
    private _verticalAlign;
    private _horizontalAlign;
    font: Font;
    bounds: Bounds;
    /**
     * Create a new TextBox object
     * @param {Font} font - the font object
     * @param {number} x - the x coordinate of the text box's bottom left corner
     * @param {number} y - the y coordinate of the text box's bottom left corner
     * @param {number} h - the height, in pixels, of the text box
     * @param {number} w - the width, in pixels, of the text box
     * @returns {V4.TextBox} - the new TextBox object
     */
    constructor(font: Font, x: number, y: number, h: number, w: number);
    /**
     * Get/set the content of the text box
     * @param {string} newText - the text
     * @param {number} fontSize - the font size
     * @returns {string} - the text
     */
    text(newText: string, fontSize: number): string;
    /**
     * Get/set the vertical alignment of the text in the text box
     * @param {string} alignment - alignment command, must be BOTTOM, CENTER, or TOP
     * @returns {string} - the alignment
     */
    verticalAlign(alignment: VerticalAlignOpts): VerticalAlignOpts;
    /**
     * Get/set the horizontal alignment of the text in the text box
     * @param {string} alignment - alignment command, must be LEFT, CENTER, or RIGHT
     * @returns {string} - the alignment
     */
    horizontalAlign(alignment: HorizontalAlignOpts): HorizontalAlignOpts;
    /**
     * Explicitly specify where to draw text within the text box
     * @param {number} x - x coordinate to place text (bottom left corner)
     * @param {number} y - x coordinate to place text (bottom left corner)
     */
    exactTextPosition(x: number, y: number): void;
    /**
     * Set if the text box should be outlined
     * @param {bool} outline - outline the text box?
     * @returns {bool} - if the text box outline is activated
     */
    outlinePath(outline: boolean): boolean;
    /**
     * Set if the the text should be underlined
     * @param {bool} underline - underline the text in the text box?
     * @returns {bool} - if the underlines are active
     */
    underline(underline: boolean): boolean;
    /**
     * Calculate the x and y coordinates to start drawing the text
     * @returns {object} - the x and y coords, via result.x and result.y
     */
    _calculateTextRenderXY(): DrawPos;
    _calculateUnderlineRenderXY(): void;
    /**
     * The renderer function for this text box
     * @param {object} state - the state object
     */
    renderer(state: RendererPayload): void;
}
export {};
