class TextCanvas {
    constructor(canvas = null, webgl = false) {
        console.log("hey");
        // functions

        // set default values
        this.canvas = canvas;
        this.context = canvas ? canvas.getContext("2d") : null;
        this.webgl = webgl;
    }

    hasCanvas() {
        if (!this.canvas) {
            throw "Trying to access null canvas";
        }
    }

    hasContext() {
        if (!this.context) {
            throw "Trying to access null canvas context";
        }
    }

    setBackgroundColor(color = "#000") {
        this.hasCanvas();
        this.hasContext();
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default TextCanvas;
