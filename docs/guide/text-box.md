# Text Boxes

To create text with V4, we use the `TextBox` object. It functions much like a text box in any graphics editor that you might be familiar with. It has properties such as a position, size, font, and font size. We can instantiate a `TextBox` like this:

```javascript
const tb = new V4.TextBox({
  font: font,
  fontSize: 24,
  position: { x: 0, y: 250 },
  size: { h: 250, w: 400 },
});
```

Adding text is just as easy:

```javascript
tb.text("Hello, world!");
```

To render, we'll need a renderer. Instead of writing one from scratch, as we did in the [Renderer](guide/renderers.md) section, the `TextBox` comes with its own pre-implemented renderer. It can be acessed like this:

```javascript
const renderer = tb.renderer;
```

The `TextBox`'s renderer is much the same as any other renderer: it takes a `state` argument and draws to the canvas with context. You can find the implementation in the [TextBox source code](https://github.com/cbroms/V4.js/blob/master/src/TextBox.ts).

As before, we add the renderer to the loop to draw to the canvas:

```javascript
loop.addToLoop(tb.renderer);
```
