import { RendererPayload } from "./RendererPayload";
import { RenderQueue } from "./RenderQueue";
import { Shader } from "./Shader";
import { TextBox } from "./TextBox";
interface IOptions {
    backgroundColor: string;
    webGl: boolean;
}
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
    opts: IOptions;
    private _loop;
    private _frameCount;
    private _rendererBuffer;
    private _renderQueueBuffer;
    private _shaderBuffer;
    private _fps;
    private _fpsInterval;
    private _sizeAdjusted;
    private _startTime;
    private _then;
    constructor(canvas: HTMLCanvasElement, opts: IOptions);
    /**
     * Get/set the target frames per second of canvas animations
     * @param num - target FPS
     * @param - target FPS
     */
    framesPerSecond(num: number): number;
    /**
     * Add a renderer function, RenderQueue, Shader, or TextBox to the animation
     * @param renderer - the renderer to be executed
     */
    addToLoop(renderer: Renderer | RenderQueue | Shader | TextBox): void;
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
