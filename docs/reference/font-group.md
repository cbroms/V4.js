# FontGroup

For an overview and use cases, see [the guide](/text?id=fonts).

!> Ensure you have installed opentype.js before working with font groups. See the [installation instructions](/installing?id=opentype). 
<hr>

## constructor()

Create a new FontGroup.

```js
const fg = new V4.FontGroup();
```

#### Syntax 

> `FontGroup(name)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `name`  |  `string`| No  | The font's name. | 

#### Returns

| Type  | Description | 
|-------| -------- |
|  `V4.FontGroup` | The FontGroup object. |
<hr>

## loadFont()

Load a font from a file. Note that V4 only supports `.ttf` font files.

```js
const font = await fg.loadFont("assets/Helvetica-Regular.ttf", "Regular");
```

#### Syntax 

> `FontGroup.loadFont(url, variant)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `url`  |  `string`| Yes  | The font file's location. | 
| `variant`  |  `string`| No  | The font's variant. It can be any string. Omitting this field will mean the font will not be accessable for future use. | 

#### Returns

| Type  | Description | 
|-------| -------- | 
|  `opentype.Font` | The opentype font object. |
<hr>

## getFontVariant()

Get any loaded font variant from a font group. 

```js
const font = fg.getFontVariant("Regular");
```

#### Syntax 

> `FontGroup.getFontVariant(variant)`

#### Parameters

| Param | Type  | Required?  | Description  |  
|-------|-------|------------|--------------|
| `variant`  |  `string`| Yes  | The font's variant, set when the font was loaded with `loadFont`. | 

#### Returns

| Type  | Description | 
|-------| -------- | 
|  `opentype.Font` | The opentype font object. |
<hr>



