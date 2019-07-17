# Renderer

For an overview and use cases, see [the guide](/guide/renderers.md).

A renderer is any function that takes a state argument, and modifies the canvas' context.

```javascript
const basicRenderer = state => {
  state.context.fillRect(0, 0, 25, 25);
};
```

The state argument is of type `RendererPayload` and includes the following fields:

- `HTMLCanvasElement`canvas: the canvas being drawn to.
- `CanvasRenderingContext2D` context: the canvas' rendering context.
- `func` hasContext: does the canvas have a context?
- `func` hasCanvas: does the canvas exist?
- `number`deltaTime: the time since last fame update.
- `number` frameCount: the number of frames since start.
- `number` startTime: the start time.
- `number` fps: current interval frames per second.

`V4.RendererPayload` is defined in [src/RendererPayload.ts](https://github.com/rainflame/V4.js/blob/master/src/RendererPayload.ts)
