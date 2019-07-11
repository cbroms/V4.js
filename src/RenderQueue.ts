type Renderer = { (rendererPayload: object): void };

export class RenderQueue {
    public length: number;
    public rendererBuffer: Renderer[];
    constructor() {
        this.length = 0;
        this.rendererBuffer = [];
    }
}
