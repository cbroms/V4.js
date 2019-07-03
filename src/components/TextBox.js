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
        return this._text;
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
        // state.context.beginPath();
        // state.context.lineWidth = "2";
        // state.context.strokeStyle = "red";
        // state.context.moveTo(this.bounds.x1, this.bounds.y1);
        // state.context.lineTo(this.bounds.x2, this.bounds.y2);
        // state.context.moveTo(this.bounds.x2, this.bounds.y2);
        // state.context.lineTo(this.bounds.x3, this.bounds.y3);
        // state.context.moveTo(this.bounds.x3, this.bounds.y3);
        // state.context.lineTo(this.bounds.x4, this.bounds.y4);
        // state.context.moveTo(this.bounds.x4, this.bounds.y4);
        // state.context.lineTo(this.bounds.x1, this.bounds.y1);
        // state.context.closePath();
        // state.context.stroke();
        // state.context.clip();

        // Clip a rectangular area
        ctx.strokeStyle = "red";
        ctx.rect(this.bounds.x1, this.bounds.y2, this.bounds.w, this.bounds.h);
        ctx.stroke();
        ctx.clip();

        // render font

        const path = this.font.getPath(
            this._text,
            this.bounds.x1,
            this.bounds.y1,
            this._fontSize
        );
        let path2 = new Path2D(path.toPathData(2));
        //path2.moveTo(0, 0);
        ctx.fillStyle = "white";
        ctx.fill(path2);
        // ctx.drawImage(path.toSVG(2), 0, 0);
        // path.fill = "white";
        // path.draw(state.context);
    }
}
