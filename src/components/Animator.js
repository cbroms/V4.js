import { Font } from "./Font";
import { backgroundRenderer, clearPrevRenderer } from "./Renderers";

/**
 * @exports V4.Animator
 * @class
 */
export class Animator {
    constructor(canvas = null, webgl = false) {
        // set default values
        this.canvas = canvas;
        this.context = canvas ? canvas.getContext("2d") : null;
        this._webgl = webgl;
        this._loop = false;
        this._frameCount = 0;

        this.framesPerSecond(30);

        // add renderer to animation buffer
        this._animationBuffer = [clearPrevRenderer, backgroundRenderer];
    }

    /**
     * Check the status of the canvas
     * @param {bool} quietly - don't throw error if canvas DNE?
     * @returns {bool} - if the canvas exists
     */
    hasCanvas(quietly = false) {
        if (!this.canvas) {
            if (quietly) return false;
            else throw "Trying to access null canvas";
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
            if (quietly) return false;
            else throw "Trying to access null canvas context";
        }
        return true;
    }

    /**
     * Get/set the background color of the canvas
     * @param {string} color - the color to fill, in hex
     * @returns {string} - the background color, in hex
     */
    backgroundColor(color) {
        if (color) this._backgroundColor = color;
        return this._backgroundColor;
    }

    /**
     * Get/set the target frames per second of canvas animations
     * @param {number} num - target FPS
     * @param {number} - target FPS
     */
    framesPerSecond(num) {
        if (num) {
            this._fps = num;
            this._fpsInterval = 1000 / num;
        }
        return this._fps;
    }

    /**
     * Add a renderer function to the animation
     * @param {Function} renderer - the render function to be executed
     */
    addToAnimation(renderer) {
        this._animationBuffer.push(renderer);
    }

    /**
     * Start the canvas animation
     */
    startAnimationLoop() {
        this._loop = true;
        this._then = window.performance.now();
        this._startTime = this._then;
        this._animationLoop(this);
    }

    /**
     * Stop/pause the canvas animation
     */
    stopAnimationLoop() {
        this._loop = false;
    }

    /**
     * The animation loop running at the target frames per second
     * @param {TextCanvas} self - TextCanvas class reference
     */
    _animationLoop(self) {
        if (self._loop && self.hasCanvas() && self.hasContext()) {
            // calculate the deltaTime
            const now = window.performance.now();
            let elapsed = now - self._then;

            // window has likely been inactive; reset frame and time counters
            if (elapsed > 300) {
                self._startTime = now;
                self._frameCount = 0;
                self._then = now;
                elapsed = 0;
            }

            if (elapsed > self._fpsInterval) {
                self._then = now - (elapsed % self._fpsInterval);
                self._frameCount += 1;

                const sinceStart = now - self._startTime;
                const fps = Math.round(1000 / (sinceStart / self._frameCount));

                //console.log(fps);

                // create the rendererPayload object to be sent to each render function
                const rendererPayload = {
                    canvas: self.canvas,
                    context: self.context,
                    hasContext: self.hasContext,
                    hasCanvas: self.hasCanvas,
                    backgroundColor: self._backgroundColor,
                    deltaTime: elapsed / 100,
                    frameCount: self._frameCount,
                    startTime: self._startTime,
                    fps: fps
                };

                self.context.save();

                // call each render function and pass rendererPayload
                for (const renderer of self._animationBuffer) {
                    try {
                        renderer(rendererPayload);
                    } catch (e) {
                        throw "Error in renderer function: " + e;
                    }
                }

                self.context.restore();
            }

            const callback = () => {
                self._animationLoop(self);
            };
            // request next frame
            requestAnimationFrame(callback);
        }
    }
}
