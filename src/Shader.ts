import { Error } from "./utils/Error";
import { RendererPayload } from "./RendererPayload";

const defaultVertexShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const defaultFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
    gl_FragColor = vec4(0.0);
  }
`;

export interface IShaderErrorMessage {
  text: string;
  lineNumber: number;
}

interface ITexture {
  glTexture: WebGLTexture;
  unit: number;
}

export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

/**
 * @exports V4.Shader
 * @class
 */
// Much of this comes from https://github.com/fordhurley/shader-canvas
export class Shader {
  private _gl: WebGLRenderingContext;

  private _vertexShader: WebGLShader;
  private _fragmentShader: WebGLShader;
  private _shaderProgram: WebGLProgram;

  private _textures: { [name: string]: ITexture } = {};

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas !== undefined) this.buildShaders(canvas);

    this.renderer = this.renderer.bind(this);
  }

  public buildShaders(canvas: HTMLCanvasElement): void {
    if (!(canvas instanceof HTMLCanvasElement))
      Error("Shader requires an HTML canvas element", true);

    const gl = canvas.getContext("webgl");
    if (this._gl === null)
      Error(
        "Unable to get canvas context. Did you already get a 2D or 3D context from this canvas?",
        true,
      );

    this._gl = gl;

    // create a vertex shader
    const vs = this._gl.createShader(this._gl.VERTEX_SHADER);
    if (vs === undefined) Error("Failed to create vertex shader");
    this._vertexShader = vs;

    const vsErrs = this._compileShader(
      this._gl,
      this._vertexShader,
      defaultVertexShader,
    );
    if (vsErrs) Error("Failed to compile vertex shader");

    // create a fragment shader
    const fs = this._gl.createShader(this._gl.FRAGMENT_SHADER);
    if (fs === undefined) Error("Failed to create fragment shader");

    this._fragmentShader = fs;
    const fsErrs = this._compileShader(
      this._gl,
      this._fragmentShader,
      defaultFragmentShader,
    );
    if (fsErrs) Error("failed to compile vertex shader");

    // create a shader program from vertex and fragment shaders
    this._shaderProgram = this._createShaderProgram(
      this._gl,
      this._vertexShader,
      this._fragmentShader,
    );

    this._bindPositionAttribute(this._gl, this._shaderProgram);
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.useProgram(this._shaderProgram);
    this._gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /**
   * Add a new fragment shader to the shader program
   * @param source - The shader's source code, as a string
   */
  public setShader(source: string, canvas?: HTMLCanvasElement) {
    if (this._gl === undefined) {
      if (canvas === undefined) Error("Need a canvas to add a shader", true);
      else this.buildShaders(canvas);
    }

    const gl = this._gl;

    const errs = this._compileShader(gl, this._fragmentShader, source);
    if (errs) {
      return errs;
    }

    gl.linkProgram(this._shaderProgram);
    if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this._shaderProgram));
      Error("Failed to link program");
    }
  }

  /**
   * Pass a uniform value to the shader progam
   * @param name - the variable's name, starting with u_ by convention
   * @param value - the value to pass
   */
  public setUniform(name: string, value: UniformValue) {
    const location = this._gl.getUniformLocation(this._shaderProgram, name);
    if (location === null) {
      Error(`Uniform location for ${name} not found`);
    }

    if (typeof value === "number") {
      this._gl.uniform1f(location, value);
      return;
    }

    switch (value.length) {
      case 2:
        this._gl.uniform2fv(location, value);
        break;
      case 3:
        this._gl.uniform3fv(location, value);
        break;
      case 4:
        this._gl.uniform4fv(location, value);
        break;
    }
  }

  /**
   * Pass a texture to the shader as a uniform value
   * @param name - the texture's name, starting with u_ by convention
   * @param image - the texture, as an image
   */
  public setTexture(name: string, image: HTMLImageElement) {
    const gl = this._gl;

    let t = this._textures[name];
    if (!t) {
      const glTexture = gl.createTexture();
      if (!glTexture) {
        Error(`unable to create glTexture`);
      }
      t = {
        glTexture,
        unit: this._lowestUnused(
          Object.keys(this._textures).map(k => this._textures[k].unit),
        ),
      };
      this._textures[name] = t;
    }

    gl.activeTexture(gl.TEXTURE0 + t.unit);
    gl.bindTexture(gl.TEXTURE_2D, t.glTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const location = gl.getUniformLocation(this._shaderProgram, name);
    if (location === null) {
      Error(`uniform location for texture ${name} not found`);
    }
    gl.uniform1i(location, t.unit);
  }

  /**
   * Pass a texture to the shader as a uniform value
   * @param name - the texture's name, starting with u_ by convention
   * @param image - the texture, as an image
   */
  public renderer(state: RendererPayload) {
    if (this._gl === undefined) {
      this.buildShaders(state.glCanvas);
    }

    // pass the uniforms
    this.setUniform("u_resolution", [
      state.glCanvas.width,
      state.glCanvas.height,
    ]);

    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }

  private _compileShader(
    gl: WebGLRenderingContext,
    shader: WebGLShader,
    source: string,
  ) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return;
    }
    const info = gl.getShaderInfoLog(shader);
    if (!info) {
      Error("failed to compile, but found no error log");
    }
    console.error(info);
    return this._parseErrorMessages(info);
  }

  private _createShaderProgram(
    gl: WebGLRenderingContext,
    vs: WebGLShader,
    fs: WebGLShader,
  ): WebGLProgram {
    const program = gl.createProgram();
    if (program === null) {
      Error("failed to create shader program");
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      console.error(info);
      Error("failed to link program");
    }

    return program;
  }

  private _bindPositionAttribute(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const positions = new Float32Array([
      -1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
  }

  private _parseErrorMessages(msg: string): IShaderErrorMessage[] {
    const errorRegex = /^ERROR: \d+:(\d+).*$/gm;
    const messages = [];

    let match = errorRegex.exec(msg);
    while (match) {
      messages.push({
        text: match[0],
        lineNumber: parseInt(match[1], 10),
      });

      // Look for another error:
      match = errorRegex.exec(msg);
    }

    return messages;
  }

  // http://wiki.c2.com/?ShlemielThePainter
  private _lowestUnused(xs: number[]): number {
    let unused = 0;
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] === unused) {
        unused++;
        i = -1; // go back to the beginning
      }
    }
    return unused;
  }
}
