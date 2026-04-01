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

	Seriously.plugin('hsvAdjust', {
		shader: function () {
			return {
				vertex: [
					'precision mediump float;',
					'attribute vec2 position;',
					'varying vec2 vTexCoord;',
					'void main(void) {',
					'	vTexCoord = position * 0.5 + 0.5;',
					'	gl_Position = vec4(position, 0.0, 1.0);',
					'}'
				].join('\n'),
				fragment: [
					'precision mediump float;',
					'uniform sampler2D source;',
					'uniform float hue;',
					'uniform float saturation;',
					'uniform float value;',
					'varying vec2 vTexCoord;',

					'vec3 rgb2hsv(vec3 c) {',
					'	vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);',
					'	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));',
					'	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));',
					'	float d = q.x - min(q.w, q.y);',
					'	float e = 1.0e-10;',
					'	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);',
					'}',

					'vec3 hsv2rgb(vec3 c) {',
					'	vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);',
					'	return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);',
					'}',

					'void main(void) {',
					'	vec4 color = texture2D(source, vTexCoord);',
					'	vec3 hsv = rgb2hsv(color.rgb);',

					'	hsv.x += hue / 360.0;',
					'	hsv.y += saturation / 100.0;',
					'	hsv.z += value / 100.0;',

					'	hsv.x = mod(hsv.x, 1.0);',
					'	hsv.y = clamp(hsv.y, 0.0, 1.0);',
					'	hsv.z = clamp(hsv.z, 0.0, 1.0);',

					'	vec3 rgb = hsv2rgb(hsv);',
					'	gl_FragColor = vec4(rgb, color.a);',
					'}'
				].join('\n')
			};
		},

		inPlace: true,

		inputs: {
			source: {
				type: 'image'
			},
			hue: {
				type: 'number',
				defaultValue: 0,
				min: -360,
				max: 360
			},
			saturation: {
				type: 'number',
				defaultValue: 0,
				min: -100,
				max: 100
			},
			value: {
				type: 'number',
				defaultValue: 0,
				min: -100,
				max: 100
			}
		}
	});
}));
