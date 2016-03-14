# [The Suisey](https://github.com/ghoofman/thesuisey)

The Suisey Custom Editor is a widget for creating a customized suisey for TheSuisey.com website

## Implementation

After dependencies (jQuery), SuiseyCustom requires a stylesheet, a script, and an HTML element to get the job done:

```html
<link rel="stylesheet" href="build/suisey-custom.css">

<script src="build/suisey-custom.min.js"></script>
```

The editor is generated by using the SuiseyCustom function on an html element

```html
<div class="suisey-custom-editor"></div>
<script type="text/javascript">
    var editor = new SuiseyCustom('.suisey-custom-editor');
</script>
```

## Running examples

NodeJs is required to run the examples.
In the command line in the project directory run:

```text
npm install -g bower
npm install -g http-server
npm install -g grunt-cli
bower install
npm install
grunt
http-server
open http://localhost:8080/examples
```

## Suisey Custom Editor Methods

- [addImageLayer](#addimagelayer)
- [addTextLayer](#addtextlayer)
- [addIconLayer](#addiconlayer)
- [getResult](#getresult)

### [addImageLayer()](#addimagelayer)

**addImageLayer(resource_name)**

Add a new Image Layer to the editor. It will 100% fill width and height. Image should match the same ratio as the editor for all images.

Ex: If the editor is 600 x 800 images can be 300 x 400

Example:

```js
var editor = new SuiseyCustom('.suisey-custom-editor');
editor.addImageLayer('shirt');
```

### [addTextLayer()](addtextlayer)

**addTextLayer(text, options)**

Add a new Text Layer to the editor. When placed it will be vertically and horizontally centered.

Options:

- x: x position to place the Text
- y: y position to place the Text
- size: the font size of the Text in px

Example:

```js
var editor = new SuiseyCustom('.suisey-custom-editor');
editor.addTextLayer('Text', { x: 50, y: 50, size: 32 });
```

### [addIconLayer()](#addiconlayer)

**addIconLayer(image, options)**

Add a new Icon Layer to the editor. When placed it will be vertically and horizontally centered. The img will scale based on the size of the editor.

Ex: If the editor is scaled from (600x800) to (300x400) then an icon with a size of 60x60 will be displayed at 30x30

Options:

- x: x position to place the Text
- y: y position to place the Text
- w: width of the icon
- h: height of the icon

Example:

```js
var editor = new SuiseyCustom('.suisey-custom-editor');
editor.addIconLayer('icon.png', { x: 50, y: 50, w: 32, h: 32 });
```

### [getResult()](#getresult)

**getResult()**

Gets the current json object representation of the editor.

Example:

```js
var editor = new SuiseyCustom('.suisey-custom-editor');
editor.addTextLayer('Text', { x: 50, y: 50, size: 32 });
console.log(editor.getResult());
// Prints out
// {
//    layers: [
//       {
//            name: 'Text',
//            x: 50,
//            y: 50,
//            size: 32
//        }
//    ]
// }
```
