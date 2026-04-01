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

Seriously.plugin('rgbSplitSlider', {
inputs: {
source: {
type: 'image',
uniform: 'source'
},
center: {
type: 'number',
uniform: 'center',
defaultValue: 0,
min: -100,
max: 100
},
angle: {
type: 'number',
uniform: 'angle',
defaultValue: 0,
min: -360,
max: 360
}
},
shader: function (inputs, shaderSource) {
shaderSource.vertex = [
'precision mediump float;',
'attribute vec2 position;',
'attribute vec2 texCoord;',
'varying vec2 vTexCoord;',
'void main(void) {',
'vTexCoord = texCoord;',
'gl_Position = vec4(position, 0.0, 1.0);',
'}'
].join('\n');

shaderSource.fragment = [
'precision mediump float;',
'uniform sampler2D source;',
'uniform float center;',
'uniform float angle;',
'varying vec2 vTexCoord;',
'void main(void) {',
'float rad = radians(angle);',
'vec2 dir = vec2(cos(rad), sin(rad));',
'float offset = center / 100.0;',
'vec2 rOffset = dir * offset;',
'vec2 gOffset = vec2(0.0);',
'vec2 bOffset = -dir * offset;',
'float r = texture2D(source, vTexCoord + rOffset).r;',
'float g = texture2D(source, vTexCoord + gOffset).g;',
'float b = texture2D(source, vTexCoord + bOffset).b;',
'float a = texture2D(source, vTexCoord).a;',
'gl_FragColor = vec4(r, g, b, a);',
'}'
].join('\n');
}
});

}));
