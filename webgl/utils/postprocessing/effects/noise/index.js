import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { NoiseShader } from './NoiseShader';

export function createNoise({ effectComposer, onUpdate, debug, props: { intensity, scale } }) {

    const shaderPass = new ShaderPass(NoiseShader);
    effectComposer.addPass(shaderPass);

    onUpdate((time) => {
        shaderPass.uniforms.uTime.value = time;
    })
}