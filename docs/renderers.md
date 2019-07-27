# Renderers

Renderers are the basis of all animations in V4. They are functions that directly manipulate the HTML canvas element using `context`, just as you would when working with the canvas normally using the [canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). They take an argument called `state` that contains information about the current animation time, canvas context, and more.

A good way to think about renderers is as functions for creating a single image frame in an animation. For example, suppose we wanted to draw a red rectangle to the canvas. We might create a renderer like this:

```js
const rectRenderer = state => {
  const ctx = state.context;
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, 100, 200);
};
```

We're using the canvas' `context` to draw a red rectangle, in this case with `fillRect`, a built in function from the canvas API. You can use [any function natively supported](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Reference) by the browser here.

Renderers are more useful than just drawing with the canvas API because they can be passed to V4's loop to create animations. We add the renderer to the loop to excecute it:

```js
loop.addToLoop(rectRenderer);
```

> When adding a renderer to the loop, keep in mind it can never be removed. For animations it is often best to use the [render queue](render-queue.md), introduced in the next section. 

### State

As briefly mentioned above, a renderer is passed an argument called `state` by the loop. This is an object that contains a number of useful properties for animating and drawing to the canvas. Possibly the two most important are `context` and `deltaTime`.

- The `context` is the interface provided by the canvas API to draw; it is how all shapes are drawn to the canvas.

- The `deltaTime` is the basis for all animation done in V4. It contains the time passed since the last frame in the loop.

For a full list of what's available in state, see the [renderer reference page](/reference/renderer.md).

### Simple Animation

Using just these two properties, we can begin to create animations. Let's take the above renderer and add some movement.

We can keep track of the rectangle's `x` position and increment `x` by the distance we want it to move, found by multiplying the `speed` (distance in pixels traveled per second) by the `deltaTime` (the time passed since the last frame):

[](_media/guide/renderers/sketch.js ':include :type=code :fragment=demo')

Here's what results: 

[](https://V4.rainflame.com/_media/guide/renderers ':include :type=iframe width=100% height=250px')

> The full source code for this example can be [found here](https://github.com/rainflame/V4.js/tree/master/docs/_media/guide/renderers)


