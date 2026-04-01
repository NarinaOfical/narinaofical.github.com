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

  Seriously.plugin('chromaticAberration', {
    shader: function (inputs, shaderSource) {
      shaderSource.vertex = [
        'precision mediump float;',
        'attribute vec2 position;',
        'attribute vec2 texCoord;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  vTexCoord = texCoord;',
        '  gl_Position = vec4(position, 0.0, 1.0);',
        '}'
      ].join('\n');

      shaderSource.fragment = [
        'precision mediump float;',
        'varying vec2 vTexCoord;',
        'uniform sampler2D source;',
        'uniform float intensity;',
        'void main(void) {',
        '  vec2 uv = vTexCoord;',
        '  float shift = intensity / 100.0 * 0.01;',
        '  vec2 redOffset = vec2(shift, 0.0);',
        '  vec2 blueOffset = vec2(-shift, 0.0);',
        '  float r = texture2D(source, uv + redOffset).r;',
        '  float g = texture2D(source, uv).g;',
        '  float b = texture2D(source, uv + blueOffset).b;',
        '  gl_FragColor = vec4(r, g, b, 1.0);',
        '}'
      ].join('\n');
    },
    inPlace: true,
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
    title: 'Chromatic Aberration'
  });

}));
