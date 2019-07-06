/**
 * @exports V4.Animator
 * @class
 */
export declare class Animator {
    private _loop;
    private _frameCount;
    private _animationBuffer;
    private _backgroundColor;
    private _fps;
    private _fpsInterval;
    private _startTime;
    private _then;
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    constructor(canvas: HTMLCanvasElement | null);
    /**
     * Check the status of the canvas
     * @param {bool} quietly - don't throw error if canvas DNE?
     * @returns {bool} - if the canvas exists
     */
    hasCanvas(quietly?: boolean): boolean | Error;
    /**
     * Check the status of the canvas' context
     * @param {bool} quietly - don't throw error if context DNE?
     * @returns {bool} - if the context exists
     */
    hasContext(quietly?: boolean): boolean | Error;
    /**
     * Get/set the background color of the canvas
     * @param {string} color - the color to fill, in hex
     * @returns {string} - the background color, in hex
     */
    backgroundColor(color: string): string;
    /**
     * Get/set the target frames per second of canvas animations
     * @param {number} num - target FPS
     * @param {number} - target FPS
     */
    framesPerSecond(num: number): number;
    /**
     * Add a renderer function to the animation
     * @param {Function} renderer - the render function to be executed
     */
    addToAnimation(renderer: {
        (rendererPayload: object): void;
    }): void;
    /**
     * Start the canvas animation
     */
    startAnimationLoop(): void;
    /**
     * Stop/pause the canvas animation
     */
    stopAnimationLoop(): void;
    /**
     * The animation loop running at the target frames per second
     * @param {TextCanvas} self - TextCanvas class reference
     */
    _animationLoop(self: this): void;
}
