# Loop

For an overview and use cases, see [the guide](/guide/loop.md).

## constructor()

Create a new Loop.

```javascript
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas);
```

**Arguments**

- `HTMLCanvasElement` canvas: an HTML canvas.

**Returns**

- `Loop` The new Loop object

`V4.Loop()` is defined in [src/Loop.ts](https://github.com/rainflame/V4.js/blob/master/src/Loop.ts)

## addToLoop()

Add a [renderer](/reference/renderer.md) or [RenderQueue](/reference/render-qeue.md) to the Loop.

```javascript
const basicRenderer = state => {
  state.context.fillRect(0, 0, 25, 25);
};

loop.addToLoop(basicRenderer);
```

**Arguments**

- `func` renderer: A [renderer function](/reference/renderer.md).

**Returns**

- `void`

`V4.Loop.addToLoop()` is defined in [src/Loop.ts](https://github.com/rainflame/V4.js/blob/master/src/Loop.ts)
