# The Loop

All animations in V4 are executed through the loop. This is a recursive function that runs infinitely, or until the user stops it. The loop can run at a specified frame rate, set lower to improve performance or higher to create smoother animations.

A loop is initialized with a canvas element:

```javascript
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas);

loop.framesPerSecond(60);
```

The loop is started with:

```javascript
loop.startLoop();
```

In the example above, nothing will appear on screen, as we have not provided the loop with anything to render. For this, we'll need _renderers_, which will be introduced in the next section.
