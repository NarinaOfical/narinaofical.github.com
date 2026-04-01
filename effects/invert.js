/* global define, require */
(function (root, factory) {
'use strict';
if (typeof define === 'function' && define.amd) {
define(['seriously'], factory);
} else if (typeof exports === 'object') {
factory(require('seriously'));
} else {
if (!root.Seriously) {
root.Seriously = { plugin: function (name, opt) { this[name] = opt; } };
}
factory(root.Seriously);
}
}(window, function (Seriously) {
'use strict';

Seriously.plugin('invertToggle', {
shader: function () {
return {
vertex: [
'precision mediump float;',
'attribute vec2 position;',
'varying vec2 vTexCoord;',
'void main(void) {',
'vTexCoord = position * 0.5 + 0.5;',
'gl_Position = vec4(position, 0.0, 1.0);',
'}'
].join('\n'),
fragment: [
'precision mediump float;',
'varying vec2 vTexCoord;',
'uniform sampler2D source;',
'uniform bool r;',
'uniform bool g;',
'uniform bool b;',
'void main(void) {',
'vec4 color = texture2D(source, vTexCoord);',
'if (r) { color.r = 1.0 - color.r; }',
'if (g) { color.g = 1.0 - color.g; }',
'if (b) { color.b = 1.0 - color.b; }',
'gl_FragColor = color;',
'}'
].join('\n')
};
},
inputs: {
source: {
type: 'image'
},
r: {
type: 'boolean',
defaultValue: false
},
g: {
type: 'boolean',
defaultValue: false
},
b: {
type: 'boolean',
defaultValue: false
}
}
});

}));```
