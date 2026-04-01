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

Seriously.plugin('waveWarp', {
shader: function (inputs, shaderSource) {
shaderSource.fragment = [
'precision mediump float;',
'varying vec2 vTexCoord;',
'uniform sampler2D source;',
'uniform float angle;',
'uniform float phase;',
'uniform float magnitude;',
'uniform float strength;',
'void main(void) {',
'float a = radians(angle);',
'float p = radians(phase);',
'vec2 dir = vec2(cos(a), sin(a));',
'float wave = sin(dot(vTexCoord * strength, dir) + p) * magnitude / 1000.0;',
'vec2 offset = vec2(-dir.y, dir.x) * wave;',
'vec2 uv = vTexCoord + offset;',
'gl_FragColor = texture2D(source, uv);',
'}'
].join('\n');
return shaderSource;
},
inputs: {
source: {
type: 'image',
uniform: 'source'
},
angle: {
type: 'number',
uniform: 'angle',
defaultValue: 0,
min: -360,
max: 360
},
phase: {
type: 'number',
uniform: 'phase',
defaultValue: 0,
min: -360,
max: 360
},
magnitude: {
type: 'number',
uniform: 'magnitude',
defaultValue: 0,
min: 0,
max: 30
},
strength: {
type: 'number',
uniform: 'strength',
defaultValue: 0,
min: 0,
max: 1900
}
},
title: 'Wave Warp'
});

}));
