import { RendererPayload } from "./RendererPayload";

/**
 * The default background renderer function
 * @param {object} state - the current state of the animation
 */
export const backgroundRenderer = (state: RendererPayload) => {
    state.context.fillStyle = state.backgroundColor;
    state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
};

/**
 * Renderer that clears previous canvas
 * @param {object} state - the current state of the animation
 */
export const clearPrevRenderer = (state: RendererPayload) => {
    state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
};
