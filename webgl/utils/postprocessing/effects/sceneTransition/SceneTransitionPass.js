import {
	ShaderMaterial,
	UniformsUtils,
	TextureLoader
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { SceneTransitionShader } from './SceneTransitionShader';
import displacementMapUrl from '../../../../assets/displacement/swirl.jpg?url'

/*
	Yuri tutorial:	https://www.youtube.com/live/EcEFrA_6kzM?si=Tvi6NbXemmglcu4s&t=3393
*/

class SceneTransitionPass extends Pass {

	constructor({ options, globalScene, camera, sceneArray }) {

		super();

		this.camera = camera;

		this.scene = globalScene;

		this.sceneArray = sceneArray;

		const shader = SceneTransitionShader;

		this.uniforms = UniformsUtils.clone(shader.uniforms);

		this.options = {
			progress: 0,
			scene1Key: undefined,
			scene2Key: undefined,
			...options
		}

		this.material = new ShaderMaterial({

			name: shader.name,
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		});

		this.material.transparent = true;

		this.fsQuad = new FullScreenQuad(this.material);

		this._loadTexture('uDisplacement', displacementMapUrl);
	}

	_loadTexture(name, url) {
		this.uniforms[name].value = new TextureLoader().load(url)
	}

	render(renderer, writeBuffer, readBuffer, deltaTime /*, maskActive */) {
		const scene1 = this.sceneArray[this.options.scene1Key];
		const scene2 = this.sceneArray[this.options.scene2Key];


		this.uniforms['time'].value += deltaTime;
		this.uniforms['progress'].value = this.options.progress;
		this.uniforms['uTexture1'].value = scene1.renderTarget.texture;
		this.uniforms['uTexture2'].value = scene2.renderTarget.texture;


		renderer.setRenderTarget(scene1.renderTarget);
		renderer.render(scene1.scene, this.camera);


		renderer.setRenderTarget(scene2.renderTarget);
		renderer.render(scene2.scene, this.camera);

		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
		} else {
			renderer.setRenderTarget(writeBuffer);
		}

		this.fsQuad.render(renderer);
	}

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	}

}

export { SceneTransitionPass };
