const canvas = document.getElementById("testCanvas");
canvas.height = 250;
canvas.width = 500;

// V4 loads fonts asyncronously, so we enclose the
// initialization process in an async function
const start = async () => {
  // create a loop from the canvas
  const loop = new V4.Loop(canvas);

  // load a font
  const font = new V4.FontGroup();
  await font.loadFont("assets/CrimsonText-Regular.ttf", "Regular");

  // create a TextBox
  const box = new V4.TextBox({
    font: font.getFontVariant("Regular"),
    position: { x: 0, y: 250 },
    size: { h: 250, w: 500 },
    verticalAlign: "CENTER",
    horizontalAlign: "CENTER",
    fontSize: 24,
    color: "white",
    backgroundColor: "black",
  });
  box.text("Hello, world!");

  // add the TextBox's renderer to the loop
  loop.addToLoop(box.renderer);

  loop.startLoop();
};

start();
