import { RendererPayload } from "./RendererPayload";

type Renderer = (rendererPayload: object) => boolean;
type OnDone = () => void;

interface IQueuePacket {
    r: Renderer;
    d: OnDone;
}

/**
 * @exports V4.RenderQueue
 * @class
 */
export class RenderQueue {
    private _rendererBuffer: IQueuePacket[];

    /**
     * Create a new render queue
     * @returns - the new RenderQueue object
     */
    constructor() {
        this._rendererBuffer = [];
    }

    /**
     * Add a renderer and on done function to the end of the queue
     * @param renderer - a renderer function to be excecuted in the loop
     * @param onDone - a function that will be called when the renderer function returns false
     */
    public push(renderer: Renderer | Renderer[], onDone?: OnDone) {
        let done = () => {};
        if (onDone !== undefined) {
            done = onDone;
        }

        if (Array.isArray(renderer)) {
            let first = true;
            for (const renderFn of renderer as Renderer[]) {
                const renderPacket = { r: renderFn, d: first ? done : () => {} };
                this._rendererBuffer.push(renderPacket);

                if (first) first = false;
            }
        } else {
            const renderPacket = { r: renderer as Renderer, d: done };
            this._rendererBuffer.push(renderPacket);
        }
    }

    /**
     * Remove the last renderer and done function packet from the queue
     * @returns - a packet containing the the renderer and done functions
     */
    public pop() {
        return this._rendererBuffer.shift();
    }

    /**
     * The renderer for the queue- calls all render functions in the queue
     * @param state - the current state of the render loop
     */
    public render(state: RendererPayload) {
        const ogLen = this._rendererBuffer.length;
        for (let i = 0; i < ogLen; i++) {
            const packet = this.pop();

            // excecute the render function
            const res = packet.r(state);

            if (res !== undefined && !res) {
                // renderer is complete, call on done function
                packet.d();
            } else {
                this._rendererBuffer.push(packet);
            }
        }
    }
}
