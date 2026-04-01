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

	Seriously.plugin('swirl', {
		shader: function (inputs, shaderSource) {
			shaderSource.vertex = [
				'precision mediump float;',
				'attribute vec2 position;',
				'varying vec2 vTexCoord;',
				'void main(void) {',
				'	vTexCoord = position * 0.5 + 0.5;',
				'	gl_Position = vec4(position, 0.0, 1.0);',
				'}'
			].join('\n');

			shaderSource.fragment = [
				'precision mediump float;',
				'varying vec2 vTexCoord;',
				'uniform sampler2D source;',
				'uniform float radius;',
				'uniform float angle;',
				'void main(void) {',
				'	vec2 texCoord = vTexCoord;',
				'	vec2 center = vec2(0.5, 0.5);',
				'	vec2 tc = texCoord - center;',
				'	float dist = length(tc);',
				'	if (dist < radius) {',
				'		float percent = (radius - dist) / radius;',
				'		float theta = percent * percent * angle;',
				'		float s = sin(theta);',
				'		float c = cos(theta);',
				'		tc = vec2(',
				'			tc.x * c - tc.y * s,',
				'			tc.x * s + tc.y * c',
				'		);',
				'	}',
				'	tc += center;',
				'	gl_FragColor = texture2D(source, tc);',
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
			radius: {
				type: 'number',
				uniform: 'radius',
				defaultValue: 0.0,
				min: 0.0,
				max: 44.0
			},
			intensity: {
				type: 'number',
				uniform: 'angle',
				defaultValue: 0.0,
				min: -360.0,
				max: 360.0
			}
		},
		title: 'Swirl'
	});

}));
