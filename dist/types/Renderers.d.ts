import { RendererPayload } from "./RendererPayload";
/**
 * The default background renderer function
 * @param state - the current state of the animation
 */
export declare const backgroundRenderer: (state: RendererPayload) => void;
/**
 * Renderer that clears previous canvas
 * @param state - the current state of the animation
 */
export declare const clearPrevRenderer: (state: RendererPayload) => void;
