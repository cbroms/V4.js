import { backgroundRenderer, clearPrevRenderer } from "./Renderers";
import { RendererPayload } from "./RendererPayload";
import { Error } from "./Error";

/**
 * @exports V4.Loop
 * @class
 */
export class Loop {
    private _loop: boolean;
    private _frameCount: number;
    private _animationBuffer: { (rendererPayload: object): void }[];
    private _backgroundColor: string;
    private _fps: number;
    private _fpsInterval: number;
    private _startTime: number;
    private _then: number;

    public canvas: HTMLCanvasElement | null;
    public context: CanvasRenderingContext2D | null;

    constructor(canvas: HTMLCanvasElement | null) {
        // set default values
        this.canvas = canvas;
        this.context = canvas ? canvas.getContext("2d") : null;
        this._loop = false;
        this._frameCount = 0;
        this._backgroundColor = "#000";
        this._fps = 30;
        this._fpsInterval = 30 / 1000;
        this._startTime = Date.now();
        this._then = Date.now();

        this.framesPerSecond(30);

        // add default renderers to animation buffer
        this._animationBuffer = [clearPrevRenderer, backgroundRenderer];

        // set HDPI canvas scale for retina displays
        const ratio = window.devicePixelRatio;

        if (ratio !== 1) {
            const width = this.canvas.width;
            const height = this.canvas.height;

            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            this.context.scale(ratio, ratio);
        }
    }

    /**
     * Check the status of the canvas
     * @param quietly - don't throw error if canvas DNE?
     * @returns - if the canvas exists
     */
    hasCanvas(quietly = true): boolean | Error {
        if (!this.canvas) {
            if (quietly) return false;
            else Error("Trying to access null canvas");
        }
        return true;
    }

    /**
     * Check the status of the canvas' context
     * @param quietly - don't throw error if context DNE?
     * @returns - if the context exists
     */
    hasContext(quietly = true): boolean | Error {
        if (!this.context) {
            if (quietly) return false;
            else Error("Trying to access null canvas context");
        }
        return true;
    }

    /**
     * Get/set the background color of the canvas
     * @param color - the color to fill, in hex
     * @returns - the background color, in hex
     */
    backgroundColor(color: string): string {
        if (color) this._backgroundColor = color;
        return this._backgroundColor;
    }

    /**
     * Get/set the target frames per second of canvas animations
     * @param num - target FPS
     * @param - target FPS
     */
    framesPerSecond(num: number): number {
        if (num) {
            this._fps = num;
            this._fpsInterval = 1000 / num;
        }
        return this._fps;
    }

    /**
     * Add a renderer function to the animation
     * @param renderer - the render function to be executed
     */
    addToLoop(renderer: { (rendererPayload: object): void }): void {
        this._animationBuffer.push(renderer);
    }

    /**
     * Start the canvas animation
     */
    startLoop() {
        this._loop = true;
        this._then = window.performance.now();
        this._startTime = this._then;
        this._renderLoop(this);
    }

    /**
     * Stop/pause the canvas animation
     */
    stopLoop() {
        this._loop = false;
    }

    /**
     * The animation loop running at the target frames per second
     * @param self - TextCanvas class reference
     */
    _renderLoop(self: this) {
        console.log("loop");
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
                const payload = new RendererPayload();
                payload.canvas = self.canvas;
                payload.context = self.context;
                payload.hasContext = self.hasContext;
                payload.hasCanvas = self.hasCanvas;
                payload.backgroundColor = self._backgroundColor;
                payload.deltaTime = elapsed / 1000;
                payload.frameCount = self._frameCount;
                payload.startTime = self._startTime;
                payload.fps = fps;

                self.context.save();

                // call each render function and pass rendererPayload
                for (const renderer of self._animationBuffer) {
                    try {
                        renderer(payload);
                    } catch (e) {
                        Error(
                            'Renderer function "' +
                                renderer.name +
                                '" threw an uncaught exception: "' +
                                e +
                                '" '
                        );
                        self._loop = false;
                    }
                }

                self.context.restore();
            }

            const callback = () => {
                self._renderLoop(self);
            };
            // request next frame
            requestAnimationFrame(callback);
        }
    }
}