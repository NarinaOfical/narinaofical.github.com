/* global define, require */
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['seriously'], factory);
  } else if (typeof exports === 'object') {
    factory(require('seriously'));
  } else {
    if (!root.Seriously) {
      root.Seriously = {
        plugin: function (name, opt) {
          this[name] = opt;
        }
      };
    }
    factory(root.Seriously);
  }
}(window, function (Seriously) {
  'use strict';

  Seriously.plugin('kaleidoscope', {
    commonShader: true,

    shader: function (inputs, shaderSource) {
      shaderSource.vertex = [
        'precision mediump float;',
        'attribute vec2 position;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  vTexCoord = position * 0.5 + 0.5;',
        '  gl_Position = vec4(position, 0.0, 1.0);',
        '}'
      ].join('\n');

      shaderSource.fragment = [
        'precision mediump float;',
        'varying vec2 vTexCoord;',
        'uniform sampler2D source;',
        'uniform float angle;',
        'uniform float sides;',
        'const float PI = 3.14159265358979323846264;',
        'void main(void) {',
        '  vec2 coord = vTexCoord - 0.5;',
        '  float r = length(coord);',
        '  float a = atan(coord.y, coord.x) + radians(angle);',
        '  float tau = 2.0 * PI;',
        '  float segment = tau / sides;',
        '  a = mod(a, segment);',
        '  a = abs(a - segment * 0.5);',
        '  coord = vec2(cos(a), sin(a)) * r;',
        '  coord += 0.5;',
        '  gl_FragColor = texture2D(source, coord);',
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
      reflection: {
        type: 'number',
        uniform: 'sides',
        defaultValue: 6,
        min: 2,
        max: 24
      }
    }
  });

}));
