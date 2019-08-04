# The Loop

All animations in V4 are executed through the loop. This is a recursive function that runs infinitely, or until the user stops it. The loop can run at a specified frame rate, set lower to improve performance or higher to create smoother animations.

A loop is initialized with a canvas element and options:

```js
const canvas = document.getElementById("testCanvas");
const loop = new V4.Loop(canvas, { backgroundColor: "white" });

loop.framesPerSecond(60);
```

All the options for the loop can be found [in the reference](/reference/loop). One particularily important one is `webGl`. If you plan to use shaders, this field must be `true`. It will create a second canvas to handle WebGL related drawing. 

The loop is started with:

```js
loop.startLoop();
```

If you're familiar with p5.js, the loop is similar to the `draw` function. Instead of filling the loop with a large block of code to excecute as you might with the `draw` function, V4 uses functions called `renderers` to modularize the rendering process. These functions are passed to the loop to be excecuted on each update. 

In general, adding one to the loop to draw looks like this:

```js
loop.addToLoop(theThingToRender);
```
where `theThingToRender` is a function. We'll explore how to write these renderer functions in the next section. 
