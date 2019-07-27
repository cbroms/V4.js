# The Render Queue

As noted in the previous section, after adding a renderer to the loop there is no way to remove it. There are plenty of times when this behavior is beneficial, such as when adding a background color, or clearing the previous context. In fact, V4 includes [two renderers in the loop by default](https://github.com/rainflame/V4.js/blob/master/src/Renderers.ts) that do just this. 

However, when animating it is important to be able to control the amount of time a particular animation lasts, as well as the order in which new animations are added. However, simply adding a renderer to the loop does not offer any of these controls. For this, the `RenderQueue` class comes into play. 

The render queue is a wrapper for renderers that allows you to control how long they are included in the loop as well as the order in which they are excecuted. 

Renderers are added to a render queue through the `push` method:

```js
const rq = new V4.RenderQueue()

const rectRenderer = state => {
  state.context.fillStyle = "red";
  state.context.fillRect(20, 20, 100, 200);
};

rq.push(rectRenderer);
```

In order to excecute the functions in the render queue, add it to the loop as you would any other renderer:

```js
loop.addToLoop(rq);
```

### Specifying an OnDone callback

The power of the render queue comes from the ability to add callback functions in addition to renderers. When a renderer function is done, the render queue will excecute a callback function you specify. Here's an example:

```js
const rectRenderer = state => {
    if (duration < 2) {
        state.context.fillStyle = "red";
        state.context.fillRect(20, 20, 100, 200);
    } else {
        return false;
    }
}

rq.push(rectRenderer, () => {
    console.log("done with animation!");
})

loop.addToLoop(rq);
```

There are two changes to note here. First, the renderer has been modified to return `false` after a duration of two seconds. This is what will signal to the render queue that the animation specified in the renderer is complete. 

We are also passing a second function as an argument to `push`. Once `rectRenderer` returns `false` after two seconds, the render queue will excecute the callback and print to the console. 

### Looping example

The render queue makes it very easy to chain together animations in a clear and concise manner. We can create looping animations without much hassle at all. For example, to create circle that infinitely loops from small to large, we write two renderers; one for small to large, and one for large to small:

[](_media/guide/renderQueue/sketch.js ':include :type=code :fragment=demo1')

Next, we infinitely add these renderers to a render queue through a recursive function:

[](_media/guide/renderQueue/sketch.js ':include :type=code :fragment=demo2')

Here's what results: 


[](https://V4.rainflame.com/_media/guide/renderQueue ':include :type=iframe width=100% height=250px')


> The full source code for this example can be [found here](https://github.com/rainflame/V4.js/tree/master/docs/_media/guide/renderQueue)

