import { Vector3 } from 'three';

/**
 * Afterimage shader
 * I created this effect inspired by a demo on codepen:
 * https://codepen.io/brunoimbrizi/pen/MoRJaN?page=1&
 */

const MotiontrailShader = {

	name: 'MotiontrailShader',

	uniforms: {
		'inputTexture': { value: null },
		'fadeFactor': { value: 0.1 },
		'darkMode': { value: false },
		'uvMatrix': { value: null },
	},

	vertexShader: /* glsl */`
		uniform mat3 uvMatrix;
		varying vec2 vUv;

		void main() {

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			vUv = (uvMatrix * vec3(uv, 1.0)).xy;
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D inputTexture;
		uniform float fadeFactor;
		uniform bool darkMode;
		varying vec2 vUv;

		void main () {
			float dist = distance(vUv, vec2(0.5));
			vec4 texColor = texture2D(inputTexture, vUv);
			
			vec3 white = vec3(1.0);
			vec3 black = vec3(0.0);
			
			vec4 fadeColor = vec4(darkMode ? black : white, 1.0);

			vec4 mixColor = mix(texColor, fadeColor, fadeFactor);

			gl_FragColor = mixColor;
		}`
};

export { MotiontrailShader };
