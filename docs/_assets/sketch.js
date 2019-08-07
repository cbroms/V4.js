const canvas = document.getElementById("testCanvas");
// canvas size
let w, h;

const setSize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
};
window.addEventListener("resize", setSize);
setSize();
// textbox size
const bw = 90;
const bh = 70;
// positioning variables
let x = 5;
let y = bh + 4;
let xMag = 150;
let yMag = 150;

const loop = new V4.Loop(canvas, true);

const start = async () => {
  // load the font
  const fg = new V4.FontGroup();
  await fg.loadFont("_assets/Orbitron-Black.ttf", "Black");

  // background text
  const tbBack = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 0, y: h / 3 },
    size: { h: h / 3, w: w },
    fontSize: 72,
    color: "rgb(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
    horizontalAlign: "CENTER",
    verticalAlign: "BOTTOM",
  });
  tbBack.text("V4.js");
  loop.addToLoop(tbBack.renderer);

  // bouncing text
  const tb = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 300, y: 0 },
    size: { h: bh, w: bw },
    backgroundColor: "blue",
    color: "white",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER",
  });
  tb.text("V4");

  // reset on window resize
  window.addEventListener("resize", () => {
    tbBack.options({ position: { x: 0, y: h / 3 }, size: { h: h / 3, w: w } });
    x = 5;
    y = bh + 4;
    xMag = 150;
    yMag = 150;
    tb.options({ position: { x, y } });
  });

  const rq = new V4.RenderQueue();
  loop.addToLoop(rq);

  const titleLoop = () => {
    const down = new V4.Animation(
      tbBack,
      {
        position: { x: 0, y: h / 3 + 40 },
        color: "rgba(255, 255, 255, 1)",
        fontSize: 82,
      },
      3,
      "easeOutBounce",
    );
    rq.push(down.renderer, () => {
      const up = new V4.Animation(
        tbBack,
        {
          position: { x: 0, y: h / 3 },
          color: "rgba(255, 255, 255, 0.1)",
          fontSize: 72,
        },
        3,
        "easeInCubic",
      );
      rq.push(up.renderer, () => {
        titleLoop();
      });
    });
  };

  titleLoop();

  // set the textbox and canvas colors to be a random blue shade
  const randomBlue = () => {
    const blue = Math.floor(Math.random() * 180) + 75;
    tb.options({ backgroundColor: `rgb(0, 0, ${blue})` });
    loop.backgroundColor(`rgb(0, 0, ${255 - blue})`);
  };

  // the renderer to bounce the textbox around the canvas
  const bounceRenderer = state => {
    if (x + bw >= w || x <= 0) {
      xMag *= -1;
      x += 5 * Math.sign(xMag); // give it a little boost to prevent sticking to side
      randomBlue();
    } else if (y >= h || y <= bh) {
      yMag *= -1;
      y += 5 * Math.sign(yMag);
      randomBlue();
    }
    x += xMag * state.deltaTime;
    y += yMag * state.deltaTime;

    tb.options({ position: { x, y } });
    tb.renderer(state);
  };

  // add the renderer to the loop and start it
  loop.addToLoop(bounceRenderer);
  loop.framesPerSecond(60);
  loop.startLoop();
};

start();
