import { RendererPayload } from "./RendererPayload";
import { backgroundRenderer, clearPrevRenderer } from "./Renderers";
import { RenderQueue } from "./RenderQueue";
import { Error } from "./utils/Error";

type Renderer = (rendererPayload: object) => void;

/**
 * @exports V4.Loop
 * @class
 */
export class Loop {
  public canvas: HTMLCanvasElement;
  public glCanvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D | null;
  public glContext: WebGLRenderingContext | null;
  public webgl: boolean;
  private _loop: boolean;
  private _frameCount: number;
  private _rendererBuffer: Renderer[];
  private _renderQueueBuffer: RenderQueue[];
  private _backgroundColor: string;
  private _fps: number;
  private _fpsInterval: number;
  private _startTime: number;
  private _then: number;

  constructor(canvas: HTMLCanvasElement, webgl = false) {
    // check canvas and context are OK before continuing
    if (!(canvas instanceof HTMLCanvasElement))
      Error("Loop requires an HTML Canvas Element", true);

    const td = canvas.getContext("2d");
    if (td === null)
      Error(
        "Unable to get canvas context. Did you already get a WebGL or 3D context from this canvas?",
        true,
      );
    this.canvas = canvas;
    this.context = td;

    // create a new canvas for WebGL stuff
    this.glCanvas = webgl ? document.createElement("canvas") : null;
    this.glContext = webgl ? this.glCanvas.getContext("webgl") : null;
    this.webgl = webgl;

    if (webgl) {
      const wrapper = document.createElement("div");
      wrapper.id = "v4-wrapper";
      this.glCanvas.id = "v4-webgl-canvas";

      const canvasParent = this.canvas.parentElement;
      canvasParent.appendChild(wrapper);
      wrapper.appendChild(this.canvas);
      wrapper.appendChild(this.glCanvas);

      this.glCanvas.style.position = "absolute";
      this.canvas.style.position = "absolute";
    }

    this._loop = false;
    this._frameCount = 0;
    this._backgroundColor = "#000";
    this._fps = 30;
    this._fpsInterval = 30 / 1000;
    this._startTime = Date.now();
    this._then = Date.now();

    this.framesPerSecond(30);

    // add default renderers to animation buffer
    this._rendererBuffer = [clearPrevRenderer, backgroundRenderer];
    this._renderQueueBuffer = [];

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

      if (this.webgl) {
        this.glCanvas.width = width * ratio;
        this.glCanvas.height = height * ratio;
        this.glCanvas.style.width = width + "px";
        this.glCanvas.style.height = height + "px";
      }
    }
  }

  /**
   * Get/set the background color of the canvas
   * @param color - the color to fill, in hex
   * @returns - the background color, in hex
   */
  public backgroundColor(color: string): string {
    if (color) {
      this._backgroundColor = color;
    }
    return this._backgroundColor;
  }

  /**
   * Get/set the target frames per second of canvas animations
   * @param num - target FPS
   * @param - target FPS
   */
  public framesPerSecond(num: number): number {
    if (num) {
      this._fps = num;
      this._fpsInterval = 1000 / num;
    }
    return this._fps;
  }

  /**
   * Add a renderer function or RenderQueue to the animation
   * @param renderer - the render function or RenderQueue object to be executed
   */
  public addToLoop(renderer: Renderer | RenderQueue): void {
    if (renderer instanceof RenderQueue) {
      this._renderQueueBuffer.push(renderer as RenderQueue);
    } else {
      this._rendererBuffer.push(renderer as Renderer);
    }
  }

  /**
   * Start the canvas animation
   */
  public startLoop() {
    this._loop = true;
    this._then = window.performance.now();
    this._startTime = this._then;
    this._renderLoop(this);
  }

  /**
   * Stop/pause the canvas animation
   */
  public stopLoop() {
    this._loop = false;
  }

  /**
   * The animation loop running at the target frames per second
   * @param self - TextCanvas class reference
   */
  public _renderLoop(self: this) {
    if (self._loop) {
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

        // create the rendererPayload object to be sent to each render function
        const payload = new RendererPayload();
        payload.canvas = self.canvas;
        payload.context = self.context;
        payload.glCanvas = self.glCanvas;
        payload.glContext = self.glContext;
        payload.webgl = self.webgl;
        payload.backgroundColor = self._backgroundColor;
        payload.deltaTime = elapsed / 1000;
        payload.frameCount = self._frameCount;
        payload.startTime = self._startTime;
        payload.fps = fps;
        payload.loop = self;

        self.context.save();

        // call each render function and pass rendererPayload
        for (const renderer of self._rendererBuffer) {
          try {
            renderer(payload);
          } catch (e) {
            Error(
              'Renderer function "' +
                renderer.name +
                '" threw an uncaught exception: "' +
                e +
                '" ',
            );
            self._loop = false;
          }
        }

        // loop through the list of RenderQueues and call the render functions
        // within each
        for (const rq of self._renderQueueBuffer) {
          rq.render(payload);
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
