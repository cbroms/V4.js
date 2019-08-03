# Loop

For an overview and use cases, see [the guide](/guide/loop.md).
<hr>

## constructor()

Create a new Loop. If you are going to be using [WebGL shaders](/reference/shader.md), ensure that the `webGl` parameter is `true`, as it is not enabled by default. 

```js
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas);
```

#### Syntax 

> `Loop(canvas, webGl)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `canvas`  |  `HTMLCanvasElement` | Yes  | An HTML canvas.  | 
| `webGl`  |  `bool` | No  | Create a WebGL canvas instance?  | 


#### Returns

| Type  | Description  |  
|-------|------------|
|  `V4.Loop` | The new loop object.  | 

`V4.Loop()` is defined in [src/Loop.ts](https://github.com/rainflame/V4.js/blob/master/src/Loop.ts)
<hr>

## addToLoop()

Add a [renderer](/reference/renderer.md) or [RenderQueue](/reference/render-qeue.md) to the Loop.

```js
const basicRenderer = state => {
  state.context.fillRect(0, 0, 25, 25);
};

loop.addToLoop(basicRenderer);
```
#### Syntax 

> `Loop.addToLoop(renderer)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `renderer`  |  `RendererPayload->void` or `V4.RenderQueue` or `V4.Shader`| Yes  | A [renderer function](/reference/renderer.md) or [RenderQueue](/reference/render-qeue.md) or [Shader](/reference/shader.md). | 

#### Returns

| Type  |
|-------|
|  `void` |

`V4.Loop.addToLoop()` is defined in [src/Loop.ts](https://github.com/rainflame/V4.js/blob/master/src/Loop.ts)
<hr>


## framesPerSecond()

Set the loop's target FPS.

```js
const fps = loop.framesPerSecond(60);

console.log(fps); // > 60
```
#### Syntax 

> `Loop.framesPerSecond(fps)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `fps`  |  `Number`| No  | The loop's target FPS. | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `Number` | The loop's target FPS. | 

`V4.Loop.framesPerSecond()` is defined in [src/Loop.ts](https://github.com/rainflame/V4.js/blob/master/src/Loop.ts)