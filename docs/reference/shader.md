# Shader

For an overview and use cases, see [the guide](/guide/shaders).

## constructor()

Create a new Shader.

```js
const sd = new V4.Shader();
```

**Arguments**

- `HTMLCanvasElement` canvas (optional): the canvas that the shader will run on.

**Returns**

- `Shader` The new Shader object

`V4.Shader()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)

## loadShader()

Load a GLSL fragment shader program from a file.

```js
const code = await sd.loadShader("assets/shader.glsl");
```

**Arguments**

- `string` url: the path to the file.

**Returns**

- `Promise<string>` the shader source code as a string.

`V4.TextBox.loadShader()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
