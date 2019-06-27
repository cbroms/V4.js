import Font from "./Font";

/**
 * @exports textCanvas
 * @class
 */
class TextCanvas {
    constructor(canvas = null, webgl = false) {
        // functions

        // set default values
        this.canvas = canvas;
        this.context = canvas ? canvas.getContext("2d") : null;
        this.webgl = webgl;
    }

    /**
     * Check the status of the canvas
     * @param {bool} quietly - don't throw error if canvas DNE?
     * @returns {bool} - if the canvas exists
     */
    hasCanvas(quietly = false) {
        if (!this.canvas) {
            return quietly ? false : throw "Trying to access null canvas";
        }
        return true;
    }

    /**
     * Check the status of the canvas' context
     * @param {bool} quietly - don't throw error if context DNE?
     * @returns {bool} - if the context exists
     */
    hasContext(quietly = false) {
        if (!this.context) {
            return quietly
                ? false
                : throw "Trying to access null canvas context";
        }
        return true;
    }

    /**
     * Set the background color of the canvas
     * @param {string} color - the color to fill, in hex
     */
    setBackgroundColor(color = "#000") {
        if (this.hasCanvas() && this.hasContext()) {
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export default TextCanvas;
