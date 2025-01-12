const NoiseShader = {

	name: 'NoiseShader',

	uniforms: {
		'uIntensity': { value: 1 },
		'uScale': { value: 0 },
		'uTime': { value: 0 },
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		#include <common>

		uniform float uIntensity;
		uniform float uScale;
		uniform float uTime;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;


		float random (vec2 p) {
			vec2 k1 = vec2(
				23.14069263277926, // epi (Gelfond's constant)
				2.665144142690225 // 2^sqrt(2) (Gelfond-Schneider constant)
			);
			return fract(
				cos(dot(p, k1)) * 12345.6789
			);
		}


		void main() {
			vec4 color = texture2D( tDiffuse, vUv );

			vec2 uvrandom = vUv;
			uvrandom.y *= random(vec2(uvrandom.y + uTime, 0.4));

			color.rgb += random(uvrandom) * 0.1;

			gl_FragColor = color;
		}`,

};

export { NoiseShader };
