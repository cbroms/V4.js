# V4.js

V4.js is a lightweight 2D animation wrapper for the HTML canvas element with an emphasis on text.

## Install

```shell
npm i v4
```

## Hello, world!

You'll need a `<canvas>` element:

```html
<canvas id="myCanvas" height="250px" width="400px"></canvas>
```

This script will draw to the canvas using V4's `TextBox`.

```javascript
const V4 = require("v4");

// grab the canvas from the DOM
const canvas = document.getElementById("myCanvas");

// create a V4 Loop from the canvas
const loop = new V4.Loop(canvas);

// load a font
const font = new V4.FontGroup();
font.loadFont("assets/CrimsonText-Regular.ttf", "Crimson Text", "Regular");

// create a V4 TextBox
const box = new V4.TextBox({
    font: font,
    position: { x: 0, y: 250 },
    verticalAlign: "CENTER",
    horizontalAlign: "CENTER",
    fontSize: 24
});
box.text("Hello, world!");

// add the TextBox's renderer to the loop
loop.addToLoop(box.renderer);
```


