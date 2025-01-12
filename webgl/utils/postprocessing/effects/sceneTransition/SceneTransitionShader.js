const SceneTransitionShader = {

	name: 'SceneTransitionShader',

	uniforms: {
		'uTexture1': { value: null },
		'uTexture2': { value: null },
		'uDisplacement': { value: null },
		'time': { value: 0.0 },
		'progress': { value: 0 },
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
	
	#define NUM_OCTAVES 5

	#include <common>
	
	
	uniform float progress;
	uniform float time;
	
	uniform sampler2D uTexture1;
	uniform sampler2D uTexture2;
	uniform sampler2D uDisplacement;
	
	varying vec2 vUv;

	void main() {
		vec4 tex1 = texture2D(uTexture1, vUv);
		vec4 tex2 = texture2D(uTexture2, vUv);
		vec4 displacement = texture2D(uDisplacement, vUv);

		vec2 uv = vUv * 2. - 1.;

		float mixer = smoothstep(displacement.r, displacement.r + .1, progress);
		vec4 finalColor = mix(tex1, tex2, mixer);

		gl_FragColor = finalColor;
		// gl_FragColor = vec4(vec3(mixer, mixer, mixer), 1.0);
	}`,

};

export { SceneTransitionShader };
