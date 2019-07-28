/// [demo]
const canvas = document.getElementById("testCanvas");
// canvas size
const w = 600;
const h = 400;
// textbox size
const bw = 90;
const bh = 70;
// positioning variables
let x = 300;
let y = bh + 4;
let xMag = 150;
let yMag = 150;

const loop = new V4.Loop(canvas, true);

const start = async () => {
  // load the font
  const fg = new V4.FontGroup();
  await fg.loadFont("assets/Orbitron-Black.ttf", "Black");

  // background text
  const tbBack = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 0, y: h },
    size: { h: h, w: w },
    fontSize: 72,
    color: "white",
    backgroundColor: "transparent",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER",
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

  // load and set the shader
  const sr = new V4.Shader(loop.glCanvas);
  sr.useCanvasState(true);
  const shader = await sr.loadShader("vhsFilter.glsl");
  sr.setShader(shader);
  loop.addToLoop(sr);

  // set the textbox and canvas colors to be a random blue shade
  const randomBlue = () => {
    const blue = Math.floor(Math.random() * 180) + 75;
    const blueInv = 255 - blue;
    tb.options({ backgroundColor: `rgb(0, 0, ${blue})` });
    loop.backgroundColor(`rgb(0, 0, ${blueInv})`);
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
/// [demo]

// let hd = true; // true -> right, false -> left
//  let vd = true; // true -> bottom, false -> top

//  let ogPos = { x: 300, y: 0 };
//  let destPos;

//  const setNextPos = () => {
//    if (hd && vd) {
//      hd = false;
//      destPos = { x: w - bw, y: w - ogPos.x };
//    } else if (!hd && vd) {
//      vd = false;
//      destPos = { x: h - ogPos.y, y: h };
//    } else if (!hd && !vd) {
//      hd = true;
//      destPos = { x: 0, y: h - ogPos.x };
//    } else if (hd && !vd) {
//      vd = true;
//      destPos = { x: ogPos.y, y: bh };
//    }
//    return new V4.Animation(tb, { position: destPos }, 2, "easeInSine");
//  };

//  function positionLoop() {
//    const anim = setNextPos();
//    rq.push(anim.renderer, () => {
//      ogPos = destPos;
//      positionLoop();
//    });
//  }

//  positionLoop();
