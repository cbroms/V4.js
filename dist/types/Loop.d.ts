import { RendererPayload } from "./RendererPayload";
import { RenderQueue } from "./RenderQueue";
import { Shader } from "./Shader";
declare type Renderer = (rendererPayload: RendererPayload) => void;
/**
 * @exports V4.Loop
 * @class
 */
export declare class Loop {
    canvas: HTMLCanvasElement;
    glCanvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    glContext: WebGLRenderingContext | null;
    webgl: boolean;
    private _loop;
    private _frameCount;
    private _rendererBuffer;
    private _renderQueueBuffer;
    private _shaderBuffer;
    private _backgroundColor;
    private _fps;
    private _fpsInterval;
    private _startTime;
    private _then;
    constructor(canvas: HTMLCanvasElement, webgl?: boolean);
    /**
     * Get/set the background color of the canvas
     * @param color - the color to fill, in hex
     * @returns - the background color, in hex
     */
    backgroundColor(color: string): string;
    /**
     * Get/set the target frames per second of canvas animations
     * @param num - target FPS
     * @param - target FPS
     */
    framesPerSecond(num: number): number;
    /**
     * Add a renderer function or RenderQueue to the animation
     * @param renderer - the render function or RenderQueue object to be executed
     */
    addToLoop(renderer: Renderer | RenderQueue | Shader): void;
    /**
     * Start the canvas animation
     */
    startLoop(): void;
    /**
     * Stop/pause the canvas animation
     */
    stopLoop(): void;
    /**
     * The animation loop running at the target frames per second
     * @param self - TextCanvas class reference
     */
    _renderLoop(self: this): void;
}
export {};
