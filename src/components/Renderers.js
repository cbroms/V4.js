/**
 * The default background renderer function
 * @param {object} state - the current state of the animation
 */
export const backgroundRenderer = state => {
    if (state.hasCanvas && state.hasCanvas) {
        state.context.fillStyle = state.backgroundColor;
        state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
    }
};
