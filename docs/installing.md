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
All exposed classes can be [found here](https://github.com/rainflame/V4.js/blob/master/src/index.ts). 

### As a script

In your html:

```html
<!-- If you are going to use text with V4, include opentype.js-->
<script src="https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"></script>
<!-- Include the latest version of V4.js-->
<script src="https://cdn.jsdelivr.net/npm/v4js@latest/dist/V4.min.js"></script>
```

V4 will be exposed as a global variable called `V4`. 