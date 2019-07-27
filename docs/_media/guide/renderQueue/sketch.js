const canvas = document.getElementById("testCanvas");

const canvasWidth = 500;
canvas.height = 250;
canvas.width = canvasWidth;

const start = async () => {
  const loop = new V4.Loop(canvas);

  /// [demo1]
  let speed = 40;
  let radius = 50;

  const drawCircle = state => {
    radius += speed * state.deltaTime;
    state.context.fillStyle = "white";
    state.context.beginPath();
    state.context.arc(250, 125, radius, 0, 2 * Math.PI);
    state.context.fill();
  };

  const smallToLargeRenderer = state => {
    drawCircle(state);
    if (radius > 200) {
      speed *= -1;
      return false;
    }
  };

  const largeToSmallRenderer = state => {
    drawCircle(state);
    if (radius < 50) {
      speed *= -1;
      return false;
    }
  };
  /// [demo1]

  /// [demo2]
  const rq = new V4.RenderQueue();

  const animate = () => {
    rq.push(smallToLargeRenderer, () => {
      rq.push(largeToSmallRenderer);
      animate();
    });
  };

  animate();

  loop.addToLoop(rq);
  /// [demo2]
  loop.startLoop();
};

start();
