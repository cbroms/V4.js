# V4.js

V4.js is a lightweight 2D animation wrapper for the HTML canvas element with an emphasis on text.

## Install

```
npm i v4
```

## A Simple Example

You'll need a `<canvas>` element:

```html
<canvas id="myCanvas"></canvas>
```

Import V4.js and create a new animator from your canvas:

```javascript
const V4 = require("v4");

const canvas = document.getElementById("myCanvas");
const animator = new V4.animator(canvas);
```

Your canvas can now be accessed through the animator object's `canvas` property:

```javascript
animator.canvas.height = 500;
animator.canvas.width = 800;
```

V4 uses functions called 'renderers' to draw to the canvas. Let's create a simple one now:

```javascript
function rectangleRenderer(state) {
    state.context.rect(20, 20, 100, 200);
    state.context.stroke();
}
```

Renderers are called on each animation frame to draw to the canvas. They take an argument called the `state`-- an object containing information about the current animation cycle and canvas. In the code snippet above, we're making use of the `context` property from `state` to draw to the canvas. You'll find that the `state` contains lots of useful information for animating objects.

Next, we need to add the rectangle renderer function to the animation:

```javascript
animator.addToAnimation(rectangleRenderer);
```

Now, each time the canvas is updated (30 times per second by default), our renderer will be called and the code inside will draw a rectangle to the canvas. Let's start the animation:

```javascript
animator.startAnimationLoop();
```

There's no movement because the renderer we provided does not change the position of the rectange over time. To move it across the screen, we can keep track of its `x` position and increment `x` by the distance we want it to move, found by multiplying the speed by the deltaTime (the time passed since the last frame):

```javascript
let x = 20;
let speed = 5;

function rectangleRenderer(state) {
    x += speed * state.deltaTime;
    state.context.rect(x, 20, 100, 200);
    state.context.stroke();
}
```

Now, the rectangle moves across the screen.
