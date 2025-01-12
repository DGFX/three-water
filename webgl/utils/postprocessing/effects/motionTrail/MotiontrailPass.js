import {
	MeshBasicMaterial,
	ShaderMaterial,
	UniformsUtils,
	WebGLRenderTarget,
	LinearFilter,
	RGBAFormat,
	Matrix3,
	MathUtils,
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { MotiontrailShader } from './MotiontrailShader';

class MotiontrailPass extends Pass {

	constructor(fade = 0.1, scene, camera, darkMode) {

		super();

		this.shader = MotiontrailShader;

		this.options = {
			fadeFactor: 0.06,
			scaleX: 0.35,
			scaleY: 0.3,
			rotationAngle: 0,
			darkMode: false,
		}

		this.scene = scene;
		this.camera = camera;

		this.uvMatrix = new Matrix3();
		// tx : Float, ty : Float, sx : Float, sy : Float, rotation : Float, cx : Float, cy : Float

		this.uniforms = UniformsUtils.clone(this.shader.uniforms);
		this.uniforms['fadeFactor'].value = fade;
		this.uniforms['darkMode'].value = darkMode;
		this.uniforms['uvMatrix'].value = this.uvMatrix;

		this.fadeMaterial = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this.shader.vertexShader,
			fragmentShader: this.shader.fragmentShader,
		});

		this.fadePlane = new FullScreenQuad(this.fadeMaterial);

		this.resultMaterial = new MeshBasicMaterial({ map: null });
		this.resultPlane = new FullScreenQuad(this.resultMaterial);

		this.frameBuffer1 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			format: RGBAFormat
		});
		this.frameBuffer2 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			format: RGBAFormat
		});
	}

	render(renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/) {
		renderer.autoClearColor = false;
		this.uniforms['inputTexture'].value = this.frameBuffer1.texture;

		renderer.setRenderTarget(this.frameBuffer2);

		this.fadePlane.render(renderer);

		renderer.render(this.scene, this.camera);

		this.resultPlane.material.map = this.frameBuffer2.texture;

		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
		} else {
			renderer.setRenderTarget(writeBuffer);
		}

		this.resultPlane.render(renderer);


		// Swap buffers.

		const swap = this.frameBuffer1;
		this.frameBuffer1 = this.frameBuffer2;
		this.frameBuffer2 = swap;


		// Set fade

		this.uniforms['fadeFactor'].value = this.options.fadeFactor;
		this.uniforms['darkMode'].value = this.options.darkMode;


		// Transform UV

		const uvScaleX = this.mapNumberRange(this.options.scaleX, -1, 1, 1.05, 0.95)
		const uvScaleY = this.mapNumberRange(this.options.scaleY, -1, 1, 1.05, 0.95)
		const rotation = MathUtils.degToRad(this.options.rotationAngle)
		this.uvMatrix.setUvTransform(0, 0, uvScaleX, uvScaleY, rotation, 0.5, 0.5)
	}

	// Utils

	mapNumberRange(val, inMin, inMax, outMin, outMax) {
		return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
	}

	setSize(width, height) {
		this.frameBuffer2.setSize(width, height);
		this.frameBuffer1.setSize(width, height);
	}

	dispose() {
		this.frameBuffer2.dispose();
		this.frameBuffer1.dispose();

		this.fadeMaterial.dispose();
		this.resultMaterial.dispose();

		this.fadePlane.dispose();
		this.resultPlane.dispose();
	}
}

export { MotiontrailPass };
