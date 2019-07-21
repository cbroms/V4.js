import { Loop } from "./Loop";

export class RendererPayload {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public glCanvas: HTMLCanvasElement;
  public glContext: WebGLRenderingContext;
  public webgl: boolean;
  public backgroundColor: string;
  public deltaTime: number;
  public frameCount: number;
  public startTime: number;
  public fps: number;
  public loop: Loop;

  constructor() {
    this.canvas = null;
    this.context = null;
    this.glCanvas = null;
    this.glContext = null;
    this.webgl = false;
    this.backgroundColor = "#000";
    this.deltaTime = 0;
    this.frameCount = 0;
    this.startTime = 0;
    this.fps = 0;
    this.loop = null;
  }
}
