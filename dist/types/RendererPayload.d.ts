import { Loop } from "./Loop";
export declare class RendererPayload {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    hasContext: {
        (): boolean | Error;
    };
    hasCanvas: {
        (): boolean | Error;
    };
    backgroundColor: string;
    deltaTime: number;
    frameCount: number;
    startTime: number;
    fps: number;
    loop: Loop;
    constructor();
}
