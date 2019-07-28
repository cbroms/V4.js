# Text

V4 provides a rich text rendering system built on [opentype.js](https://github.com/opentypejs/opentype.js). There are two main classes: `FontGroup` for loading fonts and `TextBox` for rendering text. 

> Be sure to include opentype.js in your project if you plan to use text. See [the installation instructions](installing.md?id=as-a-script).

### Fonts

The `FontGroup` class holds a font and its variants, such as _Italic_, **Bold**, Regular, and so on. V4 reads these variants from individual `.ttf` font files.

A font group is created like this:

```js
const fontObj = new V4.FontGroup("Crimson Text");
await fontObj.loadFont(
  "assets/CrimsonText-Regular.ttf", // path to the font file
  "Regular", // font variant
);
```

> Note that loading a font with `loadFont` is asyncronous, so be sure to wrap the function call in an async function. 

More variants can be added to the same object:

```js
await fontObj.loadFont("assets/CrimsonText-Italic.ttf", "Italic");
```

To access a particular font, it can be grabbed from the font group with `getFontVariant`:

```js
const font = fontObj.getFontVariant("Regular");
```

This returns an opentype `Font` object. 

### The Text Box

To create text with V4, we use the `TextBox` object. It functions much like a text box in any graphics editor that you might be familiar with; it has properties such as a position, size, font, and font size.

A text box can be instantiated like this:

```js
const tb = new V4.TextBox({
  font: font,
  fontSize: 24,
  position: { x: 0, y: 250 },
  size: { h: 250, w: 400 },
});
```

The options that can be passed to the `TextBox` are inspired by css. You can find all possible options in the [TextBox reference](/reference/text-box.md).

Adding text is just as easy:

```js
tb.text("Hello, world!");
```

To render, we'll need a renderer. Instead of writing one from scratch, as we did in the [renderer section](guide/renderers.md), the `TextBox` comes with its own pre-implemented renderer, `TextBox.renderer`.


The text box's renderer is much the same as any other renderer; it takes a `state` argument and draws to the canvas with context. You can find the implementation in the [TextBox source code](https://github.com/cbroms/V4.js/blob/master/src/TextBox.ts).

As before, we add the renderer to the loop to draw to the canvas:

```js
loop.addToLoop(tb.renderer);
```

[](https://V4.rainflame.com/_media/intro ':include :type=iframe width=100% height=250px')

> The full source code for this example can be [found here](https://github.com/rainflame/V4.js/tree/master/docs/_media/intro/)

