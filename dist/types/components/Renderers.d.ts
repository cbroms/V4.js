import { RendererPayload } from "./RendererPayload";
/**
 * The default background renderer function
 * @param {object} state - the current state of the animation
 */
export declare const backgroundRenderer: (state: RendererPayload) => void;
/**
 * Renderer that clears previous canvas
 * @param {object} state - the current state of the animation
 */
export declare const clearPrevRenderer: (state: RendererPayload) => void;
