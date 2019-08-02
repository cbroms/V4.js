# Shader

For an overview and use cases, see [the guide](/guide/shaders).

## constructor()

Create a new Shader.

```js
const sd = new V4.Shader();
```
#### Syntax 

> `Shader(canvas)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `canvas`  |  `HTMLCanvasElement` | No  | The canvas that the shader will run on.  | 


#### Returns

| Type  | Description  |  
|-------|------------|
|  `V4.Shader` | The new shader object.  | 

`V4.Shader()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)

<hr>

## buildShaders()

Compile and link the shader to a canvas. Note that if you are using the shader as part of a [loop](reference/loop.md), the WebGL canvas created by the loop for shaders can be accessed through `loop.glCanvas` (see [the guide](loop.md) for more). Otherwise, you can provide your own canvas. 

```js
const canvas = document.getElementById("myCanvas");
sd.buildShaders(canvas)

// or, as part of a loop
sd.buildShaders(loop.glCanvas);
```

#### Syntax 

> `Shader.buildShaders(canvas)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `canvas`  |  `HTMLCanvasElement` | No  | The canvas that the shader will run on.  | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `void` |   | 

`V4.TextBox.buildShaders()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## loadShader()

Asyncronously load a GLSL fragment shader program from a file.

```js
const code = await sd.loadShader("assets/shader.glsl");
```

#### Syntax 

> `Shader.loadShader(url)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `url`  |  `string` | Yes | The path to the file.  | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `Promise<string>` | The shader source code as a string.  | 

`V4.TextBox.loadShader()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## setShader()

Add a new fragment shader to the shader program. Overrides any existing fragment shader. 

```js
const code = await sd.loadShader("assets/shader.glsl");
sd.setShader(code);
```

#### Syntax 

> `Shader.setShader(source, canvas)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `source`  |  `string` | Yes | The GLSL fragment shader source code as a string. Can be loaded with [Shader.loadShader](/reference/shader?id=loadShader).  | 
| `canvas`  |  `HTMLCanvasElement` | No | The canvas that the shader will run on.  | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `void` |   | 

`V4.TextBox.setShader()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## setUniform()

Attempt to set a uniform in the shader program. If the uniform does not exist, `setUniform` will fail silently. For example, this GLSL code must exist in the shader's source
```glsl
uniform float u_twoPi;
```
in order for this to succeed:
```js
sd.setUniform("u_twoPi", Math.PI * 2);
```

#### Syntax 

> `Shader.setUniform(name, value)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `name`  |  `string` | Yes | The name of the GLSL uniform, prefixed with "_u" by convention.  | 
| `value`  |  `Number` or `Array` | Yes | The value to pass to the shader program, either a number or array of length > 0 and < 5  | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `void` |   | 

`V4.TextBox.setUniform()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## setTexture()

Attempt to set a texture uniform in the shader program. For a shader with 

```glsl
uniform sampler2D u_someTexture;
```
the uniform can be set with

```js
const img = document.getElementById("myImage");
const bit = createImageBitmap(img);
sd.setUniform("u_someTexture", bit);
```

#### Syntax 

> `Shader.setTexture(name, value)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `name`  |  `string` | Yes | The name of the GLSL sampler2D uniform, prefixed with "_u" by convention.  | 
| `value`  |  `ImageBitmap` or `ImageData` | Yes | The value to pass to the shader program.  | 

#### Returns

| Type  | Description  |  
|-------|------------|
|  `void` |   | 

`V4.TextBox.setTexture()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## useCanvasState()

Should the current state of the canvas be passed to the shader as a texture uniform? (check the [text and shader example](ex1.md) to see it in use). If `true`, the target shader code must include 
```glsl
uniform sampler2D u_texture;
```
for the shader program to get the texture. 
```js
const use = sd.useCanvasState(true)

console.log(use); // > true
```

#### Syntax 

> `Shader.useCanvasState(useState)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `useState`  |  `bool` | Yes | Activate or deactivate passing the canvas' state as texture.  | 


#### Returns

| Type  | Description  |  
|-------|------------|
|  `bool` | If the canvas' state will be passed to the shader program.  | 

`V4.TextBox.useCanvasState()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)
<hr>

## renderer()

Render the shader. The renderer will pass two uniform values to the shader program by default, `u_resolution`, a vec2 describing the canvas' height and width, and `u_deltaTime`, the deltaTime from the state. 

```js
loop.addToLoop(sd.rendrer);
```

#### Syntax 

> `Shader.renderer(state)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `state`  |  `V4.RendererPayload` | Yes | The current animation state.  | 


#### Returns

| Type  | Description  |  
|-------|------------|
|  `void` |   | 

`V4.TextBox.renderer()` defined in [src/Shader.ts](https://github.com/rainflame/V4.js/blob/master/src/Shader.ts)



