import { RendererPayload } from "./RendererPayload";
declare type Renderer = {
    (rendererPayload: object): boolean;
};
declare type OnDone = {
    (): void;
};
declare type QueuePacket = {
    r: Renderer;
    d: OnDone;
};
/**
 * @exports V4.RenderQueue
 * @class
 */
export declare class RenderQueue {
    private _rendererBuffer;
    /**
     * Create a new render queue
     * @returns - the new RenderQueue object
     */
    constructor();
    /**
     * Add a renderer and on done function to the end of the queue
     * @param renderer - a renderer function to be excecuted in the loop
     * @param onDone - a function that will be called when the renderer function returns false
     */
    push(renderer: Renderer, onDone?: OnDone): void;
    /**
     * Remove the last renderer and done function packet from the queue
     * @returns - a packet containing the the renderer and done functions
     */
    pop(): QueuePacket;
    /**
     * The renderer for the queue- calls all render functions in the queue
     * @param state - the current state of the render loop
     */
    render(state: RendererPayload): void;
}
export {};
