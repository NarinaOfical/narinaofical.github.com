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

Seriously.plugin('tile', {
commonShader: true,
shader: function (inputs, shaderSource) {
shaderSource.vertex = [
'precision mediump float;',
'attribute vec3 position;',
'attribute vec2 texCoord;',
'varying vec2 vTexCoord;',
'void main(void) {',
'vTexCoord = texCoord;',
'gl_Position = vec4(position, 1.0);',
'}'
].join('\n');

shaderSource.fragment = [
'precision mediump float;',
'varying vec2 vTexCoord;',
'uniform sampler2D source;',
'uniform float scale;',
'uniform float angle;',
'void main(void) {',
'float s = max(scale, 0.0001);',
'float a = radians(angle);',
'mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));',
'vec2 uv = vTexCoord - 0.5;',
'uv = rot * uv;',
'uv *= s;',
'uv = fract(uv + 0.5);',
'gl_FragColor = texture2D(source, uv);',
'}'
].join('\n');

return shaderSource;
},
inPlace: false,
inputs: {
source: {
type: 'image',
uniform: 'source'
},
scale: {
type: 'number',
uniform: 'scale',
defaultValue: 1,
min: 0,
max: 100
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

}));```
