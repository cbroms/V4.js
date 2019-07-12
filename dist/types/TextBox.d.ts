import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";
declare type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
declare type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";
interface IBounds {
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
/**
 * @exports V4.TextBox
 * @class
 */
export declare class TextBox {
    font: Font;
    private _text;
    private _fontSize;
    private _modified;
    private _debug;
    private _underline;
    private _chunks;
    private _textStats;
    private _verticalAlign;
    private _horizontalAlign;
    private _bounds;
    /**
     * Create a new TextBox object
     * @param font - the font object
     * @param x - the x coordinate of the text box's bottom left corner
     * @param y - the y coordinate of the text box's bottom left corner
     * @param h - the height, in pixels, of the text box
     * @param w - the width, in pixels, of the text box
     * @param bounds - specific bounds for the function (includes points defined with (x1,y1) - (x4,y4) and h and w)
     * @returns - the new TextBox object
     */
    constructor(font: Font, x?: number | IBounds, y?: number, h?: number, w?: number);
    /**
     * Get/set the textbox's boundaries
     * @param x - the x coordinate of the text box's bottom left corner, or an object containing specific bounds for the textbox
     * @param y - the y coordinate of the text box's bottom left corner
     * @param h - the height, in pixels, of the text box
     * @param w - the width, in pixels, of the text box
     * @returns - an object containing the boundary points of the textbox
     */
    bounds(x?: number | IBounds, y?: number, h?: number, w?: number): IBounds;
    /**
     * Get/set the content of the text box
     * @param newText - the text
     * @param fontSize - the font size
     * @returns - the text
     */
    text(newText?: string, fontSize?: number): string;
    /**
     * Get/set the vertical alignment of the text in the text box
     * @param alignment - alignment command, must be BOTTOM, CENTER, or TOP
     * @returns - the alignment
     */
    verticalAlign(alignment?: VerticalAlignOpts): VerticalAlignOpts;
    /**
     * Get/set the horizontal alignment of the text in the text box
     * @param alignment - alignment command, must be LEFT, CENTER, or RIGHT
     * @returns - the alignment
     */
    horizontalAlign(alignment?: HorizontalAlignOpts): HorizontalAlignOpts;
    /**
     * Set if the text box should be outlined
     * @param outline - outline the text box?
     * @returns - if the text box outline is activated
     */
    outlinePath(outline?: boolean): boolean;
    /**
     * Set if the the text should be underlined
     * @param underline - underline the text in the text box?
     * @returns - if the underlines are active
     */
    underline(underline?: boolean): boolean;
    /**
     * The renderer function for this text box
     * @param state - the state object
     */
    renderer(state: RendererPayload): void;
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
export {};
