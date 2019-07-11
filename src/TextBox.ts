import { Font } from "opentype.js";
import { RendererPayload } from "./RendererPayload";

type VerticalAlignOpts = "BOTTOM" | "TOP" | "CENTER";
type HorizontalAlignOpts = "RIGHT" | "LEFT" | "CENTER";

type TextStats = {
    textWidth: number;
    textHeight: number;
    totalTextHeight: number;
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

type Chunk = {
    text: string;
    pos: DrawPos;
    num: number;
    width: number;
};

/**
 * @exports V4.TextBox
 * @class
 */
export class TextBox {
    private _text: string;
    private _fontSize: number;
    private _modified: boolean;
    private _debug: boolean;
    private _underline: boolean;
    private _chunks: Chunk[] | null;
    private _textStats: TextStats;
    private _verticalAlign: VerticalAlignOpts;
    private _horizontalAlign: HorizontalAlignOpts;
    private _bounds: Bounds;

    public font: Font;

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
    constructor(font: Font, x?: number | Bounds, y?: number, h?: number, w?: number) {
        this.font = font;
        this._text = "";
        this._fontSize = 24;
        this._modified = true;

        this.bounds(x, y, h, w);

        // set defaut properties
        this._verticalAlign = "BOTTOM";
        this._horizontalAlign = "RIGHT";
        // this._animating = false;
        this._debug = false;
        this._underline = false;
        this._chunks = null;
        this._textStats = {
            textWidth: 0,
            textHeight: 0,
            totalTextHeight: 0,
            textOffsetBottom: this._fontSize / 3 // line height
        };
        this.renderer = this.renderer.bind(this);
    }

    /**
     * Get/set the textbox's boundaries
     * @param x - the x coordinate of the text box's bottom left corner, or an object containing specific bounds for the textbox
     * @param y - the y coordinate of the text box's bottom left corner
     * @param h - the height, in pixels, of the text box
     * @param w - the width, in pixels, of the text box
     * @returns - an object containing the boundary points of the textbox
     */
    bounds(x?: number | Bounds, y?: number, h?: number, w?: number): Bounds {
        // Corner points are assigned clockwise from bottom left:
        /*
         *   (x2, y2) *--------------* (x3, y3)
         *            |              |
         *            |              |
         *   (x1, y1) *______________* (x4, y4)
         */
        if (x !== undefined && y !== undefined && h !== undefined && w !== undefined) {
            this._bounds = {
                x1: x as number,
                y1: y,
                x2: x as number,
                y2: y - h,
                x3: (x as number) + w,
                y3: y - h,
                x4: (x as number) + w,
                y4: y,
                w: w,
                h: h
            };
            this._modified = true;
        } else if (x !== undefined) {
            this._bounds = x as Bounds;
            this._modified = true;
        }

        return this._bounds;
    }

    /**
     * Get/set the content of the text box
     * @param newText - the text
     * @param fontSize - the font size
     * @returns - the text
     */
    text(newText?: string, fontSize?: number): string {
        if (newText !== undefined) {
            this._text = newText;

            if (fontSize !== undefined) this._fontSize = fontSize;

            const absPath = this.font.getPath(this._text, 0, 0, this._fontSize);
            const bb = absPath.getBoundingBox();

            this._textStats.textHeight = bb.y2 - bb.y1;
            this._textStats.textOffsetBottom = bb.y2 + fontSize / 3;
            this._textStats.textWidth = this.font.getAdvanceWidth(newText, fontSize);
            this._createChunks();
            this._modified = true;
        } else if (fontSize !== undefined) {
            this._fontSize = fontSize;
            this._modified = true;
        }

        return this._text;
    }

    /**
     * Get/set the vertical alignment of the text in the text box
     * @param alignment - alignment command, must be BOTTOM, CENTER, or TOP
     * @returns - the alignment
     */
    verticalAlign(alignment?: VerticalAlignOpts): VerticalAlignOpts {
        if (alignment) {
            this._verticalAlign = alignment;
            this._modified = true;
        }

        return this._verticalAlign;
    }

    /**
     * Get/set the horizontal alignment of the text in the text box
     * @param alignment - alignment command, must be LEFT, CENTER, or RIGHT
     * @returns - the alignment
     */
    horizontalAlign(alignment?: HorizontalAlignOpts): HorizontalAlignOpts {
        if (alignment !== undefined) {
            this._horizontalAlign = alignment;
            this._modified = true;
        }

        return this._horizontalAlign;
    }

    /**
     * Set if the text box should be outlined
     * @param outline - outline the text box?
     * @returns - if the text box outline is activated
     */
    outlinePath(outline?: boolean): boolean {
        if (outline !== undefined) {
            this._debug = outline;
            this._modified = true;
        }

        return this._debug;
    }

    /**
     * Set if the the text should be underlined
     * @param underline - underline the text in the text box?
     * @returns - if the underlines are active
     */
    underline(underline?: boolean): boolean {
        if (underline !== null) {
            this._underline = underline;
            this._modified = true;
        }
        return this._underline;
    }

    /**
     * Create chunks of text such that each is less than the width of the
     * textbox plus the vertical margins
     */
    _createChunks(): void {
        const words = this._text.split(" ");
        let computedChunks = [];
        let currentWidth = 0;
        let currentChunk = "";

        for (const word of words) {
            const curPlusWord = currentChunk !== "" ? currentChunk + " " + word : word;

            const p = this.font.getPath(curPlusWord, 0, 0, this._fontSize);
            const bb = p.getBoundingBox();

            if (bb.x2 - bb.x1 < this._bounds.w) {
                currentChunk = curPlusWord;
                currentWidth = bb.x2 - bb.x1;
            } else {
                computedChunks.push({
                    text: currentChunk,
                    pos: { x: 0, y: 0 },
                    num: computedChunks.length + 1,
                    width: currentWidth
                });
                currentChunk = word;
                currentWidth = 0;
            }
        }
        if (currentWidth === 0) {
            const p = this.font.getPath(currentChunk, 0, 0, this._fontSize);
            const bb = p.getBoundingBox();
            currentWidth = bb.x2 - bb.x1;
        }
        computedChunks.push({
            text: currentChunk,
            pos: { x: 0, y: 0 },
            num: computedChunks.length + 1,
            width: currentWidth
        });

        this._textStats.totalTextHeight = computedChunks.length * this._textStats.textHeight;

        this._chunks = computedChunks;
    }

    /**
     * Calculate the x and y coordinates to start drawing the text
     * @returns - the x and y coords, via result.x and result.y
     */
    _calculateTextRenderXY() {
        let x: number;
        let y: number;

        let chunksCopy = this._chunks;
        // user gave a position, use it
        for (let chunk of chunksCopy) {
            // calc y
            if (this._verticalAlign === "BOTTOM") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                y =
                    this._bounds.y1 -
                    ((totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                        this._textStats.textOffsetBottom);
            } else if (this._verticalAlign === "CENTER") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                const rowPosRelative =
                    (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                    this._textStats.textOffsetBottom;
                y = this._bounds.y1 - (this._bounds.h / 2 - totalHeight / 2) - rowPosRelative;
            } else if (this._verticalAlign === "TOP") {
                const totalHeight =
                    (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                    this._chunks.length;
                const rowPosRelative =
                    (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                    this._textStats.textOffsetBottom;
                y = this._bounds.y1 - (this._bounds.h - totalHeight) - rowPosRelative;
            }
            // calc x
            if (this._horizontalAlign === "LEFT") {
                x = this._bounds.x1;
            } else if (this._horizontalAlign === "CENTER") {
                x = this._bounds.x1 + this._bounds.w / 2 - chunk.width / 2;
            } else if (this._horizontalAlign === "RIGHT") {
                x = this._bounds.x1 + (this._bounds.w - chunk.width);
            }

            chunk.pos.x = x;
            chunk.pos.y = y;
        }

        return chunksCopy;
    }

    _calculateUnderlineRenderXY() {}

    /**
     * The renderer function for this text box
     * @param state - the state object
     */
    renderer(state: RendererPayload) {
        const ctx = state.context;

        ctx.save();

        //create clipping mask
        ctx.beginPath();
        ctx.moveTo(this._bounds.x1, this._bounds.y1);
        ctx.lineTo(this._bounds.x2, this._bounds.y2);
        ctx.lineTo(this._bounds.x4, this._bounds.y4);
        ctx.moveTo(this._bounds.x3, this._bounds.y3);
        ctx.lineTo(this._bounds.x4, this._bounds.y4);
        ctx.lineTo(this._bounds.x2, this._bounds.y2);
        ctx.closePath();
        ctx.clip();

        if (this._debug) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this._bounds.x1, this._bounds.y1);
            ctx.lineTo(this._bounds.x2, this._bounds.y2);
            ctx.moveTo(this._bounds.x2, this._bounds.y2);
            ctx.lineTo(this._bounds.x3, this._bounds.y3);
            ctx.moveTo(this._bounds.x3, this._bounds.y3);
            ctx.lineTo(this._bounds.x4, this._bounds.y4);
            ctx.moveTo(this._bounds.x4, this._bounds.y4);
            ctx.lineTo(this._bounds.x1, this._bounds.y1);
            ctx.closePath();
            ctx.stroke();
        }

        // const drawPos = this._animating
        //     ? this._calculateTextRenderXY()
        //     : this._drawPos;

        if (this._modified) {
            this._calculateTextRenderXY();
            this._modified = false;
        }

        for (const chunk of this._chunks) {
            // render font
            const absPath = this.font.getPath(chunk.text, chunk.pos.x, chunk.pos.y, this._fontSize);

            const drawPath = new Path2D(absPath.toPathData(2));

            ctx.fillStyle = "white";
            ctx.fill(drawPath);
        }

        ctx.restore();
    }
}
