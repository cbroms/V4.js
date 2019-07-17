# TextBox

For an overview and use cases, see [the guide](/guide/text.md?id=the-text-box).

## constructor()

Create a new TextBox.

```javascript
const tb = new V4.TextBox({ fontSize: 24, position: { x: 0, y: 250 } });
```

**Arguments**

- `dict` opts (optional): a dictionary containing style options. See below for fields.

**Returns**

- `TextBox` The new TextBox object

By default, the options are initialized with the following values:

```javascript
const opts = {
  backgroundColor: "black",
  bounds: { x1: 0, x2: 0, x3: 0, x4: 0, y1: 0, y2: 0, y3: 0, y4: 0 },
  color: "white",
  font: null,
  fontSize: 24,
  horizontalAlign: "RIGHT", // must be RIGHT, LEFT, or CENTER
  lineHeight: 8,
  position: { x: 0, y: 0 },
  size: { h: 0, w: 0 },
  stroke: false,
  strokeColor: "white",
  strokeWidth: 0,
  verticalAlign: "BOTTOM", // must be TOP, BOTTOM, or CENTER
};
```

> Note that all measurements are in pixels and all colors can be any valid css color value (hex, rgba, etc.)

`V4.TextBox()` defined in [src/TextBox.ts](https://github.com/rainflame/V4.js/blob/master/src/TextBox.ts)

## options()

Get/set the TextBox's options.

```javascript
const newOpts = tb.options();

newOpts.fontSize = 72;

tb.options(newOpts);
```

**Arguments**

- `dict` opts (optional): a dictionary containing style options.

**Returns**

- `dict` The TextBox's style options.

`V4.TextBox.options()` defined in [src/TextBox.ts](https://github.com/rainflame/V4.js/blob/master/src/TextBox.ts)

## text()

Get/set the TextBox's text value.

```javascript
const content = tb.text("This is some text?!");

console.log(content); // > This is some text?!
```

**Arguments**

- `string` newText (optional): the text to appear in the TextBox

**Returns**

- `string` the TextBox's current text.

`V4.TextBox.text()` defined in [src/TextBox.ts](https://github.com/rainflame/V4.js/blob/master/src/TextBox.ts)

## renderer()

Draw the TextBox to the canvas. Add this function to a [Loop](/reference/loop.md) or [RenderQueue](/reference/render-queue.md)

```javascript
loop.addToLoop(tb.renderer);
```

**Arguments**

- `dict` state: the current state of the loop, a RendererPayload.

**Returns**

- `void`

`V4.TextBox.renderer()` defined in [src/TextBox.ts](https://github.com/rainflame/V4.js/blob/master/src/TextBox.ts)
