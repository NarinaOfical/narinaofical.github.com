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

Seriously.plugin('flip', {
commonShader: true,
shader: function (inputs, shaderSource) {
shaderSource.vertex = [
'precision mediump float;',
'attribute vec2 position;',
'attribute vec2 texCoord;',
'uniform float axis;',
'uniform float angle;',
'varying vec2 vTexCoord;',
'void main(void) {',
'float rad = radians(angle);',
'float s = sin(rad);',
'float c = cos(rad);',
'vec2 pos = position;',
'if (axis > 0.5) {',
'pos.y = pos.y * c - pos.x * s;',
'} else {',
'pos.x = pos.x * c - pos.y * s;',
'}',
'gl_Position = vec4(pos, 0.0, 1.0);',
'vTexCoord = texCoord;',
'}'
].join('\n');

shaderSource.fragment = [
'precision mediump float;',
'varying vec2 vTexCoord;',
'uniform sampler2D source;',
'void main(void) {',
'gl_FragColor = texture2D(source, vTexCoord);',
'}'
].join('\n');

return shaderSource;
},
inPlace: true,
inputs: {
source: {
type: 'image',
uniform: 'source'
},
axis: {
type: 'number',
uniform: 'axis',
defaultValue: 0,
min: -360,
max: 360
},
angle: {
type: 'number',
uniform: 'angle',
defaultValue: 0,
min: -360,
max: 360
}
}
});

}));
