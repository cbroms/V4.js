# The Loop

All animations in V4 are executed through the loop. This is a recursive function that runs infinitely, or until the user stops it. The loop can run at a specified frame rate, set lower to improve performance or higher to create smoother animations.

A loop is initialized with a canvas element:

```js
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas);

loop.framesPerSecond(60);
```

The loop is started with:

```js
loop.startLoop();
```

If you're familiar with p5.js, the loop is similar to the `draw` function. Instead of filling the loop with a large block of code to excecute as you might with the `draw` function, V4 uses functions called `renderers` to modularize the rendering process. These functions are passed to the loop to be excecuted on each update. We'll explore how to use them in the next section. 
