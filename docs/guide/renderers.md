# Renderers

Renderers are the basis of all animations in V4. They are functions that directly manipulate the HTML canvas element using `context`, just as you would when working with the canvas normally using the [canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

A good way to think about renderers is as a functions for creating a single image frame in an animation. For example, suppose we wanted to draw a red rectangle to the canvas. We might create a renderer like this:

```javascript
const rectRenderer = state => {
  const ctx = state.context;
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, 100, 200);
};
```

We're using the canvas' `context` to draw a red rectangle, in this case with `fillRect`, a built in function from the canvas API. You can use [any function natively supported](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Reference) by the browser here.

Renderers are more useful than just drawing with the canvas API because they can be passed to V4's loop to create animations. The loop runs a number of times per second (30 by default), and calls any renderer you pass it.

### State

Notice that the renderer is passed an argument called `state`. This is an object that contains a number of useful properties for animating and drawing to the canvas. Possibly the two most important are `context` and `deltaTime`.

The `context` is the interface provided by the canvas API to draw; it is how all shapes are drawn to the canvas.

The `deltaTime` is the basis for all animation done in V4. It contains the time passed since the last frame in the loop.

### Simple Animation

Using just these two properties, we can begin to create animations. Let's take the above renderer and add some movement.

We can keep track of the rectangle's `x` position and increment `x` by the distance we want it to move, found by multiplying the `speed` (distance in pixels traveled per second) by the `deltaTime` (the time passed since the last frame):

```javascript
let x = 20;
let speed = 5;

const animRectRenderer = state => {
  const ctx = state.context;
  x += speed * state.deltaTime;
  ctx.rect(x, 20, 100, 200);
  ctx.stroke();
};
```
