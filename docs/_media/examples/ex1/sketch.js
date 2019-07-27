const canvas = document.getElementById("testCanvas");
const w = 600;
const h = 400;

const bw = 90;
const bh = 70;

let x = 300;
let y = bh + 4;
let xMag = 150;
let yMag = 150;

const start = async () => {
  const loop = new V4.Loop(canvas, true);
  const fg = new V4.FontGroup();
  await fg.loadFont("assets/Orbitron-Black.ttf", "Black");
  const tbBack = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 0, y: h },
    size: { h: h, w: w },
    fontSize: 72,
    backgroundColor: "transparent",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER",
  });

  tbBack.text("V4.js");
  loop.addToLoop(tbBack.renderer);

  const tb = new V4.TextBox({
    font: fg.getFontVariant("Black"),
    position: { x: 300, y: 0 },
    size: { h: bh, w: bw },
    backgroundColor: "blue",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER",
  });
  tb.text("V4");

  const vhs = new V4.Shader(loop.glCanvas);
  vhs.useCanvasState(true);

  vhs.setShader(`
                precision mediump float;

                uniform sampler2D u_texture;
                uniform vec2 u_resolution;
                uniform float u_deltaTime;
                float rand(vec2 co){
                  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }
                void main() {
                    vec4 col = vec4(0);
                    vec2 uv = gl_FragCoord.xy / u_resolution;
                      
               
                    uv.x = uv.x+(rand(vec2(u_deltaTime,gl_FragCoord.y))-0.5)/128.0;
 
                    uv.y = uv.y+(rand(vec2(u_deltaTime))-0.5)/128.0;

                    col = col + (vec4(-0.5)+vec4(rand(vec2(gl_FragCoord.y,u_deltaTime)),rand(vec2(gl_FragCoord.y,u_deltaTime+1.0)),rand(vec2(gl_FragCoord.y,u_deltaTime+2.0)),0))*0.1;
   

                    vec3 tex = texture2D(u_texture, uv).rgb;
                    gl_FragColor = col + vec4(tex, 1.0);
                }
            `);

  const randomBlue = () => {
    const blue = Math.floor(Math.random() * 180) + 75;
    const blueInv = 255 - blue;
    tb.options({ backgroundColor: `rgb(0, 0, ${blue})` });
    loop.backgroundColor(`rgb(0, 0, ${blueInv})`);
  };

  const bounceRenderer = state => {
    if (x + bw >= w || x <= 0) {
      xMag *= -1;
      x += xMag * state.deltaTime;
      randomBlue();
    } else if (y >= h || y <= bh) {
      yMag *= -1;
      y += yMag * state.deltaTime;
      randomBlue();
    }

    x += xMag * state.deltaTime;
    y += yMag * state.deltaTime;

    tb.options({ position: { x, y } });
    tb.renderer(state);
  };

  loop.addToLoop(bounceRenderer);
  loop.addToLoop(vhs);
  loop.framesPerSecond(60);
  loop.startLoop();
};

start();

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
