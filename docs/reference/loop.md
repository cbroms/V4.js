# Loop

For an overview and use cases, see [the guide](/loop.md).
<hr>

## constructor()

Create a new Loop. 

!> If you are going to be using [WebGL shaders](/reference/shader.md), ensure that the `webGl` field in the options is `true`, as it is not enabled by default. 

```js
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas, { backgroundColor: "#fff", webGl: true });
```

#### Syntax 

> `Loop(canvas, opts)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `canvas`  |  `HTMLCanvasElement` | Yes  | An HTML canvas.  | 
| `opts`  |  `dict` | No  | Loop options. See below for fields. | 


#### Returns

| Type  | Description  |  
|-------|------------|
|  `V4.Loop` | The new loop object.  | 

By default, the options are initialized with the following values:

```js
const opts = {
    backgroundColor: "#000",
    webGl: false 
};
```

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
| `renderer`  |  `RendererPayload->void` or `V4.RenderQueue` or `V4.Shader` or `V4.TextBox`| Yes  | A [renderer function](/reference/renderer.md) or [RenderQueue](/reference/render-qeue.md) or [Shader](/reference/shader.md) or [TextBox](/reference/text-box). | 

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