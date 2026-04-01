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

Seriously.plugin('rays', {
commonShader: true,
shader: function (inputs, shaderSource) {
shaderSource.fragment = [
'precision mediump float;',
'varying vec2 vTexCoord;',
'uniform sampler2D source;',
'uniform float intensity;',
'void main() {',
'vec2 uv = vTexCoord;',
'vec4 color = texture2D(source, uv);',
'vec2 center = vec2(0.5, 0.5);',
'vec2 dir = uv - center;',
'float dist = length(dir);',
'vec2 stepv = dir * (intensity / 100.0) * 0.02;',
'vec4 acc = vec4(0.0);',
'vec2 coord = uv;',
'for (int i = 0; i < 20; i++) {',
'coord -= stepv;',
'acc += texture2D(source, coord);',
'}',
'acc /= 20.0;',
'gl_FragColor = mix(color, acc, clamp(abs(intensity) / 100.0, 0.0, 1.0));',
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
intensity: {
type: 'number',
uniform: 'intensity',
defaultValue: 0,
min: -100,
max: 100
}
},
title: 'Rays'
});

}));
