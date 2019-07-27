# V4.js

## What is it?

V4.js is a lightweight animation wrapper for the HTML canvas element. It makes the animation process modular by providing an interface to add and remove code for rendering to the canvas as needed, improving performance and readability. 

V4 includes a rich text system that provides greater control over rendering text in the canvas, with methods to align text, easily change fonts, position, size, font size, colors, and other properties before only accessable via css outside the canvas. Each can also be easily animated with V4's modular rendering system. 

V4 also provides a way to bridge the gap between a standard 2D canvas and GLSL fragment shaders by making the current canvas available as a texture to be modified in a shader program. 

## A Simple Example

Include V4.js in an `index.html` page:

[](_media/intro/index.html ':include :type=code')

In `intro.js`, we import V4, get a font, create a loop, textbox, and animation: 

[](_media/intro/intro.js ':include :type=code')

Here's what results:

[](https://V4.rainflame.com/_media/intro ':include :type=iframe width=100% height=400px')