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

  Seriously.plugin('lightrays', {
    commonShader: true,
    inputs: {
      source: {
        type: 'image',
        uniform: 'source'
      },
      intensity: {
        type: 'number',
        uniform: 'intensity',
        min: -100,
        max: 100,
        defaultValue: 0
      }
    },
    shader: function (inputs, shaderSource) {
      shaderSource.fragment = `
        precision mediump float;
        varying vec2 vTexCoord;
        uniform sampler2D source;
        uniform float intensity;

        void main() {
          vec2 uv = vTexCoord;
          vec4 color = texture2D(source, uv);

          float rays = sin((uv.x + uv.y) * 20.0) * 0.5 + 0.5;
          float effect = rays * (intensity / 100.0);

          vec3 finalColor = color.rgb + vec3(effect);

          gl_FragColor = vec4(finalColor, color.a);
        }
      `;
      return shaderSource;
    }
  });

}));
