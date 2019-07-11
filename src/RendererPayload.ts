import { Loop } from "./Loop";

const empty = () => false;

export class RendererPayload {
    public canvas: HTMLCanvasElement | null;
    public context: CanvasRenderingContext2D | null;
    public hasContext: { (): boolean | Error };
    public hasCanvas: { (): boolean | Error };
    public backgroundColor: string;
    public deltaTime: number;
    public frameCount: number;
    public startTime: number;
    public fps: number;
    public loop: Loop;

    constructor() {
        this.canvas = null;
        this.context = null;
        this.hasContext = empty;
        this.hasCanvas = empty;
        this.backgroundColor = "#000";
        this.deltaTime = 0;
        this.frameCount = 0;
        this.startTime = 0;
        this.fps = 0;
        this.loop = null;
    }
}
