const MotionBlurShader = {

	name: 'MotionBlurShader',

	uniforms: {

		'tDiffuse': { value: null },
		'time': { value: 0.0 },
		'intensity': { value: 0.5 },
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

		vec2 bulge(vec2 uv, vec2 center) {
			float RADIUS = 0.25;
			float STRENGTH = .5;
			float BULGE = -0.25;

			uv -= center; // center to mouse

			float dist = length(uv) / RADIUS; // amount of distortion based on mouse pos
			float distPow = pow(dist, -2.); // exponential as you ar far from the mouse
			float strengthAmount = STRENGTH / (1.0 + distPow); // strenght

			uv *= (1. - BULGE) + BULGE * strengthAmount; // use uBulge to smoothly reset/add effect

			uv += center; // reset pos

			return uv;
		}

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			vec2 mouse = (uMouse + 1.) / 2.;
			vec2 mouseLast = vec2(0.5);

			vec2 toCenter = vec2(0.5) - vUv;

			// Fish eye

			vec2 bulgeUV = bulge(vUv, mouse);

			vec4 color = vec4(0.0);

			float d = distance(vUv,vec2(0.5));

			vec4 original = texture2D(tDiffuse, bulgeUV);


			float samples = 50.;


			// Clone buffer

			for(float i = 0.; i < samples; i++) {
				float lerp = (i + 0.1 * randd(gl_FragCoord.xy)) / samples;
				vec2 mouseStagger = mix(mouseLast, mouse, lerp);

				vec2 bulgeUVStagger = bulge(vUv, mouseStagger);


				float weight = sin(lerp * PI) * (i / samples * 0.1);

				// vec4 mySample = texture2D(tDiffuse, bulgeUVStagger + toCenter * lerp * .5);
				vec4 mySample = texture2D(tDiffuse, bulgeUVStagger);

				// mySample.rgb *= mySample.a;

				color += mySample * weight;

				color.a = 1.0 - (i / samples);
				// color.a = 0.0;
			}

			mouseLast = mouse;

			color.rgb /= samples * 0.1;

			vec4 finalColor = 1. - (1. - color) * (1. - original);


			gl_FragColor = finalColor;
		}`,

};

export { MotionBlurShader };
