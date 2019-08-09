# RenderQueue

For an overview and use cases, see [the guide](/render-queue.md).
<hr>

## constructor()

Create a new RenderQueue. 

```js
const rq = new V4.RenderQueue();
```

#### Syntax 

> `RenderQueue()`


#### Returns

| Type  | Description  |  
|-------|------------|
|  `V4.RenderQueue` | The new render queue object.  | 

`V4.RenderQueue()` is defined in [src/RenderQueue.ts](https://github.com/rainflame/V4.js/blob/master/src/RenderQueue.ts)
<hr>

## push()

Add a renderer to the end of the queue. 

```js
rq.push(shader);
```

#### Syntax 

> `RenderQueue.push(renderer)`


#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `renderer`  |  `RendererPayload->void` or `V4.Shader` or `V4.TextBox`| Yes  | A [renderer function](/reference/renderer.md) or [Shader](/reference/shader.md) or [TextBox](/reference/text-box). | 

#### Returns

| Type  |
|-------|
|  `void` |

`V4.RenderQueue.push()` is defined in [src/RenderQueue.ts](https://github.com/rainflame/V4.js/blob/master/src/RenderQueue.ts)
<hr>

## pop()

Remove the top renderer from the queue.

```js
rq.pop();
```

#### Syntax 

> `RenderQueue.pop()`

#### Returns

| Type  |
|-------|
|  `void` |

`V4.RenderQueue.pop()` is defined in [src/RenderQueue.ts](https://github.com/rainflame/V4.js/blob/master/src/RenderQueue.ts)
<hr>


## renderer()

Render all the render functions in the queue.

```js
loop.addToLoop(rq.renderer);
```

#### Syntax 

> `RenderQueue.renderer(state)`


#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `state`  |  `V4.RendererPayload`| Yes  | The current animation state. | 

#### Returns

| Type  | 
|-------|
|  `void` | 

`V4.RenderQueue.renderer()` is defined in [src/RenderQueue.ts](https://github.com/rainflame/V4.js/blob/master/src/RenderQueue.ts)
<hr>


