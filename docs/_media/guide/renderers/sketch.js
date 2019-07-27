const canvas = document.getElementById("testCanvas");

const canvasWidth = 500;
canvas.height = 250;
canvas.width = canvasWidth;

const start = async () => {
  const loop = new V4.Loop(canvas);
  /// [demo]
  let x = 0;
  let speed = 60;

  const animRectRenderer = state => {
    // reverse the direction when the box reaches an edge
    if (x + 100 > canvasWidth || x < 0) speed *= -1;

    // increment the x position
    x += speed * state.deltaTime;

    const ctx = state.context;
    ctx.fillStyle = "red";
    ctx.fillRect(x, 20, 100, 200);
    ctx.stroke();
  };

  loop.addToLoop(animRectRenderer);
  /// [demo]
  loop.startLoop();
};

start();
