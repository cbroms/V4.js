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

// words, times, easings, and options the text box will loop through
const words = ["Hello,", "this is", "a test of", "V4.js!"];
const times = [3, 2, 2, 4];
const easings = [
  "easeInOutSine",
  "easeInOutSine",
  "easeInOutSine",
  "easeInOutSine",
];
const opts = [
  { position: { x: 0, y: h / 2 + 150 } },
  { position: { x: 100, y: h / 2 + 150 } },
  { position: { x: 200, y: h / 2 + 150 } },
  { position: { x: 300, y: h / 2 + 150 } },
];

const loop = new V4.Loop(canvas);
const fg = new V4.FontGroup();
const rq = new V4.RenderQueue();
loop.addToLoop(rq);

const start = async () => {
  // load the font
  await fg.loadFont("assets/Orbitron-Black.ttf", "Black");

  // background text
  const tb = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 0, y: h / 2 + 150 },
    size: { h: 300, w: 500 },
    fontSize: 72,
    color: "white",
    backgroundColor: "grey",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER",
  });

  let pos = 0;

  const animate = () => {
    // set the new text and create the next animation
    tb.text(words[pos]);
    const anim = new V4.Animation(tb, opts[pos], times[pos], easings[pos]);

    // add the animation to the queue and repeat on done
    rq.push(anim.renderer, () => {
      if (pos + 1 === words.length) pos = 0;
      else pos++;
      animate();
    });
  };

  animate();

  loop.framesPerSecond(60);
  loop.startLoop();
};

start();
