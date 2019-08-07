# Shaders

V4 includes a `Shader` class that allows you to use GLSL fragment shaders on the canvas. 

When using shaders, ensure that you have set the `webGl` option in a loop's options to `true`:

```js
const loop = new V4.Loop(canvas, { webGl: true });
```

Now the loop will support WebGL shaders. A shader can be created like so:

```js
const sd = new V4.Shader(loop.glCanvas);
```

Note that the canvas we're passing to the shader is from the `loop`. The V4 Loop creates its own WebGL canvas instance when initialized. You don't need to use this canvas though, any canvas with a WebGL context will work. Using the loop's WebGL canvas ensures that the shader is rendered over the 2D canvas the loop was initialized with. 

### Loading and building the shader 

Now, the shader code. A shader's code can be loaded and set as a string:

```js
const code = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_deltaTime;

void main() {
 vec2 uv = gl_FragCoord.xy / u_resolution;
 gl_FragColor = vec3(1.0, uv);
}`;
sd.setShader(code);
```
or from a file:

```glsl
// sample.glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_deltaTime;

void main() {
 vec2 uv = gl_FragCoord.xy / u_resolution;
 gl_FragColor = vec3(1.0, uv);
}
```

```js
const code = await sd.loadShader("sample.glsl");
sd.setShader(code);
```

Having set the shader's code, it is now time to compile the GLSL code into a program. This is done like so:
```js
sd.buildShader();
```
It is important that the shader is built *before* adding it to a render queue or the loop, as the GLSL code must be compiled before running. This means that it is impossible to dynamically edit the shader's code while it is being rendered.

Finally, it is time to render the shader. It can be added to the loop like any other V4 class:
```js
loop.addToLoop(sd);
```
### Uniforms

In the GLSL code above, you'll notice two uniforms: `u_resolution` and `u_deltaTime`. These are automatically passed to the shader program by the shader's render function, which uses the values from the V4 loop. You can add your own uniform values to your shader program with the `setUniform` method. For example, a uniform called `u_twoPi` could be set like this:
```js
sd.setUniform("u_twoPi", Math.PI * 2);
```
### Combining 2D and WebGL

Usually, an HTML canvas can only have one drawing context like `2d` or `webgl`. This means that you cannot use the convienient 2D drawing methods *and* WebGL shaders and 3D objects. V4 provides a way to bridge this gap by offering the ability to draw to the canvas with 2D methods and access to this drawing in a shader as a texture, so you can combine 2D drawings with shader effects. 

This must be manually enabled, as it can be rather demanding:
```js
sd.useCanvasState(true);
```

Now, V4 will pass what's drawn on the canvas to your shader as a `sampler2D` uniform called `u_texture`. 

As an example, you can render a duplicate of what's currently on the canvas with a shader like this:
```glsl
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_deltaTime;

void main() {
    // get current pixel position
    vec2 uv = gl_FragCoord.xy / u_resolution;
   
    // get the pixel's color value from the texture
    vec3 tex = texture2D(u_texture, uv).rgb;

    // set the shader's color to the texture's color
    gl_FragColor = vec4(tex, 1.0);
}
```

This method provides the best of both worlds: easy 2D drawing through the canvas' context, and shader manipulation of the shapes as a texture. It can be used to create some very interesting effects; check out some of the [examples](ex1.md).

