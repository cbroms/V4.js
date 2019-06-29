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
        this.loop = false;
        this.animationBuffer = [];
        this.frameCount = 0;

        this.setFps(30);
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
            this.context.fillStyle = this.backgroundColor
                ? this.backgroundColor
                : color;
            this.backgroundColor = color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setFps(num) {
        this.fps = num;
        this.fpsInterval = 1000 / num;
    }

    addToAnimation(renderer) {
        this.animationBuffer.push(renderer);
    }

    startAnimationLoop() {
        this.loop = true;
        this.then = Date.now();
        this.startTime = this.then;
        this.animationLoop(this);
    }

    stopAnimationLoop() {
        this.loop = false;
    }

    animationLoop(self) {
        // const self = this;
        if (self.loop && self.hasCanvas() && self.hasContext()) {
            // calculate the deltaTime
            const now = Date.now();
            let elapsed = now - self.then;

            // window has likely been inactive; reset frame and time counters
            if (elapsed > 300) {
                self.startTime = now;
                self.frameCount = 0;
                self.then = now;
                elapsed = 0;
            }

            if (elapsed > self.fpsInterval) {
                self.then = now - (elapsed % self.fpsInterval);
                self.frameCount += 1;

                const sinceStart = now - self.startTime;
                const fps = Math.round(1000 / (sinceStart / self.frameCount));

                console.log(fps);

                // create the rendererPayload object to be sent to each render function
                const rendererPayload = {
                    context: self.context,
                    deltaTime: elapsed,
                    fps: fps
                };

                // clear the old canvas
                self.context.clearRect(
                    0,
                    0,
                    self.canvas.width,
                    self.canvas.height
                );

                self.setBackgroundColor();

                // call each render function and send rendererPayload
                for (renderer of self.animationBuffer) {
                    renderer(rendererPayload);
                }
            }

            const callback = () => {
                self.animationLoop(self);
            };
            // request next frame
            requestAnimationFrame(callback);
        }
    }
}

export default TextCanvas;
