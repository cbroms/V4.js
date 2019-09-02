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

// determine the time the snippet animates based on its length
const makeTime = word => {
  return word.length * 0.05;
};

// determine the size based on the snippet length
const makeSize = word => {
  return word.length * 3;
};

// the snippets the animation will loop through
const words = [
  "An incredible number",
  "of possibilities",
  "are created through",
  "the modular system that",
  "Müller-Brockmann developed,",
  "and the influence",
  "of his work",
  "can be seen in",
  "much graphic",
  "and web design today",
];

const loop = new V4.Loop(canvas);
const fg = new V4.FontGroup();
const rq = new V4.RenderQueue();
loop.addToLoop(rq);

const start = async () => {
  // load the font
  const font = await fg.loadFont("assets/CrimsonText-Regular.ttf");

  // background text
  const tb = new V4.TextBox({
    font: font,
    position: { x: 0, y: h / 2 + 150 },
    size: { h: 300, w: 1000 },
    fontSize: 48,
    color: "white",
    backgroundColor: "transparent",
    horizontalAlign: "LEFT",
    verticalAlign: "CENTER",
  });

  let pos = 0;

  const animate = () => {
    // set the new text and create the next animation
    tb.text(words[pos]);
    const anim = new V4.Animation(
      tb,
      {
        position: { x: pos * 100, y: h / 2 + 150 },
        fontSize: makeSize(words[pos]),
      },
      makeTime(words[pos]),
      "easeInSine",
    );

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
