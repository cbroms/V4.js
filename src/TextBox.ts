import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";
import { unwrapOptions } from "./utils/UnwrapOptions";

export type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
export type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";

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
    stroke: boolean;
    strokeWidth: number;
    strokeColor: string;
    lineHeight: number;
    backgroundColor: string;
}

export interface IDrawPos {
    x: number;
    y: number;
}

interface ITextStats {
    textWidth: number;
    textHeight: number;
    totalTextHeight: number;
    textOffsetBottom: number;
}

interface IChunk {
    text: string;
    pos: IDrawPos;
    num: number;
    width: number;
}

/**
 * @exports V4.TextBox
 * @class
 */
export class TextBox {
    public opts: IOptions;
    private _text: string;
    private _modified: boolean;
    private _debug: boolean;
    private _chunks: IChunk[] | null;
    private _textStats: ITextStats;

    /**
     * Create a new TextBox object
     * @param opts - object containing options
     * @returns - the new TextBox object
     */
    constructor(opts?: IOptions) {
        const bounds = {
            h: 0,
            w: 0,
            x1: 0,
            x2: 0,
            x3: 0,
            x4: 0,
            y1: 0,
            y2: 0,
            y3: 0,
            y4: 0
        };
        // set defaults
        this.opts = {
            backgroundColor: "red",
            bounds,
            color: "white",
            font: null,
            fontSize: 24,
            horizontalAlign: "RIGHT",
            lineHeight: 8,
            position: { x: 0, y: 0 },
            stroke: false,
            strokeColor: "white",
            strokeWidth: 0,
            verticalAlign: "BOTTOM"
        };

        this._modified = true;

        this._text = "";
        this._debug = false;
        this._chunks = null;
        this._textStats = {
            textHeight: 0,
            textOffsetBottom: this.opts.lineHeight,
            textWidth: 0,
            totalTextHeight: 0
        };
        this.renderer = this.renderer.bind(this);

        // if given options, set them
        if (opts !== undefined) {
            unwrapOptions(opts, this);
            this._modified = true;
        }
    }

    public options(opts?: IOptions) {
        if (opts !== undefined) {
            unwrapOptions(opts, this);
            this._modified = true;
        }
        return this.opts;
    }

    // /**
    //  * Get/set the textbox's boundaries
    //  * @param x - the x coordinate of the text box's bottom left corner, or an object containing specific bounds for the textbox
    //  * @param y - the y coordinate of the text box's bottom left corner
    //  * @param h - the height, in pixels, of the text box
    //  * @param w - the width, in pixels, of the text box
    //  * @returns - an object containing the boundary points of the textbox
    //  */
    // public bounds(x?: number | IBounds, y?: number, h?: number, w?: number): IBounds {
    //     // Corner points are assigned clockwise from bottom left:

    //      *   (x2, y2) *--------------* (x3, y3)
    //      *            |              |
    //      *            |              |
    //      *   (x1, y1) *______________* (x4, y4)

    //     if (x !== undefined && y !== undefined && h !== undefined && w !== undefined) {
    //         this.opts.bounds = {
    //             h,
    //             w,
    //             x1: x as number,
    //             x2: x as number,
    //             x3: (x as number) + w,
    //             x4: (x as number) + w,
    //             y1: y,
    //             y2: y - h,
    //             y3: y - h,
    //             y4: y
    //         };
    //         this._modified = true;
    //     } else if (x !== undefined) {
    //         this.opts.bounds = x as IBounds;
    //         this._modified = true;
    //     }

    //     return this.opts.bounds;
    // }

    /**
     * Get/set the content of the text box
     * @param newText - the text
     * @param fontSize - the font size
     * @returns - the text
     */
    public text(newText?: string): string {
        if (newText !== undefined) {
            this._text = newText;

            this._calcStats();
            this._modified = true;
        }

        return this._text;
    }

    /**
     * Set if the text box should be outlined
     * @param outline - outline the text box?
     * @returns - if the text box outline is activated
     */
    public outlinePath(outline?: boolean): boolean {
        if (outline !== undefined) {
            this._debug = outline;
            this._modified = true;
        }

        return this._debug;
    }

    /**
     * The renderer function for this text box
     * @param state - the state object
     */
    public renderer(state: RendererPayload) {
        const ctx = state.context;
        ctx.save();

        // create clipping mask
        ctx.beginPath();
        ctx.moveTo(this.opts.bounds.x1, this.opts.bounds.y1);
        ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
        ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
        ctx.moveTo(this.opts.bounds.x3, this.opts.bounds.y3);
        ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
        ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
        ctx.closePath();
        ctx.clip();

        if (this._debug) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.opts.bounds.x1, this.opts.bounds.y1);
            ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
            ctx.moveTo(this.opts.bounds.x2, this.opts.bounds.y2);
            ctx.lineTo(this.opts.bounds.x3, this.opts.bounds.y3);
            ctx.moveTo(this.opts.bounds.x3, this.opts.bounds.y3);
            ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
            ctx.moveTo(this.opts.bounds.x4, this.opts.bounds.y4);
            ctx.lineTo(this.opts.bounds.x1, this.opts.bounds.y1);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.fillStyle = this.opts.backgroundColor;
        ctx.fillRect(
            this.opts.bounds.x2,
            this.opts.bounds.y2,
            this.opts.bounds.w,
            this.opts.bounds.h
        );

