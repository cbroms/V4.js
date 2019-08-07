# Renderer

For an overview and use cases, see [the guide](/guide/renderers.md).
<hr>

A renderer is any function that takes a state argument (provided by the loop), and modifies the canvas' context.

```js
const basicRenderer = state => {
  state.context.fill = "red";
  state.context.fillRect(0, 0, 25, 25);
};
```

All V4 objects that can be added to a loop or render queue have renderers. For example, see [`Shader.renderer`](/reference/shader?id=renderer) or [`TextBox.renderer`](/reference/text-box?id=renderer).

The state argument includes the following fields:


| Property | Type  | Description  |  
|-------|-------|------------|
| `canvas`  |  `HTMLCanvasElement` | The canvas being drawn to.  | 
| `context`  |  `CanvasRenderingContext2D` | The canvas' rendering context.  | 
| `glCanvas`  |  `HTMLCanvasElement` | The WebGL canvas being drawn to, if it exists.  | 
| `glContext`  |  `WebGLRenderingContext` | The canvas' WebGL rendering context, if it exists.  | 
| `webgl`  |  `boolean` | Is the loop WebGL enabled?  | 
| `backgroundColor`  |  `string` | The canvas' background color. | 
| `deltaTime`  |  `number` | The time since last frame update.  | 
| `frameCount`  |  `number` | The number of frames since start.  | 
| `startTime`  |  `number` | The start time.  | 
| `fps`  |  `number` | The current frames per second.  | 
| `loop`  |  `V4.Loop` | The loop.  | 

`V4.RendererPayload` is defined in [src/RendererPayload.ts](https://github.com/rainflame/V4.js/blob/master/src/RendererPayload.ts)
