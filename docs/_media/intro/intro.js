const canvas = document.getElementById("testCanvas");
canvas.height = 250;
canvas.width = 500;

// V4 loads fonts asyncronously, so we enclose the
// initialization process in an async function
const start = async () => {
  const loop = new V4.Loop(canvas);
  const font = new V4.FontGroup();
  await font.loadFont("assets/CrimsonText-Regular.ttf", "Regular");

  const box = new V4.TextBox({
    font: font.getFontVariant("Regular"),
    position: { x: 0, y: 250 },
    size: { h: 250, w: 500 },
    verticalAlign: "CENTER",
    horizontalAlign: "CENTER",
    fontSize: 72,
    color: "white",
    backgroundColor: "black",
  });
  box.text("Hello, world!");

  loop.addToLoop(box.renderer);
  loop.startLoop();
};

start();
