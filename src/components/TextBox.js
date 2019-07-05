/**
 * @exports V4.TextBox
 * @class
 */
export class TextBox {
    /**
     * Create a new TextBox object
     * @param {Font} font - the font object
     * @param {number} x - the x coordinate of the text box's bottom left corner
     * @param {number} y - the y coordinate of the text box's bottom left corner
     * @param {number} h - the height, in pixels, of the text box
     * @param {number} w - the width, in pixels, of the text box
     * @returns {TextBox} - the new TextBox object
     */
    constructor(font, x, y, h, w) {
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

        this._verticalAlign = "BOTTOM";
        this._horizontalAlign = "RIGHT";

        this.renderer = this.renderer.bind(this);
    }

    /**
     * Get/set the content of the text box
     * @param {string} newText - the text
     * @param {number} fontSize - the font size
     * @returns {string} - the text
     */
    text(newText, fontSize) {
        if (newText) this._text = newText;
        if (fontSize) this._fontSize = fontSize;

        const absPath = this.font.getPath(this._text, 0, 0, this._fontSize);

        const bb = absPath.getBoundingBox();
        this._textHeight = bb.y2 - bb.y1;
        this._textOffsetBottom = bb.y2;

        this._textWidth = this.font.getAdvanceWidth(newText, fontSize);
        return this._text;
    }

    /**
     * Get/set the vertical alignment of the text in the text box
     * @param {string} alignment - alignment command, must be BOTTOM, CENTER, or TOP
     * @returns {string} - the alignment
     */
    verticalAlign(alignment = "BOTTOM") {
        if (alignment) this._verticalAlign = alignment;
        return this._verticalAlign;
    }

    /**
     * Get/set the horizontal alignment of the text in the text box
     * @param {string} alignment - alignment command, must be LEFT, CENTER, or RIGHT
     * @returns {string} - the alignment
     */
    horizontalAlign(alignment = "LEFT") {
        if (alignment) this._horizontalAlign = alignment;
        return this._horizontalAlign;
    }

    /**
     * Explicitly specify where to draw text within the text box
     * @param {number} x - x coordinate to place text (bottom left corner)
     * @param {number} y - x coordinate to place text (bottom left corner)
     */
    exactTextPosition(x, y) {
        this._drawX = x;
        this._drawY = y;
    }

    /**
     * Set if the text box should be outlined
     * @param {bool} outline - outline the text box?
     * @returns {bool} - if the text box outline is activated
     */
    outlinePath(outline) {
        if (outline !== null) this._debug = outline;
        return this._debug;
    }

    /**
     * The renderer function for this text box
     * @param {object} state - the state object
     */
    renderer(state) {
        const ctx = state.context;

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
            ctx.lineWidth = "1";
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

        let x, y;

        // user gave a position, use it
        if (this._drawX && this._drawY) {
            x = this._drawX;
            y = this._drawY;
        } else {
            // user has not specified a position, calculate based on alignment

            // calc y
            if (this._verticalAlign === "BOTTOM") {
                y = this.bounds.y1 - this._textOffsetBottom;
            } else if (this._verticalAlign === "CENTER") {
                y =
                    this.bounds.y1 -
                    this.bounds.h / 2 +
                    this._textHeight / 2 -
                    this._textOffsetBottom;
            } else if (this._verticalAlign === "TOP") {
                y =
                    this.bounds.y2 +
                    (this._textHeight - this._textOffsetBottom);
            }

            // calc x
            if (this._horizontalAlign === "LEFT") {
                x = this.bounds.x1;
            } else if (this._horizontalAlign === "CENTER") {
                x = this.bounds.x1 + this.bounds.w / 2 - this._textWidth / 2;
            } else if (this._horizontalAlign === "RIGHT") {
                x = this.bounds.x1 + (this.bounds.w - this._textWidth);
            }
        }

        // render font

        const absPath = this.font.getPath(this._text, x, y, this._fontSize);

        const drawPath = new Path2D(absPath.toPathData(2));

        ctx.fillStyle = "white";
        ctx.fill(drawPath);
        // ctx.drawImage(path.toSVG(2), 0, 0);
        // path.fill = "white";
        // path.draw(state.context);
    }
}
