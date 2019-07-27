const V4 = require("v4");

// V4 loads fonts asyncronously, so we enclose the
// initialization process in an async function
const start = async () => {
  const canvas = document.getElementById("testCanvas");
  const loop = new V4.Loop(canvas);

  // load a font
  const font = new V4.FontGroup();
  await font.loadFont("assets/CrimsonText-Regular.ttf", "Regular");

  // create a TextBox
  const box = new V4.TextBox({
    font: font.getFontVariant("Regular"),
    position: { x: 0, y: 250 },
    verticalAlign: "CENTER",
    horizontalAlign: "CENTER",
    fontSize: 24,
  });
  box.text("Hello, world!");

  // add the TextBox's renderer to the loop
  loop.addToLoop(box.renderer);
};

start();
