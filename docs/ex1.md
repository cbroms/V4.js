# Text and Shaders

[](https://V4.rainflame.com/_media/examples/ex1 ':include :type=iframe width=100% height=400px')

This example uses text boxes and a fragment shader. It shows how a shader can modify the canvas by accessing the current canvas state as a `texture2D` in GLSL, [enabled through `Shader.useCanvasState`](reference/shader.md?id=usecanvasstate). This allows for drawing to a canvas with a 2D context *and* editing it in a shader, effectively using the canvas in both a 2D and WebGL context, not possible outside V4. 

<!--
[](_media/examples/ex1/sketch.js ':include :type=code :fragment=demo')

The fragment shader looks like this:

[](_media/examples/ex1/vhsFilter.glsl ':include :type=code :fragment=demo')

-->

> The full source code for this example can be [found here](https://github.com/rainflame/V4.js/tree/master/docs/_media/examples/ex1)



