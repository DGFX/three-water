import {
	ShaderMaterial,
	UniformsUtils
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { MotionBlurShader } from './MotionBlurShader'

class MotionBlurPass extends Pass {

	constructor(intensity = 0.5, scene, camera, mouse) {

		super();

		const shader = MotionBlurShader;

		this.uniforms = UniformsUtils.clone(shader.uniforms);

		this.mouse = mouse;
		this.prevMouse = { x: 0, y: 0 };

		this.material = new ShaderMaterial({

			name: shader.name,
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		});

		this.material.transparent = true;

		this.uniforms.intensity.value = intensity; // (0 = no effect, 1 = full effect)

		this.fsQuad = new FullScreenQuad(this.material);

	}

	render(renderer, writeBuffer, readBuffer, deltaTime /*, maskActive */) {

		this.uniforms['tDiffuse'].value = readBuffer.texture;
		this.uniforms['time'].value += deltaTime;
		this.uniforms['uMouse'].value = this.prevMouse;


		if (this.renderToScreen) {

			renderer.setRenderTarget(null);
			this.fsQuad.render(renderer);

		} else {

			renderer.setRenderTarget(writeBuffer);
			if (this.clear) renderer.clear();
			this.fsQuad.render(renderer);

		}

		this.prevMouse.x += (this.mouse.cursorPosition.x - this.prevMouse.x) * 0.05;
		this.prevMouse.y += (this.mouse.cursorPosition.y - this.prevMouse.y) * 0.05;
	}

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	}

}

export { MotionBlurPass };
