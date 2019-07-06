import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";

type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";

type TextStats = {
    textWidth: number;
    textHeight: number;
    textOffsetBottom: number;
};

type Bounds = {
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

type DrawPos = {
    x: number;
    y: number;
};
/**
 * @exports V4.TextBox
 * @class
 */
export class TextBox {
    private _text: string;
    private _fontSize: number;
    private _animating: boolean;
    private _debug: boolean;
    private _drawExact: boolean;
    private _underline: boolean;
    private _drawPos: DrawPos;
    private _textStats: TextStats;
    private _verticalAlign: VerticalAlignOpts;
    private _horizontalAlign: HorizontalAlignOpts;

    public font: Font;
    public bounds: Bounds;

    /**
     * Create a new TextBox object
     * @param {Font} font - the font object
     * @param {number} x - the x coordinate of the text box's bottom left corner
     * @param {number} y - the y coordinate of the text box's bottom left corner
     * @param {number} h - the height, in pixels, of the text box
     * @param {number} w - the width, in pixels, of the text box
     * @returns {V4.TextBox} - the new TextBox object
     */
    constructor(font: Font, x: number, y: number, h: number, w: number) {
        this.font = font;
        this._text = "";
        this._fontSize = 24;

        // Corner points are assigned clockwise from bottom left:
        /*
         *   (x2, y2) *--------------* (x3, y3)
         *            |              |
         *            |              |
         *   (x1, y1) *______________* (x4, y4)
         */
        this.bounds = {
            x1: x,
            y1: y,
            x2: x,
            y2: y - h,
            x3: x + w,
            y3: y - h,
            x4: x + w,
            y4: y,
            w: w,
            h: h
        };

        // set defaut properties
        this._verticalAlign = "BOTTOM";
        this._horizontalAlign = "RIGHT";
        this._animating = false;
        this._debug = false;
        this._drawExact = false;
        this._underline = false;
        this._drawPos = { x: 0, y: 0 };
        this._textStats = { textWidth: 0, textHeight: 0, textOffsetBottom: 0 };
        this.renderer = this.renderer.bind(this);
    }

    /**
     * Get/set the content of the text box
     * @param {string} newText - the text
     * @param {number} fontSize - the font size
     * @returns {string} - the text
     */
    text(newText: string, fontSize: number): string {
        if (newText) this._text = newText;
        if (fontSize) this._fontSize = fontSize;

        const absPath = this.font.getPath(this._text, 0, 0, this._fontSize);
        const bb = absPath.getBoundingBox();

        this._textStats.textHeight = bb.y2 - bb.y1;
        this._textStats.textOffsetBottom = bb.y2;
        this._textStats.textWidth = this.font.getAdvanceWidth(
            newText,
            fontSize
        );
        this._drawPos = this._calculateTextRenderXY();

        return this._text;
    }

    /**
     * Get/set the vertical alignment of the text in the text box
     * @param {string} alignment - alignment command, must be BOTTOM, CENTER, or TOP
     * @returns {string} - the alignment
     */
    verticalAlign(alignment: VerticalAlignOpts): VerticalAlignOpts {
        if (alignment) {
            this._verticalAlign = alignment;
            this._drawPos = this._calculateTextRenderXY();
        }
        return this._verticalAlign;
    }

    /**
     * Get/set the horizontal alignment of the text in the text box
     * @param {string} alignment - alignment command, must be LEFT, CENTER, or RIGHT
     * @returns {string} - the alignment
     */
    horizontalAlign(alignment: HorizontalAlignOpts): HorizontalAlignOpts {
        if (alignment) {
            this._horizontalAlign = alignment;
            this._drawPos = this._calculateTextRenderXY();
        }
        return this._horizontalAlign;
    }

    /**
     * Explicitly specify where to draw text within the text box
     * @param {number} x - x coordinate to place text (bottom left corner)
     * @param {number} y - x coordinate to place text (bottom left corner)
     */
    exactTextPosition(x: number, y: number): void {
        this._drawPos = { x: x, y: y };
        this._drawExact = true;
    }

    /**
     * Set if the text box should be outlined
     * @param {bool} outline - outline the text box?
     * @returns {bool} - if the text box outline is activated
     */
    outlinePath(outline: boolean): boolean {
        if (outline !== null) this._debug = outline;
        return this._debug;
    }

    /**
     * Set if the the text should be underlined
     * @param {bool} underline - underline the text in the text box?
     * @returns {bool} - if the underlines are active
     */
    underline(underline: boolean): boolean {
        if (underline !== null) this._underline = underline;
        return this._underline;
    }

    /**
     * Calculate the x and y coordinates to start drawing the text
     * @returns {object} - the x and y coords, via result.x and result.y
     */
    _calculateTextRenderXY(): DrawPos {
        let x: number;
        let y: number;

        // user gave a position, use it
        if (this._drawExact) {
            return this._drawPos;
        } else {
            // user has not specified a position, calculate based on alignment
            // calc y
            if (this._verticalAlign === "BOTTOM") {
                y = this.bounds.y1 - this._textStats.textOffsetBottom;
            } else if (this._verticalAlign === "CENTER") {
                y =
                    this.bounds.y1 -
                    this.bounds.h / 2 +
                    this._textStats.textHeight / 2 -
                    this._textStats.textOffsetBottom;
            } else if (this._verticalAlign === "TOP") {
                y =
                    this.bounds.y2 +
                    (this._textStats.textHeight -
                        this._textStats.textOffsetBottom);
            }
            // calc x
            if (this._horizontalAlign === "LEFT") {
                x = this.bounds.x1;
            } else if (this._horizontalAlign === "CENTER") {
                x =
                    this.bounds.x1 +
                    this.bounds.w / 2 -
                    this._textStats.textWidth / 2;
            } else if (this._horizontalAlign === "RIGHT") {
                x =
                    this.bounds.x1 +
                    (this.bounds.w - this._textStats.textWidth);
            }
        }

        return { x: x, y: y };
    }

    _calculateUnderlineRenderXY() {}

    /**
     * The renderer function for this text box
     * @param {object} state - the state object
     */
    renderer(state: RendererPayload) {
        const ctx = state.context;

        ctx.save();

        //create clipping mask
        ctx.beginPath();
        ctx.moveTo(this.bounds.x1, this.bounds.y1);
        ctx.lineTo(this.bounds.x2, this.bounds.y2);
        ctx.lineTo(this.bounds.x4, this.bounds.y4);
        ctx.moveTo(this.bounds.x3, this.bounds.y3);
        ctx.lineTo(this.bounds.x4, this.bounds.y4);
        ctx.lineTo(this.bounds.x2, this.bounds.y2);
        ctx.closePath();
        ctx.clip();

        if (this._debug) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.bounds.x1, this.bounds.y1);
            ctx.lineTo(this.bounds.x2, this.bounds.y2);
            ctx.moveTo(this.bounds.x2, this.bounds.y2);
            ctx.lineTo(this.bounds.x3, this.bounds.y3);
            ctx.moveTo(this.bounds.x3, this.bounds.y3);
            ctx.lineTo(this.bounds.x4, this.bounds.y4);
            ctx.moveTo(this.bounds.x4, this.bounds.y4);
            ctx.lineTo(this.bounds.x1, this.bounds.y1);
            ctx.closePath();
            ctx.stroke();
        }

        const drawPos = this._animating
            ? this._calculateTextRenderXY()
            : this._drawPos;

        // render font
        const absPath = this.font.getPath(
            this._text,
            drawPos.x,
            drawPos.y,
            this._fontSize
        );

        const drawPath = new Path2D(absPath.toPathData(2));

        ctx.fillStyle = "white";
        ctx.fill(drawPath);

        ctx.restore();
    }
}
