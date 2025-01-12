const VolumetricRaysShader = {

	name: 'VolumetricRaysShader',

	uniforms: {

		'tDiffuse': { value: null },
		'time': { value: 0.0 },
		'intensity': { value: 5 },
		'uMouse': { value: null }
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		#include <common>

		uniform float intensity;
		uniform float time;
		uniform vec2 uMouse;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float randd(vec2 co) {
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		vec2 bulge(vec2 uv, vec2 center, bool mouseMove) {
			float RADIUS = 0.2;
			float STRENGTH = 0.8;
			float BULGE = 0.2;

			vec2 mousePos = mouseMove ? center : vec2(0.5);

			uv -= mousePos; // center to mouse

			float dist = length(uv) / RADIUS; // amount of distortion based on mouse pos
			float distPow = pow(dist, 2.); // exponential as you ar far from the mouse
			float strengthAmount = STRENGTH / (1.0 + distPow); // strenght

			uv *= (1. - BULGE) + BULGE * strengthAmount; // use uBulge to smoothly reset/add effect


			uv += mousePos; // reset pos

			return uv;
		}

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			vec2 mouse = (uMouse + 1.) / 2.;
			vec2 mouseLast = vec2(0.5);

			vec2 toCenter = vec2(0.5) - vUv;

			// Fish eye

			vec2 bulgeUV = bulge(vUv, mouse, true);

			vec4 color = vec4(0.0);

			float d = distance(vUv,vec2(0.5));

			vec4 original = texture2D(tDiffuse, bulgeUV);

			float samples = 13.;


			// Clone buffer

			for(float i = 0.; i < samples; i++) {

				float lerp = i / samples;
				vec2 mouseStagger = mix(mouseLast, mouse, lerp);
				vec2 bulgeUVStagger = bulge(vUv, mouseStagger, true);

				float weight = sin(lerp * PI);

				vec4 mySample = texture2D(tDiffuse, bulgeUVStagger);
												
				color += mySample;
			}

			mouseLast = mouse;

			color *= samples / pow(samples, 2.);

			vec4 finalColor = color;


			gl_FragColor = texture2D(tDiffuse, vUv);
			gl_FragColor = finalColor;
		}`,

};

export { VolumetricRaysShader };
