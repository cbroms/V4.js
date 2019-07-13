/*
 * V4.js 1.0.0 <https://V4.rainflame.com>
 * Copyright (c) 2019 Christian Broms <cb@rainfla.me>
 * Released under Lesser GPL v3.0
 */

 var opentype_js = opentype;
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('opentype.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'opentype.js'], factory) :
    (global = global || self, factory(global.V4 = {}, global.opentype));
}(this, function (exports, opentype_js) { 'use strict';

    var empty = function () { return false; };
    var RendererPayload = /** @class */ (function () {
        function RendererPayload() {
            this.canvas = null;
            this.context = null;
            this.hasContext = empty;
            this.hasCanvas = empty;
            this.backgroundColor = "#000";
            this.deltaTime = 0;
            this.frameCount = 0;
            this.startTime = 0;
            this.fps = 0;
            this.loop = null;
        }
        return RendererPayload;
    }());
    //# sourceMappingURL=RendererPayload.js.map

    /**
     * The default background renderer function
     * @param state - the current state of the animation
     */
    var backgroundRenderer = function (state) {
        state.context.fillStyle = state.backgroundColor;
        state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
    };
    /**
     * Renderer that clears previous canvas
     * @param state - the current state of the animation
     */
    var clearPrevRenderer = function (state) {
        state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
    };
    //# sourceMappingURL=Renderers.js.map

    /**
     * @exports V4.RenderQueue
     * @class
     */
    var RenderQueue = /** @class */ (function () {
        /**
         * Create a new render queue
         * @returns - the new RenderQueue object
         */
        function RenderQueue() {
            this._rendererBuffer = [];
        }
        /**
         * Add a renderer and on done function to the end of the queue
         * @param renderer - a renderer function to be excecuted in the loop
         * @param onDone - a function that will be called when the renderer function returns false
         */
        RenderQueue.prototype.push = function (renderer, onDone) {
            var done = function () { };
            if (onDone !== undefined) {
                done = onDone;
            }
            var renderPacket = { r: renderer, d: done };
            this._rendererBuffer.push(renderPacket);
        };
        /**
         * Remove the last renderer and done function packet from the queue
         * @returns - a packet containing the the renderer and done functions
         */
        RenderQueue.prototype.pop = function () {
            return this._rendererBuffer.pop();
        };
        /**
         * The renderer for the queue- calls all render functions in the queue
         * @param state - the current state of the render loop
         */
        RenderQueue.prototype.render = function (state) {
            for (var i = 0; i < this._rendererBuffer.length; i++) {
                var packet = this.pop();
                // excecute the render function
                var res = packet.r(state);
                if (res !== undefined && !res) {
                    // renderer is complete, call on done function
                    packet.d();
                }
                else {
                    this._rendererBuffer.push(packet);
                }
            }
        };
        return RenderQueue;
    }());
    //# sourceMappingURL=RenderQueue.js.map

    /**
     * Create a new error and print it to the console
     * @param newError - error string to print
     * @returns - false
     */
    var Error = function (newError) {
        var errorString = "V4.js Error => ";
        console.error(errorString + newError);
        return false;
    };
    //# sourceMappingURL=Error.js.map

    /**
     * @exports V4.Loop
     * @class
     */
    var Loop = /** @class */ (function () {
        function Loop(canvas) {
            // set default values
            this.canvas = canvas;
            this.context = canvas ? canvas.getContext("2d") : null;
            this._loop = false;
            this._frameCount = 0;
            this._backgroundColor = "#000";
            this._fps = 30;
            this._fpsInterval = 30 / 1000;
            this._startTime = Date.now();
            this._then = Date.now();
            this.framesPerSecond(30);
            // add default renderers to animation buffer
            this._rendererBuffer = [clearPrevRenderer, backgroundRenderer];
            this._renderQueueBuffer = [];
            // set HDPI canvas scale for retina displays
            var ratio = window.devicePixelRatio;
            if (ratio !== 1) {
                var width = this.canvas.width;
                var height = this.canvas.height;
                this.canvas.width = width * ratio;
                this.canvas.height = height * ratio;
                this.canvas.style.width = width + "px";
                this.canvas.style.height = height + "px";
                this.context.scale(ratio, ratio);
            }
        }
        /**
         * Check the status of the canvas
         * @param quietly - don't throw error if canvas DNE?
         * @returns - if the canvas exists
         */
        Loop.prototype.hasCanvas = function (quietly) {
            if (quietly === void 0) { quietly = true; }
            if (!this.canvas) {
                if (quietly) {
                    return false;
                }
                else {
                    Error("Trying to access null canvas");
                }
            }
            return true;
        };
        /**
         * Check the status of the canvas' context
         * @param quietly - don't throw error if context DNE?
         * @returns - if the context exists
         */
        Loop.prototype.hasContext = function (quietly) {
            if (quietly === void 0) { quietly = true; }
            if (!this.context) {
                if (quietly) {
                    return false;
                }
                else {
                    Error("Trying to access null canvas context");
                }
            }
            return true;
        };
        /**
         * Get/set the background color of the canvas
         * @param color - the color to fill, in hex
         * @returns - the background color, in hex
         */
        Loop.prototype.backgroundColor = function (color) {
            if (color) {
                this._backgroundColor = color;
            }
            return this._backgroundColor;
        };
        /**
         * Get/set the target frames per second of canvas animations
         * @param num - target FPS
         * @param - target FPS
         */
        Loop.prototype.framesPerSecond = function (num) {
            if (num) {
                this._fps = num;
                this._fpsInterval = 1000 / num;
            }
            return this._fps;
        };
        /**
         * Add a renderer function or RenderQueue to the animation
         * @param renderer - the render function or RenderQueue object to be executed
         */
        Loop.prototype.addToLoop = function (renderer) {
            if (renderer instanceof RenderQueue) {
                this._renderQueueBuffer.push(renderer);
            }
            else {
                this._rendererBuffer.push(renderer);
            }
        };
        /**
         * Start the canvas animation
         */
        Loop.prototype.startLoop = function () {
            this._loop = true;
            this._then = window.performance.now();
            this._startTime = this._then;
            this._renderLoop(this);
        };
        /**
         * Stop/pause the canvas animation
         */
        Loop.prototype.stopLoop = function () {
            this._loop = false;
        };
        /**
         * The animation loop running at the target frames per second
         * @param self - TextCanvas class reference
         */
        Loop.prototype._renderLoop = function (self) {
            if (self._loop && self.hasCanvas() && self.hasContext()) {
                // calculate the deltaTime
                var now = window.performance.now();
                var elapsed = now - self._then;
                // window has likely been inactive; reset frame and time counters
                if (elapsed > 300) {
                    self._startTime = now;
                    self._frameCount = 0;
                    self._then = now;
                    elapsed = 0;
                }
                if (elapsed > self._fpsInterval) {
                    self._then = now - (elapsed % self._fpsInterval);
                    self._frameCount += 1;
                    var sinceStart = now - self._startTime;
                    var fps = Math.round(1000 / (sinceStart / self._frameCount));
                    // console.log(fps);
                    // create the rendererPayload object to be sent to each render function
                    var payload = new RendererPayload();
                    payload.canvas = self.canvas;
                    payload.context = self.context;
                    payload.hasContext = self.hasContext;
                    payload.hasCanvas = self.hasCanvas;
                    payload.backgroundColor = self._backgroundColor;
                    payload.deltaTime = elapsed / 1000;
                    payload.frameCount = self._frameCount;
                    payload.startTime = self._startTime;
                    payload.fps = fps;
                    payload.loop = self;
                    self.context.save();
                    // call each render function and pass rendererPayload
                    for (var _i = 0, _a = self._rendererBuffer; _i < _a.length; _i++) {
                        var renderer = _a[_i];
                        try {
                            renderer(payload);
                        }
                        catch (e) {
                            Error('Renderer function "' +
                                renderer.name +
                                '" threw an uncaught exception: "' +
                                e +
                                '" ');
                            self._loop = false;
                        }
                    }
                    // loop through the list of RenderQueues and call the render functions
                    // within each
                    for (var _b = 0, _c = self._renderQueueBuffer; _b < _c.length; _b++) {
                        var rq = _c[_b];
                        rq.render(payload);
                    }
                    self.context.restore();
                }
                var callback = function () {
                    self._renderLoop(self);
                };
                // request next frame
                requestAnimationFrame(callback);
            }
        };
        return Loop;
    }());
    //# sourceMappingURL=Loop.js.map

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * @exports V4.FontWrapper
     * @class
     */
    var FontGroup = /** @class */ (function () {
        /**
         * Create a new Font object
         * @param name - the font's name
         * @param variants - the font's variants (Italic, Regular, etc.)
         * @returns - the new Font object
         */
        function FontGroup(name, variants) {
            if (name === void 0) { name = ""; }
            if (variants === void 0) { variants = ["Regular"]; }
            this.name = name;
            this._fonts = {};
            this._variants = variants;
        }
        /**
         * Load a font and its styles from Google Fonts
         * @param name - the name of the font, case and space sensitive
         * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
         */
        FontGroup.prototype.loadGFonts = function (name, variants) {
            if (name === void 0) { name = this.name; }
            if (variants === void 0) { variants = this._variants; }
            return __awaiter(this, void 0, void 0, function () {
                var urls, _a, _b, _i, i, font;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urls = this._makeGFontUrls(name, variants);
                            this._fonts = {};
                            _a = [];
                            for (_b in variants)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            i = _a[_i];
                            if (!variants.hasOwnProperty(i)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._load(urls[i])];
                        case 2:
                            font = _c.sent();
                            this._fonts[variants[i]] = font;
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Load a font from a url or path
         * @param loc - the url/path containing the font .ttf/.otf file
         * @param name - the name of the font
         * @param variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
         */
        FontGroup.prototype.loadFont = function (loc, name, variant) {
            if (loc === void 0) { loc = ""; }
            if (name === void 0) { name = this.name; }
            if (variant === void 0) { variant = "Regular"; }
            return __awaiter(this, void 0, void 0, function () {
                var font;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.name = name;
                            return [4 /*yield*/, this._load(loc)];
                        case 1:
                            font = _a.sent();
                            this._fonts[variant] = font;
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Wrapper for opentype.js' load function to provide async/await functionality
         * @param url - the path/url to load the font
         */
        FontGroup.prototype._load = function (url) {
            return new Promise(function (resolve) {
                opentype_js.load(url, function (err, font) {
                    if (err) {
                        Promise.reject("Font could not be loaded: " + err);
                    }
                    else {
                        resolve(font);
                    }
                });
            });
        };
        /**
         * Get a specific font variant
         * @param variant - the variant to get, case and space sensitive (Italic, Bold Italic, etc.)
         * @returns - the opentype.js font object
         */
        FontGroup.prototype.getFontVariant = function (variant) {
            return this._fonts[variant];
        };
        /**
         * Create the urls to retrieve a font and its variants from Google Fonts
         * @param name - the name of the font, case and space sensitive
         * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
         * @returns - a list of urls containing .ttf files for each of the font's variants
         */
        FontGroup.prototype._makeGFontUrls = function (name, variants) {
            // make a url like this:
            // https://raw.githubusercontent.com/google/fonts/master/ofl/crimsontext/CrimsonText-Regular.ttf
            var baseUrl = "https://raw.githubusercontent.com/google/fonts/master/ofl/";
            var nameNoSpace = name.replace(" ", "");
            var nameCleaned = nameNoSpace.toLowerCase();
            var varsCleaned = variants.map(function (val) { return val.replace(" ", "").replace("-", ""); });
            return varsCleaned.map(function (val) { return baseUrl + nameCleaned + "/" + nameNoSpace + "-" + val + ".ttf"; });
        };
        return FontGroup;
    }());
    //# sourceMappingURL=FontGroup.js.map

    var unwrapOptions = function (opts, target, animState) {
        var anim = animState !== undefined;
        for (var opt in opts) {
            if (opts.hasOwnProperty(opt)) {
                switch (opt) {
                    case "font":
                        target.opts.font = opts[opt];
                        break;
                    case "fontSize":
                        target.opts.fontSize = anim
                            ? animState.easingFunc(animState.elapsed, animState.ogOpts[opt], animState.destOpts[opt], animState.duration)
                            : opts[opt];
                        break;
                    case "horizontalAlign":
                        target.opts.horizontalAlign = opts[opt];
                        break;
                    case "verticalAlign":
                        target.opts.verticalAlign = opts[opt];
                        break;
                    case "position":
                        var b = opts[opt];
                        target.opts.position = opts[opt];
                        target.opts.bounds = {
                            h: target.opts.bounds.h,
                            w: target.opts.bounds.w,
                            x1: b.x,
                            x2: b.x,
                            x3: b.x + target.opts.bounds.w,
                            x4: b.x + target.opts.bounds.w,
                            y1: b.y,
                            y2: b.y - target.opts.bounds.h,
                            y3: b.y - target.opts.bounds.h,
                            y4: b.y,
                        };
                        break;
                    case "bounds":
                        target.opts.bounds = opts[opt];
                        target.opts.position.x = opts[opt].x1;
                        target.opts.position.y = opts[opt].y1;
                        break;
                    case "color":
                        target.opts.color = opts[opt];
                        break;
                    case "backgroundColor":
                        target.opts.backgroundColor = opts[opt];
                        break;
                }
            }
        }
    };

    /**
     * @exports V4.TextBox
     * @class
     */
    var TextBox = /** @class */ (function () {
        /**
         * Create a new TextBox object
         * @param opts - object containing options
         * @returns - the new TextBox object
         */
        function TextBox(opts) {
            var bounds = {
                h: 0,
                w: 0,
                x1: 0,
                x2: 0,
                x3: 0,
                x4: 0,
                y1: 0,
                y2: 0,
                y3: 0,
                y4: 0
            };
            // set defaults
            this.opts = {
                backgroundColor: "red",
                bounds: bounds,
                color: "white",
                font: null,
                fontSize: 24,
                horizontalAlign: "RIGHT",
                lineHeight: 8,
                position: { x: 0, y: 0 },
                stroke: false,
                strokeColor: "white",
                strokeWidth: 0,
                verticalAlign: "BOTTOM"
            };
            this._modified = true;
            this._text = "";
            this._debug = false;
            this._chunks = null;
            this._textStats = {
                textHeight: 0,
                textOffsetBottom: this.opts.lineHeight,
                textWidth: 0,
                totalTextHeight: 0
            };
            this.renderer = this.renderer.bind(this);
            // if given options, set them
            if (opts !== undefined) {
                unwrapOptions(opts, this);
                this._modified = true;
            }
        }
        TextBox.prototype.options = function (opts) {
            if (opts !== undefined) {
                unwrapOptions(opts, this);
                this._modified = true;
            }
            return this.opts;
        };
        // /**
        //  * Get/set the textbox's boundaries
        //  * @param x - the x coordinate of the text box's bottom left corner, or an object containing specific bounds for the textbox
        //  * @param y - the y coordinate of the text box's bottom left corner
        //  * @param h - the height, in pixels, of the text box
        //  * @param w - the width, in pixels, of the text box
        //  * @returns - an object containing the boundary points of the textbox
        //  */
        // public bounds(x?: number | IBounds, y?: number, h?: number, w?: number): IBounds {
        //     // Corner points are assigned clockwise from bottom left:
        //      *   (x2, y2) *--------------* (x3, y3)
        //      *            |              |
        //      *            |              |
        //      *   (x1, y1) *______________* (x4, y4)
        //     if (x !== undefined && y !== undefined && h !== undefined && w !== undefined) {
        //         this.opts.bounds = {
        //             h,
        //             w,
        //             x1: x as number,
        //             x2: x as number,
        //             x3: (x as number) + w,
        //             x4: (x as number) + w,
        //             y1: y,
        //             y2: y - h,
        //             y3: y - h,
        //             y4: y
        //         };
        //         this._modified = true;
        //     } else if (x !== undefined) {
        //         this.opts.bounds = x as IBounds;
        //         this._modified = true;
        //     }
        //     return this.opts.bounds;
        // }
        /**
         * Get/set the content of the text box
         * @param newText - the text
         * @param fontSize - the font size
         * @returns - the text
         */
        TextBox.prototype.text = function (newText) {
            if (newText !== undefined) {
                this._text = newText;
                this._calcStats();
                this._modified = true;
            }
            return this._text;
        };
        /**
         * Set if the text box should be outlined
         * @param outline - outline the text box?
         * @returns - if the text box outline is activated
         */
        TextBox.prototype.outlinePath = function (outline) {
            if (outline !== undefined) {
                this._debug = outline;
                this._modified = true;
            }
            return this._debug;
        };
        /**
         * The renderer function for this text box
         * @param state - the state object
         */
        TextBox.prototype.renderer = function (state) {
            var ctx = state.context;
            ctx.save();
            // create clipping mask
            ctx.beginPath();
            ctx.moveTo(this.opts.bounds.x1, this.opts.bounds.y1);
            ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
            ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
            ctx.moveTo(this.opts.bounds.x3, this.opts.bounds.y3);
            ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
            ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
            ctx.closePath();
            ctx.clip();
            if (this._debug) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.moveTo(this.opts.bounds.x1, this.opts.bounds.y1);
                ctx.lineTo(this.opts.bounds.x2, this.opts.bounds.y2);
                ctx.moveTo(this.opts.bounds.x2, this.opts.bounds.y2);
                ctx.lineTo(this.opts.bounds.x3, this.opts.bounds.y3);
                ctx.moveTo(this.opts.bounds.x3, this.opts.bounds.y3);
                ctx.lineTo(this.opts.bounds.x4, this.opts.bounds.y4);
                ctx.moveTo(this.opts.bounds.x4, this.opts.bounds.y4);
                ctx.lineTo(this.opts.bounds.x1, this.opts.bounds.y1);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.fillStyle = this.opts.backgroundColor;
            ctx.fillRect(this.opts.bounds.x2, this.opts.bounds.y2, this.opts.bounds.w, this.opts.bounds.h);
            // const drawPos = this._animating
            //     ? this._calculateTextRenderXY()
            //     : this._drawPos;
            if (this._modified) {
                this._calculateTextRenderXY();
                this._modified = false;
            }
            for (var _i = 0, _a = this._chunks; _i < _a.length; _i++) {
                var chunk = _a[_i];
                // render font
                var absPath = this.opts.font.getPath(chunk.text, chunk.pos.x, chunk.pos.y, this.opts.fontSize);
                var drawPath = new Path2D(absPath.toPathData(2));
                ctx.fillStyle = this.opts.color;
                ctx.fill(drawPath);
            }
            ctx.restore();
        };
        TextBox.prototype._calcStats = function () {
            var absPath = this.opts.font.getPath(this._text, 0, 0, this.opts.fontSize);
            var bb = absPath.getBoundingBox();
            this._textStats.textHeight = bb.y2 - bb.y1;
            this._textStats.textOffsetBottom = bb.y2 + this.opts.lineHeight;
            this._textStats.textWidth = this.opts.font.getAdvanceWidth(this._text, this.opts.fontSize);
            this._createChunks();
        };
        /**
         * Create chunks of text such that each is less than the width of the
         * textbox plus the vertical margins
         */
        TextBox.prototype._createChunks = function () {
            var words = this._text.split(" ");
            var computedChunks = [];
            var currentWidth = 0;
            var currentChunk = "";
            for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                var word = words_1[_i];
                var curPlusWord = currentChunk !== "" ? currentChunk + " " + word : word;
                var p = this.opts.font.getPath(curPlusWord, 0, 0, this.opts.fontSize);
                var bb = p.getBoundingBox();
                if (bb.x2 - bb.x1 < this.opts.bounds.w) {
                    currentChunk = curPlusWord;
                    currentWidth = bb.x2 - bb.x1;
                }
                else {
                    computedChunks.push({
                        num: computedChunks.length + 1,
                        pos: { x: 0, y: 0 },
                        text: currentChunk,
                        width: currentWidth
                    });
                    currentChunk = word;
                    currentWidth = 0;
                }
            }
            if (currentWidth === 0) {
                var p = this.opts.font.getPath(currentChunk, 0, 0, this.opts.fontSize);
                var bb = p.getBoundingBox();
                currentWidth = bb.x2 - bb.x1;
            }
            computedChunks.push({
                num: computedChunks.length + 1,
                pos: { x: 0, y: 0 },
                text: currentChunk,
                width: currentWidth
            });
            this._textStats.totalTextHeight = computedChunks.length * this._textStats.textHeight;
            this._chunks = computedChunks;
        };
        /**
         * Calculate the x and y coordinates to start drawing the text
         * @returns - the x and y coords, via result.x and result.y
         */
        TextBox.prototype._calculateTextRenderXY = function () {
            var x;
            var y;
            this._calcStats();
            var chunksCopy = this._chunks;
            // user gave a position, use it
            for (var _i = 0, chunksCopy_1 = chunksCopy; _i < chunksCopy_1.length; _i++) {
                var chunk = chunksCopy_1[_i];
                // calc y
                if (this.opts.verticalAlign === "BOTTOM") {
                    var totalHeight = (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                        this._chunks.length;
                    y =
                        this.opts.bounds.y1 -
                            ((totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                                this._textStats.textOffsetBottom);
                }
                else if (this.opts.verticalAlign === "CENTER") {
                    var totalHeight = (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                        this._chunks.length;
                    var rowPosRelative = (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                        this._textStats.textOffsetBottom;
                    y =
                        this.opts.bounds.y1 -
                            (this.opts.bounds.h / 2 - totalHeight / 2) -
                            rowPosRelative;
                }
                else if (this.opts.verticalAlign === "TOP") {
                    var totalHeight = (this._textStats.textHeight + this._textStats.textOffsetBottom) *
                        this._chunks.length;
                    var rowPosRelative = (totalHeight / this._chunks.length) * (this._chunks.length - chunk.num) +
                        this._textStats.textOffsetBottom;
                    y = this.opts.bounds.y1 - (this.opts.bounds.h - totalHeight) - rowPosRelative;
                }
                // calc x
                if (this.opts.horizontalAlign === "LEFT") {
                    x = this.opts.bounds.x1;
                }
                else if (this.opts.horizontalAlign === "CENTER") {
                    x = this.opts.bounds.x1 + this.opts.bounds.w / 2 - chunk.width / 2;
                }
                else if (this.opts.horizontalAlign === "RIGHT") {
                    x = this.opts.bounds.x1 + (this.opts.bounds.w - chunk.width);
                }
                chunk.pos.x = x;
                chunk.pos.y = y;
            }
            return chunksCopy;
        };
        return TextBox;
    }());
    //# sourceMappingURL=TextBox.js.map

    /*
     * Open source under the BSD License.
     *
     * Copyright © 2001 Robert Penner
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    /**
     * Easing functions, originally from Rober Penner, javascript implementation from
     * https://github.com/chenglou/tween-functions, typescript port unique to this lib
     */
    const Easing = {
        linear: (t, b, end, d) => {
            const c = end - b;
            return (c * t) / d + b;
        },
        easeInQuad: (t, b, end, d) => {
            const c = end - b;
            return c * (t /= d) * t + b;
        },
        easeOutQuad: (t, b, end, d) => {
            const c = end - b;
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d / 2) < 1) {
                return (c / 2) * t * t + b;
            } else {
                return (-c / 2) * (--t * (t - 2) - 1) + b;
            }
        },
        easeInCubic: (t, b, end, d) => {
            const c = end - b;
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: (t, b, end, d) => {
            const c = end - b;
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d / 2) < 1) {
                return (c / 2) * t * t * t + b;
            } else {
                return (c / 2) * ((t -= 2) * t * t + 2) + b;
            }
        },
        easeInQuart: (t, b, end, d) => {
            const c = end - b;
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: (t, b, end, d) => {
            const c = end - b;
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d / 2) < 1) {
                return (c / 2) * t * t * t * t + b;
            } else {
                return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        easeInQuint: (t, b, end, d) => {
            const c = end - b;
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: (t, b, end, d) => {
            const c = end - b;
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d / 2) < 1) {
                return (c / 2) * t * t * t * t * t + b;
            } else {
                return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        easeInSine: (t, b, end, d) => {
            const c = end - b;
            return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
        },
        easeOutSine: (t, b, end, d) => {
            const c = end - b;
            return c * Math.sin((t / d) * (Math.PI / 2)) + b;
        },
        easeInOutSine: (t, b, end, d) => {
            const c = end - b;
            return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
        },
        easeInExpo: (t, b, end, d) => {
            const c = end - b;
            return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: (t, b, end, d) => {
            const c = end - b;
            return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
        },
        easeInOutExpo: (t, b, end, d) => {
            const c = end - b;
            if (t === 0) {
                return b;
            }
            if (t === d) {
                return b + c;
            }
            if ((t /= d / 2) < 1) {
                return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
            } else {
                return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        easeInCirc: (t, b, end, d) => {
            const c = end - b;
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: (t, b, end, d) => {
            const c = end - b;
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d / 2) < 1) {
                return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
            } else {
                return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        easeInElastic: (t, b, end, d) => {
            const c = end - b;
            let a, p, s;
            s = 1.70158;
            p = 0;
            a = c;
            if (t === 0) {
                return b;
            } else if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = (p / (2 * Math.PI)) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
        },
        easeOutElastic: function(t, b, end, d) {
            const c = end - b;
            let a, p, s;
            s = 1.70158;
            p = 0;
            a = c;
            if (t === 0) {
                return b;
            } else if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = (p / (2 * Math.PI)) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
        },
        easeInOutElastic: (t, b, end, d) => {
            const c = end - b;
            let a, p, s;
            s = 1.70158;
            p = 0;
            a = c;
            if (t === 0) {
                return b;
            } else if ((t /= d / 2) === 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = (p / (2 * Math.PI)) * Math.asin(c / a);
            }
            if (t < 1) {
                return (
                    -0.5 *
                        (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                    b
                );
            } else {
                return (
                    a *
                        Math.pow(2, -10 * (t -= 1)) *
                        Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
                        0.5 +
                    c +
                    b
                );
            }
        },
        easeInBack: (t, b, end, d, s) => {
            const c = end - b;
            if (s === void 0) {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: (t, b, end, d, s) => {
            const c = end - b;
            if (s === void 0) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: (t, b, end, d, s) => {
            const c = end - b;
            if (s === void 0) {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
            } else {
                return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
            }
        },
        easeInBounce: (t, b, end, d) => {
            const c = end - b;
            const v = Easing.easeOutBounce(d - t, 0, c, d);
            return c - v + b;
        },
        easeOutBounce: (t, b, end, d) => {
            const c = end - b;
            if ((t /= d) < 1 / 2.75) {
                return c * (7.5625 * t * t) + b;
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
            }
        },
        easeInOutBounce: (t, b, end, d) => {
            const c = end - b;
            let v;
            if (t < d / 2) {
                v = Easing.easeInBounce(t * 2, 0, c, d);
                return v * 0.5 + b;
            } else {
                v = Easing.easeOutBounce(t * 2 - d, 0, c, d);
                return v * 0.5 + c * 0.5 + b;
            }
        }
    };

    var Animation = /** @class */ (function () {
        function Animation(box, opts, duration, easing) {
            if (box instanceof TextBox) {
                this._box = box;
                this._ogOpts = box.opts;
                this.opts = box.opts;
                this._destOpts = opts;
                this._duration = duration !== undefined ? duration : 1.5;
                this._easingFunc = easing !== undefined ? Easing[easing] : Easing.easeInQuad;
                // unwrapOptions(opts, this);
            }
            this._elapsed = 0;
            this.renderer = this.renderer.bind(this);
        }
        Animation.prototype.renderer = function (state) {
            this._elapsed += state.deltaTime;
            if (this._elapsed < this._duration) {
                var animationState = {
                    duration: this._duration,
                    easingFunc: this._easingFunc,
                    elapsed: this._elapsed,
                    ogOpts: this._ogOpts,
                    destOpts: this._destOpts
                };
                // update this.opts to reflect new positions
                unwrapOptions(this.opts, this, animationState);
                // set textbox with new options and render
                this._box.options(this.opts);
                this._box.renderer(state);
            }
            else {
                this._box.renderer(state);
                return false;
            }
            return true;
        };
        return Animation;
    }());

    exports.Animation = Animation;
    exports.FontGroup = FontGroup;
    exports.Loop = Loop;
    exports.RenderQueue = RenderQueue;
    exports.TextBox = TextBox;
    exports.backgroundRenderer = backgroundRenderer;
    exports.clearPrevRenderer = clearPrevRenderer;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