        // const drawPos = this._animating
        //     ? this._calculateTextRenderXY()
        //     : this._drawPos;

        if (this._modified) {
            this._calculateTextRenderXY();
            this._modified = false;
        }

        for (const chunk of this._chunks) {
            // render font
            const absPath = this.opts.font.getPath(
                chunk.text,
                chunk.pos.x,
                chunk.pos.y,
                this.opts.fontSize
            );

            const drawPath = new Path2D(absPath.toPathData(2));

            ctx.fillStyle = this.opts.color;
            ctx.fill(drawPath);
        }

        ctx.restore();
    }

    private _calcStats() {
        const absPath = this.opts.font.getPath(this._text, 0, 0, this.opts.fontSize);
        const bb = absPath.getBoundingBox();

        this._textStats.textHeight = bb.y2 - bb.y1;
        this._textStats.textOffsetBottom = bb.y2 + this.opts.lineHeight;
        this._textStats.textWidth = this.opts.font.getAdvanceWidth(this._text, this.opts.fontSize);
        this._createChunks();
    }

    /**
     * Create chunks of text such that each is less than the width of the
     * textbox plus the vertical margins
     */
    private _createChunks(): void {
        const words = this._text.split(" ");
        const computedChunks = [];
        let currentWidth = 0;
        let currentChunk = "";

        for (const word of words) {
            const curPlusWord = currentChunk !== "" ? currentChunk + " " + word : word;

            const p = this.opts.font.getPath(curPlusWord, 0, 0, this.opts.fontSize);
            const bb = p.getBoundingBox();

            if (bb.x2 - bb.x1 < this.opts.bounds.w) {
                currentChunk = curPlusWord;
                currentWidth = bb.x2 - bb.x1;
            } else {
                computedChunks.push({
                    num: computedChunks.length + 1,
                    pos: { x: 0, y: 0 },
                    text: currentChunk,
                    width: currentWidth
                });
                currentChunk = word;
                currentWidth = 0;
            }
        }
        if (currentWidth === 0) {
            const p = this.opts.font.getPath(currentChunk, 0, 0, this.opts.fontSize);
            const bb = p.getBoundingBox();
            currentWidth = bb.x2 - bb.x1;
        }
        computedChunks.push({
            num: computedChunks.length + 1,
            pos: { x: 0, y: 0 },
            text: currentChunk,
            width: currentWidth
        });

        this._textStats.totalTextHeight = computedChunks.length * this._textStats.textHeight;
        this._chunks = computedChunks;
    }

    /**
     * Calculate the x and y coordinates to start drawing the text
     * @returns - the x and y coords, via result.x and result.y
     */
    private _calculateTextRenderXY() {
        let x: number;
        let y: number;
        this._calcStats();

        const chunksCopy = this._chunks;
        // user gave a position, use it
        for (const chunk of chunksCopy) {
            // calc y
            if (this.opts.verticalAlign === "BOTTOM") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                y =
                    this.opts.bounds.y1 -
                    ((totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                        this._textStats.textOffsetBottom);
            } else if (this.opts.verticalAlign === "CENTER") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                const rowPosRelative =
                    (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                    this._textStats.textOffsetBottom;
                y =
                    this.opts.bounds.y1 -
                    (this.opts.bounds.h / 2 - totalHeight / 2) -
                    rowPosRelative;
            } else if (this.opts.verticalAlign === "TOP") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                const rowPosRelative =
                    (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                    this._textStats.textOffsetBottom;
                y = this.opts.bounds.y1 - (this.opts.bounds.h - totalHeight) - rowPosRelative;
            }
            // calc x
            if (this.opts.horizontalAlign === "LEFT") {
                x = this.opts.bounds.x1;
            } else if (this.opts.horizontalAlign === "CENTER") {
                x = this.opts.bounds.x1 + this.opts.bounds.w / 2 - chunk.width / 2;
            } else if (this.opts.horizontalAlign === "RIGHT") {
                x = this.opts.bounds.x1 + (this.opts.bounds.w - chunk.width);
            }
            chunk.pos.x = x;
            chunk.pos.y = y;
        }

        return chunksCopy;
    }
    // private _calculateUnderlineRenderXY() {}
}
