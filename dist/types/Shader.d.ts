import { RendererPayload } from "./RendererPayload";
export interface IShaderErrorMessage {
    text: string;
    lineNumber: number;
}
export declare type UniformValue = number | [number, number] | [number, number, number] | [number, number, number, number];
/**
 * @exports V4.Shader
 * @class
 */
export declare class Shader {
    private _gl;
    private _vertexShader;
    private _fragmentShader;
    private _shaderProgram;
    private _useState;
    private _textures;
    constructor(canvas?: HTMLCanvasElement);
    buildShaders(canvas: HTMLCanvasElement): void;
    /**
     * Load a shader's source code from a file
     * @param url - the file location
     */
    loadShader(url: string): Promise<unknown>;
    /**
     * Add a new fragment shader to the shader program
     * @param source - The shader's source code, as a string
     */
    setShader(source: string, canvas?: HTMLCanvasElement): IShaderErrorMessage[];
    /**
     * Pass a uniform value to the shader progam
     * @param name - the variable's name, starting with u_ by convention
     * @param value - the value to pass
     */
    setUniform(name: string, value: UniformValue): void;
    useCanvasState(useState: boolean): void;
    /**
     * Pass a texture to the shader as a uniform value
     * @param name - the texture's name, starting with u_ by convention
     * @param image - the texture, as an image
     */
    setTexture(name: string, image: ImageBitmap | ImageData): void;
    /**
     * Shader's render function
     * @param state - the renderer payload object
     */
    renderer(state: RendererPayload): void;
    private _compileShader;
    private _createShaderProgram;
    private _bindPositionAttribute;
    private _parseErrorMessages;
    private _lowestUnused;
}
