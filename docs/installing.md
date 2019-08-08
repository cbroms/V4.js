# Installing 

### NPM 

```shell
npm i v4js
```
V4 can be imported as a module:

```js
import V4 from "v4js";
```

Or with a require:

```js
const V4 = require("v4js");
```

You can also directly import certain classes, for example:
```js
import { Loop, RenderQueue } from "v4js";
```

### Opentype 

For rendering text, V4 uses [opentype.js](https://github.com/opentypejs/opentype.js). If you are using V4 with npm, it will get installed as a dependency. If loading from a CDN, be sure to include the latest version of opentype:

```html
<script src="https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"></script>
```

### CDN

In your html:

```html
<script src="https://cdn.jsdelivr.net/npm/v4js@latest/dist/V4.min.js"></script>
```

V4 will be exposed as a global variable called `V4`. 