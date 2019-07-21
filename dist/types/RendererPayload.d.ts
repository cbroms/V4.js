import { Loop } from "./Loop";
export declare class RendererPayload {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    glCanvas: HTMLCanvasElement;
    glContext: WebGLRenderingContext;
    webgl: boolean;
    backgroundColor: string;
    deltaTime: number;
    frameCount: number;
    startTime: number;
    fps: number;
    loop: Loop;
    constructor();
}
